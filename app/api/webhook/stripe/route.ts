import { stripe } from "@/lib/stripe";
import Subscription from "@/models/subscriptionModel";
import User from "@/models/userModel";
import { headers } from "next/headers";
import Stripe from "stripe";


export async function POST(request: Request){

    const body = await request.text();

    const signature = headers().get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (error) {
        return new Response("Webhook Error", {status: 400});
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if(event.type === 'checkout.session.completed'){
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
        );

        const customerId = String(session.customer);
        const user = await User.findOne({
            stripeCustomerId: customerId
        })

        if(!user){
            throw new Error("User not found...");
        }

        await Subscription.create({
            stripeSubscriptionId: subscription.id,
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            status: subscription.status,
            interval: String(subscription.items.data[0].plan.interval),
            planId: subscription.items.data[0].plan.id,
            userId: user,
        })

    }

    if(event.type === 'invoice.payment_succeeded'){
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
        );

        await Subscription.updateOne({
            stripeSubscriptionId: subscription.id
        },{
            $set:{
                currentPeriodStart: subscription.current_period_start,
                currentPeriodEnd: subscription.current_period_end,
                status: subscription.status,
                planId: subscription.items.data[0].price.id
            }
        })
    }

    return new Response(null, {status: 200});

}
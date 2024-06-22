import {
  StripePortal,
  SubscriptionPayButton,
} from "@/app/components/SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStripeSession, stripe } from "@/lib/stripe";
import Subscription from "@/models/subscriptionModel";
import User from "@/models/userModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

const featureItems = [
  { name: "Lorem ipsum service" },
  { name: "Lorem ipsum service" },
  { name: "Lorem ipsum service" },
  { name: "Lorem ipsum service" },
  { name: "Lorem ipsum service" },
];

async function getData(email: string) {
  noStore();
  try {
    const user = await User.findOne({ email }).select("_id");
    if (!user) {
      throw new Error("User not found");
    }

    const data = await Subscription.findOne({ userId: user._id }).select(
      "status userId -_id"
    );

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export default async function BillingPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.email as string);

  async function createSubscription() {
    "use server";

    const dbUser = await User.findOne({ email: user?.email }).select(
      "stripeCustomerId -_id"
    );

    if (!dbUser.stripeCustomerId) {
      throw new Error("Unable to get customer id!!!");
    }

    const subscriptionURL = await getStripeSession({
      customerId: dbUser.stripeCustomerId,
      domainUrl: "http://localhost:3000/",
      priceId: process.env.STRIPE_PRICE_ID!,
    });

    return redirect(subscriptionURL);
  }

  async function createCustomerPortal() {
    "use server";

    const userData = await User.findOne({
      email: user?.email,
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: userData?.stripeCustomerId as string,
      return_url: "http://localhost:3000/dashboard",
    });

    return redirect(session.url);
  }

  if (data?.status === "active") {
    return (
      <div className="grid items-start gap-8">
        <div className="flex items-center justify-between px-2">
          <div className="grid gap-1">
            <h1 className="text-3xl md:text-4xl font-bold">Subscription</h1>
            <p className="text-lg text-muted-foreground">
              Manage your subscription
            </p>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Edit your subscription</CardTitle>
            <CardDescription>
              Click on the below button to cancel or edit your subscription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCustomerPortal}>
              <StripePortal />
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="flex flex-col">
        <CardContent className="py-8">
          <div>
            <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary/10 text-primary">
              Monthly
            </h3>
          </div>

          <div className="mt-4 flex items-baseline text-6xl font-extrabold">
            59&#x20B9;
            <span className="ml-1 text-2xl text-muted-foreground">/month</span>
          </div>

          <p className="mt-5 text-lg text-muted-foreground">
            Write as many notes as you want for 59&#x20B9; a month
          </p>
        </CardContent>

        <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6">
          <ul className="space-y-4">
            {featureItems.map((item, index) => (
              <li key={index} className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <p className="ml-3 text-base">{item.name}</p>
              </li>
            ))}
          </ul>

          <form className="w-full" action={createSubscription}>
            <SubscriptionPayButton />
          </form>
        </div>
      </Card>
    </div>
  );
}

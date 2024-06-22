import { ReactNode } from "react";
import { DashboardNav } from "../components/DashboardNav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { Toaster } from "@/components/ui/sonner";
import { stripe } from "@/lib/stripe";

export default async function DashboardLayout({children}: {children: ReactNode}){
    dbConnect();
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    if(!user){
        redirect("/");
    }

    if(user){
        const registeredUser = await User.findOne({
            email: user.email
        });

        if(!registeredUser){
            // CREATE NEW USER
            const newUser = new User({
                email: user.email,
                firstName: user.given_name,
                lastName: user.family_name,
                picture: user.picture,
            })

            const userRegistered = await newUser.save();

            // Creating customer stripe id on registration 
            const data = await stripe.customers.create({
                email: user.email as string,
            })

            await User.updateOne({_id: userRegistered._id},{
                $set:{
                    stripeCustomerId: data.id
                }
            })
        }
        
    }
    return(
        <div className="flex flex-col space-y-6 mt-10">
            <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
                <aside className="hidden w-[200px] h-[180px] md:flex">
                    <DashboardNav />
                </aside>
                <main>{children}</main>
                <Toaster />
            </div>
        </div>
    )
}
import { Button } from "@/components/ui/button";
import dbConnect from "@/dbConfig/dbConfig";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";

export default async function Home() {
  dbConnect();

  const { isAuthenticated } = getKindeServerSession();
  return (
    <section className="flex items-center justify-center bg-background h-[90vh]">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <span className="w-auto px-6 py-3 rounded-full bg-secondary">
              <span className="text-sm font-medium text-primary">
                Sort your notes easily
              </span>
            </span>
            <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:text-6xl">
              Create notes with ease
            </h1>
            <p className="max-w-xl mx-auto mt-8 text-base lg:text-xl text-secondary-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste
              sapiente praesentium et quibusdam reprehenderit laboriosam quasi
              labore illum eum est voluptatem magni.
            </p>
          </div>

          <div className="flex justify-center max-w-sm mx-auto mt-10">
            {(await isAuthenticated()) ? (
              <Button size={"lg"} className="w-full">
                <Link href={"/dashboard"}>Go to your Dashboard</Link>
              </Button>
            ) : (
              <Button size={"lg"} className="w-full">
                <RegisterLink>Sign up</RegisterLink>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

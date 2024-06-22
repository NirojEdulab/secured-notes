import Link from "next/link";
import { ThemeToggle } from "./Themetoggle";
import { Button } from "@/components/ui/button";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { UserNav } from "./UserNav";

export async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container flex items-center justify-between">
        <Link href={"/"}>
          <h1 className="font-bold text-3xl">Notes<span className="text-primary">Saas</span></h1>
        </Link>

        <div className="flex items-center gap-x-5">
          <ThemeToggle />
          <div className="flex items-center gap-5">
            {(await isAuthenticated()) ? (
              <>
                {/* <Button variant={"outline"}>
                  <Link href={"/dashboard"}>Dashboard</Link>
                </Button>
                <Button>
                  <LogoutLink>Log out</LogoutLink>
                </Button> */}
                <UserNav firstName={user?.given_name as string} lastName={user?.family_name as string} email={user?.email as string} picture={user?.picture as string}/>
              </>
            ) : (
              <>
                <Button>
                  <LoginLink>Sign in</LoginLink>
                </Button>
                <Button variant={"secondary"}>
                  <RegisterLink>Sign up</RegisterLink>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

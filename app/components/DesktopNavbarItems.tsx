import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./Themetoggle";
import { UserNav } from "./UserNav";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { SwitchThemeToggle } from "./SwitchThemeToggle";

export async function DesktopNavbarItems(){
    const { isAuthenticated, getUser } = getKindeServerSession();
    const user = await getUser();
    return(
        <div className="items-center gap-x-5 hidden sm:flex">
          {/* <ThemeToggle /> */}
          <SwitchThemeToggle styleClass=""/>
          <div className="flex items-center gap-5">
            {(await isAuthenticated()) ? (
              <>
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
    )
}
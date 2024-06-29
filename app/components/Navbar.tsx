import Link from "next/link";
import { ThemeToggle } from "./Themetoggle";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { UserNav } from "./UserNav";
import { DesktopNavbarItems } from "./DesktopNavbarItems";
import { MobileNavbarItems } from "./MobileNavbarItems";

export async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container flex items-center justify-between">
        <Link href={"/"}>
          <h1 className="font-bold text-3xl">Secured<span className="text-primary"> Notes</span></h1>
        </Link>

        <div>
          <DesktopNavbarItems />
          <MobileNavbarItems user={user}/>
        </div>
      </div>
    </nav>
  );
}

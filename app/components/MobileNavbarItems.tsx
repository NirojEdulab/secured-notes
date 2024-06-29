"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { CreditCard, Home, LogOut, Menu, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SwitchThemeToggle } from "./SwitchThemeToggle";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

export function MobileNavbarItems({ user }: { user: any }) {
  const pathname = usePathname();
  return (
    <div className="flex sm:hidden">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="font-bold text-2xl">
              Secured <span className="text-primary">Notes</span>
            </SheetTitle>
            <SheetDescription>Your notes on secured hand</SheetDescription>
          </SheetHeader>
          <SwitchThemeToggle styleClass="mt-6"/>
          <Separator className="mt-6" />

          {user && (
            <>
              <div className="flex justify-center items-center text-center mt-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={user?.picture}
                    alt={`${user?.given_name}'s picture`}
                  />
                  <AvatarFallback>{user?.given_name}</AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-center font-normal text-md mt-2">
                {user?.given_name + " " + user?.family_name}
              </h3>
              <Separator className="mt-6" />
              <div className="">
                {navItems.map((item, key) => (
                  <Link key={key} href={item.href}>
                    <span
                      className={cn(
                        "group flex items-center rounded-md px-3 py-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href ? "bg-accent" : "bg-transparent"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4 text-primary" />
                      <span>{item.name}</span>
                    </span>
                  </Link>
                ))}
                <span className="group flex items-center rounded-md px-3 py-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer w-full">
                  <LogOut className="mr-2 h-4 w-4 text-primary" />
                  <LogoutLink className="w-full">Logout</LogoutLink>
                </span>
              </div>
            </>
          )}

          {!user && (
            <div className="flex justify-center items-center text-center mt-6 flex-col gap-5">
                <Button className="w-full">
                  <LoginLink className="w-full">Sign in</LoginLink>
                </Button>
                <Button variant={"secondary"} className="w-full">
                  <RegisterLink className="w-full">Sign up</RegisterLink>
                </Button>
            </div>
          )}

        </SheetContent>
      </Sheet>
    </div>
  );
}

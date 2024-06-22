import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { CreditCard, Home, LogOutIcon, Settings } from "lucide-react";
import Link from "next/link";

export const navItems = [
    { name: 'Home', href: "/dashboard", icon: Home },
    { name: 'Settings', href: "/dashboard/settings", icon: Settings },
    { name: 'Billing', href: "/dashboard/billing", icon: CreditCard }
]

export function UserNav({ firstName, lastName, email, picture }: { firstName: string, lastName: string, email: string, picture: string}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage src={picture} alt={`${firstName}'s picture`} />
            <AvatarFallback>{firstName}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{firstName + " " + lastName}</p>
                <p className="text-xs leading-none text-muted-foreground">{email}</p>
            </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
            {navItems.map((item, key) => (
                <DropdownMenuItem key={key}>
                    <Link href={item.href} className="w-full flex justify-between items-center p-1">
                        {item.name}
                        <span>
                            <item.icon className="w-4 h-4" />
                        </span>
                    </Link>
                </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="w-full flex justify-between items-center cursor-pointer" asChild>
            <LogoutLink>
                Logout
                <span>
                    <LogOutIcon className="w-4 h-4" />
                </span>
            </LogoutLink>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

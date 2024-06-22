import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Navbar } from "./components/Navbar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import User from "@/models/userModel";
import { unstable_noStore as noStore } from "next/cache";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Secured Notes",
  description: "Note making web application",
  icons: {
    icon: "/favicon.ico",
  },
};

async function getData(email: string) {
  noStore();
  if (email) {
    const userData = await User.findOne({
      email,
    }).select("colorScheme -_id");
    return userData;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const colorData = await getData(user?.email as string);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${
          colorData?.colorScheme ?? "theme-orange"
        }`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

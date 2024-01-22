import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { CmdBox } from "@/components/layout/cmd";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Magic - The appstore for webapps",
  description: "The appstore for webapps",
  keywords: ["Magic", "Appstore", "Webapp", "App"],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Magic - The appstore for webapps",
    description: "The appstore for webapps",
    url: "https://magic.dev",
    siteName: "Magic",
    images: [
      "https://res.cloudinary.com/derbreilm/image/upload/v1705940102/og_-_image_im91rj.png",
    ],
  },
};

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#E41717", colorBackground: "#050506" },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <Header />
          {children}
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}

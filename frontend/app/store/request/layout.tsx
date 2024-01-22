import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request - Magic",
  description: "The appstore for webapps",
  keywords: ["Magic", "Appstore", "Webapp", "App"],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Request - Magic",
    description: "The appstore for webapps",
    url: "https://magic.dev",
    siteName: "Magic",
    images: [
      "https://res.cloudinary.com/derbreilm/image/upload/v1705940102/og_-_image_im91rj.png",
    ],
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}

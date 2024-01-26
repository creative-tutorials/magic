import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store - Magic",
  description: "The appstore for webapps",
  keywords: ["Magic", "Appstore", "Webapp", "App"],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Store - Magic",
    description: "The appstore for webapps",
    url: "https://magic.dev",
    siteName: "Magic",
    images: [
      "https://res.cloudinary.com/derbreilm/image/upload/v1706286428/og_-_image_v2_ne6n7p.png",
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

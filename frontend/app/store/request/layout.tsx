import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request - Magic",
  description: "The appstore for webapps",
  keywords: ["Magic", "Appstore", "Webapp", "App"],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Request - Magic",
    description: "The appstore for webapps",
    url: "https://magic.dev",
    siteName: "Magic",
    images: [
      "https://res.cloudinary.com/derbreilm/image/upload/v1706641685/og_-_image_v3_r6f2vi.png",
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

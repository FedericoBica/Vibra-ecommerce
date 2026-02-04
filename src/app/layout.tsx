import type { Metadata } from "next";
import { inter } from "@/config/fonts";

import "./globals.css";
import { MetaPixel, Providers } from "@/components";

export const metadata: Metadata = {
  title: {
    template: "%s - Vibra Lover",
    default: "Tienda - Vibra Lover",
  },
  description: "Sex Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MetaPixel />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

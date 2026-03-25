import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";

export const metadata: Metadata = {
  title: "Binifox - Digital Agency Services",
  description: "Binifox is a professional digital agency providing web design, app development, SEO marketing, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Roboto, Playfair } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--roboto-text",
});

const playfair = Playfair({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  variable: "--playfair-text",
});

const metallica = localFont({
  src: "./metallica.ttf",
  variable: "--metallica-text",
});

export const metadata: Metadata = {
  title: {
    template: "%s | 당근 마켓",
    default: "당근 마켓",
  },
  description: "sell and buy all the things",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${playfair.variable} ${metallica.variable} bg-neutral-900 text-white max-w-screen-sm mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}

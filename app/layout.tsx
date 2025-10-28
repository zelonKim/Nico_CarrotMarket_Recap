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
    template: "%s | 캐럿 마켓",
    default: "캐럿 마켓",
  },
  description: "실시간 중고거래 플랫폼 캐럿마켓",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${playfair.variable} ${metallica.variable} bg-orange-50 text-white  mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}

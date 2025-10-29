import type { Metadata } from "next";
import { Roboto, Playfair } from "next/font/google";

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

export const metadata: Metadata = {
  title: {
    template: "%s | 캐럿 마켓",
    default: "회원가입",
  },
  description: "실시간 중고거래 플랫폼 캐럿마켓",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundImage: `url(/carrotBg.png)`,
        }}
        className={`${roboto.variable} ${playfair.variable}  text-white mt-12 max-w-screen-md mx-auto bg-cover`}
      >
        {children}
      </body>
    </html>
  );
}

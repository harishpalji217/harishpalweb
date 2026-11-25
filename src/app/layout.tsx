import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Harish Pal — Premium Web Developer",
  description:
    "Vibe coded websites for YouTubers, startups, brands, and creators. Professional web design, development, and SEO by Harish Pal.",
  keywords: [
    "web developer",
    "freelance",
    "portfolio",
    "website design",
    "Harish Pal",
  ],
  openGraph: {
    title: "Harish Pal — Premium Web Developer",
    description:
      "I create highly professional websites people can't stop watching.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=general-sans@400,500,600,700&display=swap"
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}

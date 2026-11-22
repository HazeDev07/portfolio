import type { Metadata } from "next";
import "./globals.css";

const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://haze.dev";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Haze · Desenvolvedor Full Stack",
    template: "%s · Haze",
  },
  description:
    "Desenvolvedor Full Stack. Crio sites, aplicações e sistemas com criatividade, atenção aos detalhes e propósito.",
  applicationName: "Haze",
  authors: [{ name: "Haze" }],
  creator: "Haze",
  publisher: "Haze",
  keywords: [
    "Haze",
    "desenvolvedor full stack",
    "portfólio",
    "desenvolvimento web",
    "Next.js",
    "React",
    "TypeScript",
    "sistemas sob medida",
    "apps",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Haze",
    title: "Haze · Desenvolvedor Full Stack",
    description:
      "Sites, aplicações e sistemas desenvolvidos com criatividade, atenção aos detalhes e propósito.",
    images: [
      {
        url: "/images/brand/og.png",
        width: 1200,
        height: 630,
        alt: "Haze · Desenvolvedor Full Stack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haze · Desenvolvedor Full Stack",
    description:
      "Sites, aplicações e sistemas desenvolvidos com criatividade, atenção aos detalhes e propósito.",
    images: ["/images/brand/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/images/brand/favicon.png", type: "image/png" }],
    apple: [{ url: "/images/brand/apple-touch.png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

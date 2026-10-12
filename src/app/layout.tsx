import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://asisten-kajian.online"),
  title: "Asisten Kaji Kitab & Turats — Meja Telaah Turats & Penelusuran Sanad",
  description:
    "Platform cerdas telaah literatur turats, rujukan sanad & matan kitab kuning pesantren, serta muraja'ah hafalan santri interaktif.",
  keywords: [
    "AI",
    "kitab turats",
    "kaji kitab",
    "kitab kuning",
    "hafalan Al-Quran",
    "fiqih Islam",
    "OCR kitab",
    "RAG",
    "SumoPod",
    "Google Gemini",
    "pesantren",
    "dayah",
    "karya ilmiah",
  ],
  authors: [{ name: "Tim Asisten Kaji Kitab & Turats" }],
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon.png",
  },
  openGraph: {
    title: "Asisten Kaji Kitab & Turats — Meja Telaah Turats & Penelusuran Sanad",
    description:
      "Platform cerdas telaah literatur turats, rujukan sanad & matan kitab kuning pesantren, serta muraja'ah hafalan santri interaktif.",
    url: "https://asisten-kajian.online",
    siteName: "Asisten Kaji Kitab & Turats",
    images: [
      {
        url: "/og-image.jpg",
        width: 1280,
        height: 720,
        alt: "Asisten Kaji Kitab & Turats — Meja Telaah Turats & Penelusuran Sanad",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asisten Kaji Kitab & Turats",
    description:
      "Platform cerdas telaah literatur turats, rujukan sanad & matan kitab kuning pesantren, serta muraja'ah hafalan santri interaktif.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-background text-foreground">{children}</body>
    </html>
  );
}

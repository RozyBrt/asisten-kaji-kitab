import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asisten AI Kaji Kitab & Turats — Prototype Lomba Karya Ilmiah",
  description:
    "Bot AI Pembantu Kaji Kitab (Turats) & Hafalan Al-Qur'an. Asisten cerdas berbasis AI untuk penelusuran materi kitab klasik Islam, transkripsi OCR halaman kitab, dan simulasi hafalan Al-Qur'an interaktif.",
  keywords: [
    "AI",
    "kitab turats",
    "kaji kitab",
    "hafalan Al-Quran",
    "fiqih Islam",
    "OCR kitab",
    "RAG",
    "Google Gemini",
    "lomba karya ilmiah",
  ],
  authors: [{ name: "Tim Prototype Lomba Karya Ilmiah" }],
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

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pipedaza.dev"),
  title: "Juan Felipe Daza — Software Developer",
  description:
    "Portfolio de Juan Felipe Daza. Aplicaciones web, herramientas, automatización y productos digitales.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://pipedaza.dev",
    siteName: "pipedaza.dev",
    title: "Juan Felipe Daza — Software Developer",
    description: "Aplicaciones web, herramientas, automatización y productos digitales.",
  },
  twitter: {
    card: "summary",
    title: "Juan Felipe Daza — Software Developer",
    description: "Aplicaciones web, herramientas, automatización y productos digitales.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}

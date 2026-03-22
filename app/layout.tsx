import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// viewport deve ser um named export separado de metadata (API Next.js 14+).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // Desabilita zoom do usuário para experiência nativa no WebView Android.
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Vibe Bird",
  description: "Scanner de boleto e Pix",
  // Este app é embutido no Android — não deve ser indexado por buscadores.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full`}>
      <head>
        {/*
          Registra window.VibeBird ANTES do React hidratar para evitar race condition:
          se o Android chamar onScanResult enquanto os bundles ainda carregam,
          o payload é enfileirado em _vibeBirdQueue e drenado por registerScanListener no mount.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window._vibeBirdQueue = [];
              window.VibeBird = {
                onScanResult: function(payload) {
                  window._vibeBirdQueue.push(payload);
                }
              };
            `,
          }}
        />
      </head>
      {/*
        overflow-hidden previne o efeito de bounce/overscroll do Android WebView
        que pode parecer estranho em um app nativo.
      */}
      <body className="h-full overflow-hidden bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

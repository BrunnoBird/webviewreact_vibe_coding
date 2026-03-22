import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: gera out/ com HTML/CSS/JS estáticos para o Android WebView carregar.
  output: "export",

  // Requisito do static export: desabilita otimização de imagens server-side.
  // Como este app não usa imagens pesadas, não há impacto prático.
  images: {
    unoptimized: true,
  },

  // trailingSlash: true,
  // Descomentar se o Android carregar páginas via file:// (ex: file:///android_asset/out/resultado/index.html).
  // Deixar comentado se o Android usar um servidor local (http://localhost) ou asset:// com suporte a SPA.
};

export default nextConfig;

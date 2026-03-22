import type { AndroidBridge } from "./types";
import { mockBridge } from "./mock";

/**
 * Retorna a instância de AndroidBridge disponível no contexto atual.
 *
 * - Dentro do Android WebView: retorna window.AndroidBridge (injetado pelo app nativo).
 * - Fora do WebView (browser, dev): retorna mockBridge com aviso no console.
 *
 * IMPORTANTE: Chame esta função apenas em contextos client-side:
 *   - Dentro de useEffect
 *   - Dentro de event handlers
 *   - Em qualquer lugar após o mount do componente
 *
 * Nunca chame no topo de um módulo ou em Server Components — window não existe lá.
 */
export function getBridge(): AndroidBridge {
  if (typeof window === "undefined") {
    // Este branch executa durante o prerender estático (next build).
    // Não deve ser alcançado se os chamadores seguirem o padrão useEffect.
    throw new Error(
      "[native-bridge] getBridge() chamado fora do contexto do browser. " +
        "Use apenas dentro de useEffect ou event handlers."
    );
  }

  if (window.AndroidBridge) {
    return window.AndroidBridge;
  }

  // Sem bridge real: usar mock. Isso acontece em browser dev e em produção
  // quando a página é aberta fora do WebView Android (ex: link compartilhado).
  console.warn(
    "[native-bridge] window.AndroidBridge não encontrado. Usando mock. " +
      "Isso é esperado em desenvolvimento mas indica erro em produção no WebView."
  );

  return mockBridge;
}

// Re-exporta todos os tipos para que consumers importem apenas de "@/lib/native-bridge".
export type { AndroidBridge, ScanResult, ScanResultType } from "./types";

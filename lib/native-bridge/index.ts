import type { AndroidBridge, ScanEventPayload } from "./types";
import { mockBridge, simulateScanPush } from "./mock";

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

/**
 * Registra um listener para eventos de scan no padrão push (ML Kit Scan Bridge).
 *
 * O Android chama window.VibeBird.onScanResult(payload) via evaluateJavascript().
 * Este listener é notificado imediatamente quando isso ocorre, inclusive para
 * eventos que chegaram antes do React montar (drenados da _vibeBirdQueue).
 *
 * Em ambientes sem WebView (browser, dev server), dispara um push simulado após 1.5s.
 *
 * IMPORTANTE: Chame apenas dentro de useEffect — nunca no topo de um módulo.
 *
 * @returns função de cleanup que cancela o listener.
 */
export function registerScanListener(
  cb: (payload: ScanEventPayload) => void
): () => void {
  if (typeof window === "undefined") {
    throw new Error(
      "[native-bridge] registerScanListener() chamado fora do browser. " +
        "Use apenas dentro de useEffect."
    );
  }

  // Substitui o handler de queue pelo callback ativo.
  if (window.VibeBird) {
    window.VibeBird.onScanResult = cb;
  }

  // Drena eventos que chegaram antes do React montar (enfileirados pelo script inline).
  const queue = window._vibeBirdQueue ?? [];
  window._vibeBirdQueue = [];
  queue.forEach((pending) => cb(pending));

  // Modo dev/browser: simula push de evento após delay.
  if (!window.AndroidBridge) {
    console.warn(
      "[native-bridge] window.AndroidBridge não encontrado. Simulando push de scan. " +
        "Esperado em desenvolvimento, indica erro em produção no WebView."
    );
    simulateScanPush(cb);
  }

  return () => {
    // Restaura handler de queue ao desmontar para não perder eventos entre remounts.
    if (window.VibeBird) {
      window.VibeBird.onScanResult = (payload) => {
        (window._vibeBirdQueue ??= []).push(payload);
      };
    }
  };
}

// Re-exporta todos os tipos para que consumers importem apenas de "@/lib/native-bridge".
export type {
  AndroidBridge,
  ScanResult,
  ScanResultType,
  ScanEventPayload,
  ScanSuccessPayload,
  ScanErrorPayload,
  ScanErrorCode,
  VibeBirdGlobal,
} from "./types";

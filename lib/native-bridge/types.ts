/**
 * Contrato de tipos para a bridge nativa Android.
 * Este arquivo é a fonte da verdade para o time Android implementar o lado Kotlin/Java.
 * Derivado de: specs/scanner-bridge.spec.md
 */

/** Tipo inferido do resultado escaneado pelo web side. */
export type ScanResultType = "boleto" | "pix" | "unknown";

/** Resultado retornado pelo scanner após uma leitura bem-sucedida. */
export interface ScanResult {
  /** Valor decodificado: linha digitável do boleto ou chave Pix. */
  value: string;
  /** Tipo inferido baseado no formato do value. */
  type: ScanResultType;
  /** Formato original do scanner (ex: "QR_CODE", "CODE_128"). Passthrough do Android. */
  rawFormat?: string;
}

/**
 * Interface da bridge nativa injetada pelo Android via addJavascriptInterface().
 *
 * NOTA PARA O TIME ANDROID:
 * O método openScanner() é declarado aqui como Promise porque o web side
 * cria a Promise internamente. O lado Android deve chamar um callback JS
 * (ex: window.__scannerResolve(result)) após o scan.
 * Veja specs/scanner-bridge.spec.md Open Question #3 para as opções de implementação.
 */
export interface AndroidBridge {
  /**
   * Abre a câmera em modo scanner.
   * Resolve com ScanResult ao concluir o scan.
   * Rejeita se o usuário cancelar ou ocorrer erro.
   */
  openScanner(): Promise<ScanResult>;
}

/** Augmentação global para que TypeScript reconheça window.AndroidBridge sem cast. */
declare global {
  interface Window {
    AndroidBridge?: AndroidBridge;
  }
}

// --- ML Kit Scan Bridge (push pattern) ---
// Derivado de: specs/ml-kit-scan-bridge.spec.md

/** Código de erro padronizado enviado pelo Android após falha no scan. */
export type ScanErrorCode =
  | "CAMERA_DENIED"
  | "NO_BARCODE_FOUND"
  | "TIMEOUT"
  | "CANCELLED"
  | "UNKNOWN_ERROR";

/** Payload enviado pelo Android em caso de scan bem-sucedido. */
export interface ScanSuccessPayload {
  status: "success";
  /** Linha digitável do boleto ou chave Pix decodificada. */
  value: string;
  /** Tipo inferido pelo nativo ou pelo web. */
  type: ScanResultType;
  /** Formato raw retornado pelo ML Kit (ex: "CODE_128", "QR_CODE"). */
  rawFormat?: string;
}

/** Payload enviado pelo Android em caso de falha ou cancelamento. */
export interface ScanErrorPayload {
  status: "error";
  code: ScanErrorCode;
  /** Mensagem humana opcional para log/debug. */
  message?: string;
}

/** Union discriminada — único tipo que atravessa o bridge de push. */
export type ScanEventPayload = ScanSuccessPayload | ScanErrorPayload;

/** Namespace global registrado pela WebView para receber eventos do nativo. */
export interface VibeBirdGlobal {
  onScanResult(payload: ScanEventPayload): void;
}

declare global {
  interface Window {
    VibeBird?: VibeBirdGlobal;
    /** Fila de eventos recebidos antes do React montar. Drenada por registerScanListener. */
    _vibeBirdQueue?: ScanEventPayload[];
  }
}

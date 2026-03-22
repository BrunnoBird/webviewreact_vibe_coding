import type { AndroidBridge, ScanResult } from "./types";

/**
 * Mock da AndroidBridge para uso em ambientes sem WebView real (browser, dev server).
 * Simula 1 segundo de delay e retorna um boleto de exemplo válido.
 *
 * Para testar o fluxo de Pix, substitua temporariamente o valor retornado:
 * { value: "00020126330014br.gov.bcb.pix01114455667789011520400005303986540510.005802BR", type: "pix", rawFormat: "QR_CODE" }
 */
export const mockBridge: AndroidBridge = {
  openScanner(): Promise<ScanResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          value: "23793380296040641000260006401011291230000010000",
          type: "boleto",
          rawFormat: "CODE_128",
        });
      }, 1000);
    });
  },
};

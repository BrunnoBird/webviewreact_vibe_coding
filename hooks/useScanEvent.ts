"use client";

import { useEffect, useState } from "react";
import { registerScanListener } from "@/lib/native-bridge";
import type { ScanSuccessPayload, ScanErrorPayload } from "@/lib/native-bridge";

export interface ScanEventState {
  result: ScanSuccessPayload | null;
  error: ScanErrorPayload | null;
  /** true enquanto aguarda o próximo evento de scan do Android. */
  isScanning: boolean;
}

/**
 * Hook que escuta eventos de scan enviados pelo Android via window.VibeBird.onScanResult().
 *
 * Registra o listener no mount e cancela no unmount.
 * Em dev/browser, dispara um push simulado após ~1.5s via mockBridge.
 *
 * Uso:
 * ```tsx
 * const { result, error, isScanning } = useScanEvent();
 * ```
 */
export function useScanEvent(): ScanEventState {
  const [result, setResult] = useState<ScanSuccessPayload | null>(null);
  const [error, setError] = useState<ScanErrorPayload | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    setIsScanning(true);

    const unregister = registerScanListener((payload) => {
      if (payload.status === "success") {
        setResult(payload);
        setError(null);
      } else {
        setError(payload);
        setResult(null);
      }
      setIsScanning(false);
    });

    return unregister;
  }, []);

  return { result, error, isScanning };
}

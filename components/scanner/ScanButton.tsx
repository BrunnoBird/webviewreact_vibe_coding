"use client";

import { useCallback, useEffect, useState } from "react";
import { getBridge } from "@/lib/native-bridge";
import type { ScanResult } from "@/lib/native-bridge";

export function ScanButton() {
  const [bridgeAvailable, setBridgeAvailable] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // window.AndroidBridge só existe no client-side, após o mount.
  useEffect(() => {
    setBridgeAvailable(!!window.AndroidBridge);
  }, []);

  const handleScan = useCallback(async () => {
    if (scanning) return;
    setError(null);
    setLastResult(null);
    setScanning(true);

    try {
      const result = await getBridge().openScanner();
      setLastResult(result);
    } catch {
      setError("Não foi possível concluir o escaneamento.");
    } finally {
      setScanning(false);
    }
  }, [scanning]);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleScan}
        disabled={scanning}
        aria-label="Abrir scanner de câmera"
        className="flex h-14 w-full max-w-xs items-center justify-center rounded-full bg-foreground px-8 text-base font-semibold text-background disabled:opacity-50 active:opacity-80"
      >
        {scanning ? "Escaneando…" : "Escanear"}
      </button>

      {!bridgeAvailable && (
        <p className="text-xs text-amber-500" role="status">
          Modo navegador: scanner simulado
        </p>
      )}

      {lastResult && (
        <p className="text-xs text-green-600 break-all text-center max-w-xs" role="status">
          Lido: {lastResult.value}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

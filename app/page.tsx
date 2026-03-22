import { ScanButton } from "@/components/scanner/ScanButton";

export default function HomePage() {
  return (
    <main className="flex h-full flex-col items-center justify-between px-6 py-12">
      <header className="flex w-full flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Vibe Bird</h1>
        <p className="text-sm text-zinc-500">
          Escaneie seu boleto ou chave Pix
        </p>
      </header>

      <section
        aria-label="Área do viewfinder"
        className="flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300"
      >
        <span className="text-xs text-zinc-400">Câmera inativa</span>
      </section>

      <footer className="flex w-full flex-col items-center gap-4">
        <ScanButton />
        <p className="text-xs text-zinc-400 text-center">
          Aponte a câmera para o código de barras ou QR Code
        </p>
      </footer>
    </main>
  );
}

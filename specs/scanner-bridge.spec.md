# Spec: Android Native Scanner Bridge

## Status
- [x] Draft
- [ ] Approved
- [ ] Implemented
- [ ] Tested

## Purpose
Define o contrato entre as páginas Next.js (WebView) e o aplicativo Android host para
escaneamento de câmera de boletos e QR Codes Pix.

Este spec deve ser aprovado pelo time web **e** pelo time Android antes de qualquer
implementação começar em ambos os lados.

---

## Contracts

### Types (`lib/native-bridge/types.ts`)

```typescript
type ScanResultType = "boleto" | "pix" | "unknown";

interface ScanResult {
  value: string;          // código de barras ou chave Pix decodificada
  type: ScanResultType;   // tipo inferido pelo web (baseado no formato do value)
  rawFormat?: string;     // formato original do scanner (ex: "QR_CODE", "CODE_128")
}

interface AndroidBridge {
  openScanner(): Promise<ScanResult>;
}

declare global {
  interface Window {
    AndroidBridge?: AndroidBridge;
  }
}
```

### Inputs
- Usuário toca o botão "Escanear" na página web.
- A página chama `window.AndroidBridge.openScanner()`.

### Outputs / Side Effects
- Android abre a câmera em modo scanner.
- Scan bem-sucedido: resolve `Promise<ScanResult>` com o valor decodificado.
- Cancelamento pelo usuário: rejeita a Promise (ver Open Questions #1).
- Erro de scanner: rejeita a Promise com mensagem de erro.

---

## Behavior

### Happy Path
1. Usuário toca "Escanear".
2. `ScanButton` chama `getBridge().openScanner()`.
3. Android abre overlay de câmera fullscreen.
4. Usuário aponta câmera para boleto (CODE_128) ou Pix (QR_CODE).
5. Android decodifica e chama o resolver da Promise com `ScanResult`.
6. Web exibe o valor lido e navega para próxima etapa (fora do escopo deste spec).

### Error / Edge Cases
- **Sem bridge (dev/browser):** `getBridge()` retorna `mockBridge`. Mock resolve após 1s com boleto de exemplo. UI exibe aviso "Modo navegador: scanner simulado".
- **Cancelamento pelo usuário:** veja Open Questions #1.
- **Permissão de câmera negada:** Android é responsável por solicitar permissão. Web recebe Promise rejeitada com mensagem descritiva.
- **Chamadas simultâneas:** web deve desabilitar o botão enquanto `openScanner()` está pendente para evitar múltiplas chamadas.
- **Bridge injetada com atraso:** veja Open Questions #2.

---

## Integration Points

| Módulo | Papel |
|---|---|
| `window.AndroidBridge` | Injetado pelo Android via `WebView.addJavascriptInterface()` |
| `lib/native-bridge/index.ts` | Accessor web-side (`getBridge()`) |
| `lib/native-bridge/mock.ts` | Implementação mock para dev/browser |
| `components/scanner/ScanButton.tsx` | Único consumidor no escopo atual |

---

## Out of Scope
- Validação ou processamento do valor escaneado (boleto/pix).
- Navegação após escaneamento bem-sucedido.
- Implementação Android (Java/Kotlin) — este spec define apenas o contrato JS.
- Alternativa via `postMessage` como transporte (pode ser endereçado em spec futura).

---

## Open Questions

1. **Comportamento de cancelamento:** cancelamento pelo usuário deve ser um reject da Promise ou um resolve com value vazio `{ value: "", type: "unknown" }`?
   > Recomendação: `reject` com `{ code: "USER_CANCELLED" }` para tratamento limpo via `try/catch`.

2. **Timing de injeção da bridge:** `window.AndroidBridge` é garantido antes do `DOMContentLoaded`? Ou pode haver race condition em dispositivos lentos?
   > Se houver race condition, precisamos de um polling/retry na web ou evento customizado disparado pelo Android.

3. **Promise vs Callback:** `WebView.addJavascriptInterface()` do Android não suporta retorno de `Promise` nativamente. O time Android deve implementar um dos seguintes mecanismos:
   - **Opção A (recomendada):** Android expõe método síncrono que registra um callback JS — a web cria a Promise internamente e resolve via callback.
   - **Opção B:** Usar `evaluateJavascript()` do Android para chamar `window.__scannerCallback(result)` após o scan.
   - **Opção C:** Usar `postMessage` / `window.dispatchEvent` para comunicação bidirecional.
   > A escolha impacta a implementação de `lib/native-bridge/index.ts`.

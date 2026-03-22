# PRD: Recepção de Eventos de Scan via ML Kit (Native → WebView)

## Status
- [x] Draft
- [ ] Approved
- [ ] Specced

## Referência da Task
_(Sem ID de board — originado de requisito técnico direto do desenvolvedor)_

---

## Contexto / Problema

O app Android usará o **ML Kit Barcode Scanning** (Google) para ler códigos de barras de boletos diretamente via câmera nativa. Após o reconhecimento, a SDK nativa emite dois tipos de evento: **sucesso** (valor do código lido) ou **erro** (falha de leitura, câmera negada, timeout etc.).

A WebView não possui acesso direto à câmera nem ao ciclo de vida do scanner — ela é passiva e depende de que o Android empurre os resultados para ela. Sem um contrato claro de comunicação (nativo → JS), a WebView não sabe quando o scan terminou, qual foi o resultado, nem como reagir.

**Impacto de não ter isso:** Toda integração com ML Kit fica bloqueada. A UI na WebView não consegue avançar no fluxo do usuário após o scan.

---

## Objetivos

- Definir e documentar o **contrato de eventos** que o Android deve invocar na WebView após o scan (sucesso e erro).
- Preparar a WebView para **escutar esses eventos** de forma robusta, com tipagem TypeScript completa.
- Garantir que o `lib/native-bridge` existente reflita o novo padrão de comunicação empurrado pelo nativo (event-push), complementando o modelo Promise atual.
- Ter um **mock funcional** que simule o push nativo para desenvolvimento sem dispositivo físico.

---

## Usuários Afetados

| Persona | Momento no fluxo |
|---|---|
| Usuário final (pagador de boleto) | Toca "Escanear" → o nativo abre câmera ML Kit → a WebView recebe o código e avança |
| Time Android | Implementa a chamada JS após o scan (`window.VibeBird.onScanResult(...)`) |
| Dev Web (este projeto) | Implementa os listeners na WebView e consome os valores |

---

## User Stories

- Como **usuário**, quero que após escanear o código de barras do boleto a tela mostre automaticamente o valor lido, para que eu não precise digitar nada.
- Como **usuário**, quero ver uma mensagem de erro clara quando o scan falhar, para que eu entenda o que aconteceu e possa tentar novamente.
- Como **dev Android**, quero saber exatamente qual função JS chamar e com qual payload após o scan, para implementar o lado nativo sem ambiguidade.
- Como **dev Web**, quero que os eventos do nativo cheguem tipados e validados no JS, para consumir o resultado com segurança em qualquer componente.

---

## Critérios de Aceitação

- [ ] O Android pode chamar `window.VibeBird.onScanResult(payload)` com um único ponto de entrada que cobre sucesso e erro.
- [ ] O payload de **sucesso** contém: `status: "success"`, `value: string` (linha digitável), `type: "boleto" | "pix" | "unknown"`, `rawFormat?: string`.
- [ ] O payload de **erro** contém: `status: "error"`, `code: string` (ex: `"CAMERA_DENIED"`, `"NO_BARCODE_FOUND"`, `"TIMEOUT"`, `"CANCELLED"`), `message?: string`.
- [ ] A WebView expõe `window.VibeBird` via um script de inicialização que registra o handler antes de qualquer interação do usuário.
- [ ] O `lib/native-bridge` é atualizado com os novos tipos (`ScanEventPayload`, `ScanSuccessPayload`, `ScanErrorPayload`) e o `mockBridge` simula o push de evento após delay.
- [ ] Existe um hook React (`useScanEvent`) que encapsula a escuta do evento e expõe `{ result, error, isScanning }`.
- [ ] O mock de desenvolvimento reproduz o comportamento de push (não Pull/Promise) — o nativo "empurra" sem a WebView chamar nada.
- [ ] Toda a documentação do contrato está em `specs/ml-kit-scan-bridge.spec.md` com exemplos de código Kotlin e JS lado a lado.

---

## Fora do Escopo

- Implementação do lado Kotlin/Android (responsabilidade do time Android).
- Lógica de negócio após receber o código (validação da linha digitável, chamada de API de pagamento etc.).
- Suporte a outros tipos de documento além de boleto e Pix nesta entrega.
- Abertura da câmera iniciada pelo lado Web (isso já existe via `openScanner()` no bridge atual).
- UI de permissão de câmera (gerenciada pelo Android nativo).

---

## Riscos e Dependências

| Risco | Mitigação |
|---|---|
| Time Android ainda não definiu se vai usar `addJavascriptInterface` ou `evaluateJavascript` para o push | ⚠️ suposição — confirmar com o time. PRD assume `window.VibeBird.onScanResult` exposto pelo JS (WebView registra o handler; Android chama via `evaluateJavascript`). |
| Colisão de nomenclatura com `window.AndroidBridge` já existente | Usar namespace `window.VibeBird` para os eventos de push, mantendo `window.AndroidBridge` para chamadas iniciadas pelo Web. |
| WebView pode não estar pronta quando o Android emitir o primeiro evento | O handler deve ser registrado no script global antes do React hidratar. |
| Diferentes versões do ML Kit retornam `rawFormat` com strings distintas | Documentar os valores esperados no spec e tratar `unknown` como fallback. |

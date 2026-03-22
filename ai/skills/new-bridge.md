# Skill: new-bridge

## Trigger
Invocar quando houver uma spec de **integração nativa** com status `[x] Approved` e o time precisar gerar o contrato de tipos e o mock.

Exemplos:
- "Gera os tipos do bridge de pagamento"
- "Cria o mock para o bridge de notificações"
- "O time Android aprovou a spec do bridge de câmera, gera o lib"

## Pré-requisito Obrigatório
Spec de bridge aprovada em `specs/` (ex: `specs/scanner-bridge.spec.md` com `[x] Approved`). Se não aprovada, **não executar**.

## Input Necessário
- Caminho da spec aprovada
- Nome do bridge (ex: `scanner`, `payment`, `notifications`)

## Output

### Nível 1 (padrão)
Apenas os **tipos TypeScript** derivados da spec:

```
Arquivos a criar:
  lib/[nome]-bridge/types.ts    ← interfaces + augmentação de Window
  lib/[nome]-bridge/mock.ts     ← mock de desenvolvimento
  lib/[nome]-bridge/index.ts    ← getBridge() factory

Próximo passo: peça "nível 2" para ver o código de cada arquivo.
```

### Nível 2 (on request: "gera os arquivos")
Código completo dos 3 arquivos:

**`types.ts`** — Interfaces TypeScript extraídas diretamente da seção "Contracts" da spec. Inclui `declare global { interface Window { ... } }`.

**`mock.ts`** — Mock que implementa a interface. Usa dados realistas (número de boleto válido, chave Pix de exemplo). Simula delay de 1-2 segundos.

**`index.ts`** — `getBridge()` factory com:
- Guard `typeof window === "undefined"` (SSR safety)
- Retorna `window.[BridgeName]` se presente (WebView real)
- Retorna `mockBridge` em dev e prod sem bridge (com `console.warn`)
- Re-exporta todos os tipos para que consumers importem só de `lib/[nome]-bridge`

### Nível 3 (on request: "documenta a estratégia de Promise")
Explica as 3 opções de implementação para o time Android resolver o problema de Promise vs Callback (ver `specs/scanner-bridge.spec.md` Open Question #3), com exemplo de código Kotlin/Java para cada opção.

## Princípios do Desenvolvedor

O código gerado aplica SOLID no contexto do contrato nativo:
- **S:** `types.ts` define apenas o contrato; `mock.ts` implementa apenas o mock; `index.ts` gerencia apenas o acesso. Um arquivo, uma responsabilidade.
- **I:** Interface do bridge expõe apenas os métodos descritos na spec — sem métodos genéricos para "outros casos futuros".
- **D:** Componentes dependem da abstração `getBridge()` de `index.ts`, nunca de `window.AndroidBridge` diretamente.

Adicionalmente:
- Nomes de variáveis/funções em inglês; mensagens de `console.warn` podem ser em inglês.
- Sem `any` — toda tipagem derivada da spec.

## Constraints
- **Nunca** implementar lógica de negócio no bridge — apenas transporte de dados.
- **Nunca** acessar o bridge fora de Client Components (`'use client'`).
- O mock **deve** implementar a mesma interface que o bridge real — sem duck typing.
- O arquivo `index.ts` é o único ponto de acesso ao bridge — componentes não importam de `types.ts` ou `mock.ts` diretamente (exceto para testes).

## Estrutura de Arquivos Padrão

```
lib/
  [nome]-bridge/
    types.ts    ← contrato (fonte da verdade para o time Android)
    mock.ts     ← dev/test implementation
    index.ts    ← getBridge() + re-exports
```

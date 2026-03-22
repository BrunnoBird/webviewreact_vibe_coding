# Skill: new-component

## Trigger
Invocar quando houver uma spec de **componente** com status `[x] Approved` e o desenvolvedor quiser gerar o Client Component.

Exemplos:
- "Cria o componente ResultCard conforme a spec"
- "Gera o BarcodeDisplay seguindo os tipos da spec"

## Pré-requisito Obrigatório
Spec aprovada em `specs/` ou como parte de uma spec de page. Se não houver spec aprovada, **não executar esta skill**.

## Input Necessário
- Nome do componente
- Spec de referência (caminho ou conteúdo)
- Localização desejada (ex: `components/scanner/`)

## Output

### Nível 1 (padrão)
Apenas os **tipos e assinatura** do componente, sem implementação:

```tsx
// components/scanner/ResultCard.tsx
"use client";

import type { ScanResult } from "@/lib/native-bridge/types";

interface ResultCardProps {
  result: ScanResult;
  onDismiss?: () => void;
}

export function ResultCard({ result, onDismiss }: ResultCardProps) {
  // implementação no nível 2
  return null;
}
```

### Nível 2 (on request: "implementa o componente")
Componente completo com:
- Estado com `useState` / `useReducer` conforme necessidade
- `useEffect` para efeitos colaterais e acesso ao `window`
- Feedback visual de loading, error, success
- Todos os textos em pt-BR
- Tailwind classes mobile-first
- `aria-*` attributes para acessibilidade

### Nível 3 (on request: "adiciona os edge cases")
- Loading skeleton
- Tratamento explícito de cada error case da spec
- Animações ou transições (apenas se na spec)

## Constraints
- **Sempre** usar `"use client"` — componentes interativos sempre são Client Components neste projeto.
- **Nunca** acessar `window.AndroidBridge` diretamente — sempre via `getBridge()` de `lib/native-bridge`.
- **Nunca** adicionar feature não descrita na spec (ex: não adicionar campo de edição se a spec não pede).
- **Nunca** criar abstração para uso único.

## React / WebView Patterns

```tsx
// Padrão de detecção de bridge no mount
useEffect(() => {
  setBridgeAvailable(!!window.AndroidBridge);
}, []);

// Padrão de chamada de bridge
const handleAction = useCallback(async () => {
  const bridge = getBridge();
  try {
    const result = await bridge.openScanner();
    setResult(result);
  } catch {
    setError("Erro ao executar ação.");
  }
}, []);
```

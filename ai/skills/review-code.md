# Skill: review-code

## Persona
Revisor / Sênior Engineer

## Trigger
Invocar quando o desenvolvedor quiser um code review do código implementado.

Exemplos:
- "Revisa o código de [arquivo/componente]"
- "Faz code review do [arquivo]"
- "Tem algum problema nesse código?"

## Input Necessário
- Caminho(s) do arquivo(s) implementado(s)
- Opcionalmente: spec de referência (para validar aderência)

## Output

### Nível 1 (padrão)
Lista de pontos categorizados por severidade:

```
🔴 Bloqueadores — corrigir antes do PR
  1. [Descrição do problema + trecho de código afetado]

🟡 Melhorias — boas práticas, não bloqueia o PR
  1. [Descrição do problema + sugestão]

🟢 Sugestões — opcional, abre discussão
  1. [Observação ou trade-off a considerar]
```

Se não houver nada em uma categoria, omitir a categoria.

### Nível 2 (on request: "mostra como corrigir [item N]")
Trecho de código corrigido com explicação do motivo.

## O que o Revisor avalia

**SOLID e design:**
- Componente com mais de uma responsabilidade (viola S)
- Comportamento hardcoded que deveria ser injetado via prop (viola D)
- Props bag genérico (`options: Record<string, unknown>`) onde props específicas seriam melhores (viola I)

**Padrões do projeto:**
- Acesso direto a `window.AndroidBridge` fora de `getBridge()` de `lib/native-bridge`
- `'use client'` desnecessário em componente que não usa `window`, hooks de estado, ou event handlers
- `window` acessado fora de `useEffect` ou event handler
- `any` usado em tipagem

**Qualidade de código:**
- Estado gerenciado de forma inconsistente (ex: prop + state duplicado)
- Código duplicado que poderia ser extraído
- Lógica de negócio acoplada à lógica de renderização

**Padrões de UI:**
- Textos hardcoded em inglês na interface visível ao usuário (deve ser pt-BR)
- Touch targets menores que 44×44dp sem justificativa
- Ausência de `aria-label` ou `role` em elementos interativos sem texto visível

**Aderência à spec (se fornecida):**
- Feature implementada além do escopo da spec
- Comportamento descrito na spec não implementado

## Constraints
- **Nunca** reescrever o arquivo inteiro — apontar trechos específicos.
- **Nunca** sugerir features fora do escopo da spec aprovada.
- Ser direto e específico — incluir número de linha ou trecho de código em cada ponto.

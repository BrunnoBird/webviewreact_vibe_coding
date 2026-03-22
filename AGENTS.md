<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Vibe Bird — Instruções do Agente

## Contexto do Projeto

Aplicativo de **scanner de boleto e Pix** para Android, entregue como WebView.
As páginas Next.js são carregadas dentro de um `WebView` nativo — não são um site público.

| Item | Valor |
|---|---|
| Stack | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4 |
| Plataforma alvo | Android WebView |
| Idioma da UI | Português Brasileiro |
| Modo de build | Static export (`output: "export"`) |
| Bridge nativa | `window.AndroidBridge` via `addJavascriptInterface()` |

---

## Metodologia: Spec Driven Development (SDD)

Este projeto usa SDD. Toda feature começa com uma spec aprovada, **nunca com código**.

### Regra de Ouro
> Não existe arquivo de implementação (`.tsx`, `.ts`) sem spec em `specs/` com status `[x] Approved`.

### Fluxo obrigatório
```
0. new-prd     → PRD da task (dev revisa e aprova)
1. new-spec    → spec + checklist + plano técnico em 3 níveis:
                   L1: esqueleto
                   L2: spec completa + checklist de completude inline
                   L3: plano técnico (arquivos + SOLID, sem código)
2. Humano aprova spec → muda status para [x] Approved
3. new-page / new-component / new-bridge → implementação (L1: tipos, L2: código)
4. review-code → code review (🔴 bloqueadores / 🟡 melhorias / 🟢 sugestões)
5. qa-review   → cobertura de testes (✅ cobertos / ❌ gaps) → PR
```

### Status de uma spec
```
- [x] Draft       → em elaboração
- [x] Approved    → aprovado pelo time (e time Android, se for bridge)
- [x] Implemented → código criado e revisado
- [x] Tested      → validado em ambiente real
```

---

## Progressive Disclosure — Regra de Resposta

Toda resposta começa no **Nível 1**. Avançar só quando o desenvolvedor pedir.

| Nível | O que entregar |
|---|---|
| 1 (padrão) | Esqueleto / estrutura / tipos / lista de arquivos a criar |
| 2 (`"implementa"` / `"nível 2"`) | Implementação completa seguindo a spec |
| 3 (`"edge cases"` / `"nível 3"`) | Variantes, tratamentos de erro expandidos, notas de integração |

**Nunca pular níveis.** O objetivo é forçar revisão em cada etapa.

---

## Regras WebView (não negociáveis)

- `'use client'` em qualquer componente que acesse `window`, `document`, ou event handlers.
- Acesso ao `window.AndroidBridge` **apenas** dentro de `useEffect` ou event handlers — nunca no topo de módulo.
- Sempre usar `getBridge()` de `@/lib/native-bridge` — nunca acessar `window.AndroidBridge` diretamente nos componentes.
- Sem `next/image` sem `unoptimized: true` (já configurado no `next.config.ts`).
- Sem APIs server-side (`headers()`, `cookies()`, server actions mutáveis) — tudo estático.
- Textos em Português Brasileiro em toda a UI.

---

## Skills Disponíveis

As skills são templates de prompt em `ai/skills/`. Invoque dizendo o que quer:

**Fluxo principal:**

| O que dizer | Arquivo | Persona | Resultado |
|---|---|---|---|
| `"quero uma PRD para [task]"` | `ai/skills/new-prd.md` | Product Manager | PRD completa em `prds/` |
| `"gera spec para este PRD"` / `"cria spec para [feature]"` | `ai/skills/new-spec.md` | Arquiteto | L1: esqueleto · L2: spec + checklist · L3: plano técnico |
| `"scaffolda a page [rota]"` | `ai/skills/new-page.md` | Desenvolvedor | Server Component + estrutura |
| `"cria o componente [nome]"` | `ai/skills/new-component.md` | Desenvolvedor | Client Component tipado (SOLID) |
| `"gera bridge de [nome]"` | `ai/skills/new-bridge.md` | Desenvolvedor | types.ts + mock.ts + index.ts |
| `"revisa o código de [arquivo]"` | `ai/skills/review-code.md` | Revisor Sênior | 🔴🟡🟢 pontos categorizados |
| `"QA review do [arquivo]"` | `ai/skills/qa-review.md` | QA Engineer | ✅❌ gaps de cobertura |

**Skills avulsas** (uso opcional, fora do fluxo principal):

| O que dizer | Arquivo | Quando usar |
|---|---|---|
| `"revisa o PRD de [arquivo]"` | `ai/skills/review-prd.md` | Checar PRD existente isoladamente |
| `"revisa spec de [arquivo]"` | `ai/skills/review-spec.md` | Checar spec existente isoladamente |
| `"planeja a implementação da spec [arquivo]"` | `ai/skills/new-plan.md` | Detalhar plano técnico separado da spec |

Leia `ai/docs/flow.md` para o fluxo completo de uma feature com IA, incluindo exemplo real.

---

## Estrutura de Pastas

```
prds/               ← PRDs aprovadas das tasks do board
specs/              ← fonte da verdade de features (SDD)
ai/
  skills/           ← templates de prompt por capacidade
  docs/flow.md      ← documentação do fluxo de IA (com exemplo real)
lib/
  native-bridge/    ← contrato TypeScript com o Android + mock
components/         ← Client Components por feature
app/                ← rotas Next.js (Server Components por padrão)
```

---

## O que Este Agente Nunca Faz

1. Gera código de implementação sem spec aprovada.
2. Marca PRD, spec ou testes como `Approved` / `Tested` — isso é papel do desenvolvedor.
3. Adiciona features além do escopo da spec.
4. Usa `window` fora de Client Components.
5. Cria abstrações para uso único.
6. Avança de nível sem ser solicitado.
7. Usa a tipagem `any`.
8. Avança da PRD para spec sem aprovação explícita do dev.

# AI Flow: Como Usar a IA Neste Projeto

## Visão Geral

Este projeto usa **Spec Driven Development (SDD)** com suporte de IA. A IA atua com **personas especializadas** em cada etapa — Product Manager, Arquiteto, Desenvolvedor, Revisor e QA — para garantir qualidade em todas as fases, do requisito ao código.

O agente segue o princípio de **progressive disclosure**: sempre começa com o mínimo útil e avança quando você pede. Isso força revisão em cada etapa antes de avançar.

---

## O Fluxo Completo de uma Feature

```
┌─────────────────────────────────────────────────────────────┐
│  1. TASK: Dev cola a task do board                         │
│     "Quero uma PRD para [task]"                            │
└────────────────────────┬────────────────────────────────────┘
                         │ skill: new-prd (Product Manager)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  2. PRD COMPLETA: Contexto, user stories, critérios        │
│     Dev revisa, ajusta e aprova                            │
└────────────────────────┬────────────────────────────────────┘
                         │ dev muda status → [x] Approved
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  3. SPEC: "Gera spec para este PRD"                        │
│     skill: new-spec (Arquiteto)                            │
│     L1 → esqueleto da spec                                 │
│     L2 → spec completa + checklist de completude inline    │
│     L3 → plano técnico (arquivos + SOLID, sem código)      │
└────────────────────────┬────────────────────────────────────┘
                         │ dev revisa checklist + aprova spec/plano
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  4. IMPLEMENTAÇÃO L1:                                      │
│     skill: new-page / new-component / new-bridge           │
│     (Desenvolvedor — SOLID) — tipos + assinaturas          │
└────────────────────────┬────────────────────────────────────┘
                         │ dev pede "implementa"
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  5. IMPLEMENTAÇÃO L2: Código completo (SOLID, sem any)     │
└────────────────────────┬────────────────────────────────────┘
                         │ dev pede "revisa o código"
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  6. CODE REVIEW: skill: review-code (Revisor Sênior)       │
│     🔴 Bloqueadores  🟡 Melhorias  🟢 Sugestões            │
└────────────────────────┬────────────────────────────────────┘
                         │ dev corrige, pede "QA review"
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  7. QA REVIEW + PR: skill: qa-review (QA Engineer)         │
│     ✅ Cobertos  ❌ Gaps → dev adiciona testes → PR         │
└─────────────────────────────────────────────────────────────┘
```

---

## Fluxo Específico: Bridge Nativa

Para qualquer integração com o Android nativo, o fluxo tem uma etapa extra de alinhamento com o time Android:

```
1. Dev → new-prd → PRD do bridge
2. Dev aprova PRD → new-spec → spec do bridge (L1 + L2 + L3)
3. Dev + Time Android → revisam spec + plano → aprovam juntos
4. Dev → new-bridge → types.ts gerado da spec
5. Time Android → implementa o lado Kotlin usando types.ts como contrato
6. Dev → implementa consumidor (componente) usando mock em dev
7. Integração → WebView real + Android real → testa end-to-end
```

---

## Como Invocar as Skills

**Fluxo principal** (em negrito) — o caminho natural de uma feature:

| O que dizer | Skill | Persona |
|---|---|---|
| **`"Quero uma PRD para [task]"`** | `new-prd` | Product Manager |
| **`"Gera spec para este PRD"`** / `"Quero uma spec para [feature]"` | `new-spec` | Arquiteto |
| **`"Scaffolda a page [rota]"`** | `new-page` | Desenvolvedor |
| **`"Cria o componente [nome]"`** | `new-component` | Desenvolvedor |
| **`"Gera o bridge de [nome]"`** | `new-bridge` | Desenvolvedor |
| **`"Revisa o código de [arquivo]"`** | `review-code` | Revisor Sênior |
| **`"QA review do [arquivo]"`** | `qa-review` | QA Engineer |

**Skills avulsas** (uso opcional, fora do fluxo principal):

| O que dizer | Skill | Quando usar |
|---|---|---|
| `"Revisa o PRD de [arquivo]"` | `review-prd` | Checar PRD existente isoladamente |
| `"Revisa a spec de [arquivo]"` | `review-spec` | Checar spec existente isoladamente |
| `"Planeja a implementação da spec"` | `new-plan` | Detalhar plano técnico separado da spec |

---

## Progressive Disclosure na Spec

`new-spec` cobre spec + revisão + plano em um único artefato com 3 níveis:

```
L1  "gera spec para este PRD"    → esqueleto (contratos + campos obrigatórios)
L2  "preenche a spec"            → spec completa + checklist de completude inline
L3  "plano técnico"              → arquivos a criar, padrões SOLID, ordem de implementação
```

Após L2, o checklist mostra claramente se a spec está `PRONTA PARA APROVAÇÃO` ou `PRECISA DE REVISÃO`. Você só aprova depois de ver o checklist.

---

## Exemplo Real: Do Board ao Código

**Task:** `[BIRD-42] Tela de erro quando o scanner falha`

| # | O que dizer | Skill | O que receber |
|---|---|---|---|
| 1 | `"Quero uma PRD para [BIRD-42]: tela de erro quando scanner falha"` | `new-prd` | PRD completa em `prds/scanner-error.prd.md` |
| 2 | Dev revisa, ajusta critérios → muda `→ [x] Approved` | — | PRD aprovada |
| 3 | `"Gera spec para este PRD"` | `new-spec` | Spec L1 com Purpose derivado da PRD |
| 4 | `"preenche a spec"` | `new-spec` | Spec L2 com happy path, edge cases + checklist inline |
| 5 | `"plano técnico"` | `new-spec` | L3: arquivos a criar, padrões SOLID aplicados |
| 6 | Dev revisa checklist → muda `→ [x] Approved` | — | Spec + plano aprovados |
| 7 | `"Cria o componente ScannerError"` | `new-component` | L1: tipos + assinatura |
| 8 | `"implementa"` | `new-component` | L2: código completo (SOLID, sem any, pt-BR) |
| 9 | `"revisa o código de ScannerError.tsx"` | `review-code` | 🔴 bloqueadores, 🟡 melhorias |
| 10 | Dev corrige → `"QA review do ScannerError"` | `qa-review` | ✅ cobertos, ❌ gaps de cobertura |
| 11 | Dev adiciona testes, abre PR | — | Spec → `[x] Implemented` |

**Linha do tempo:**
```
BIRD-42 → PRD → ✅ → Spec(L1→L2→L3) → ✅ → Impl(L1→L2) → Review → QA → PR
```

---

## Regras que a IA Nunca Quebra

1. Não gera código de implementação sem spec aprovada.
2. Não marca PRD, spec ou testes como aprovados — só humanos fazem isso.
3. Não adiciona features além do que está na spec.
4. Não acessa `window.AndroidBridge` fora de Client Components.
5. Não usa `next/image` sem configuração de static export.
6. Não avança de nível sem ser solicitado.
7. Não usa a tipagem `any`.
8. Não avança da PRD para spec sem aprovação explícita do dev.

---

## Estrutura de Arquivos por Função

```
prds/               ← PRDs aprovadas das tasks do board
specs/              ← fonte da verdade para features (SDD)
ai/
  skills/           ← capacidades atômicas do agente
  docs/
    flow.md         ← este arquivo
lib/
  native-bridge/    ← contrato com o Android (tipos + mock)
components/         ← Client Components por feature
app/                ← rotas (Server Components por padrão)
```

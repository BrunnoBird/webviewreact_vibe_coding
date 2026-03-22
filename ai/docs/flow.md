# AI Flow: Como Usar a IA Neste Projeto

## Visão Geral

Este projeto usa **Spec Driven Development (SDD)** com suporte de IA. A IA é um parceiro de desenvolvimento — ela não decide, ela executa dentro do processo definido.

O agente segue o princípio de **progressive disclosure**: sempre começa com o mínimo útil e avança quando você pede. Isso força a revisão em cada etapa antes de avançar.

---

## O Fluxo Completo de uma Feature

```
┌─────────────────────────────────────────────────────────────┐
│  1. IDEIA: Dev descreve a feature em linguagem natural       │
│     "Quero uma tela de confirmação após o scan"             │
└────────────────────────┬────────────────────────────────────┘
                         │ invoca skill: new-spec
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  2. SPEC NÍVEL 1: Agente retorna esqueleto da spec          │
│     - Apenas campos obrigatórios preenchidos                │
│     - Seções de behavior em branco para o dev validar       │
└────────────────────────┬────────────────────────────────────┘
                         │ dev pede "preenche a spec"
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  3. SPEC NÍVEL 2: Agente retorna spec completa              │
│     - Happy path, edge cases, open questions                │
└────────────────────────┬────────────────────────────────────┘
                         │ dev revisa com: review-spec
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  4. APROVAÇÃO: Dev muda status para [x] Approved             │
│     - Apenas humanos aprovam specs                          │
│     - Time Android aprova specs de bridge                   │
└────────────────────────┬────────────────────────────────────┘
                         │ spec aprovada → invoca skill de implementação
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  5. IMPLEMENTAÇÃO NÍVEL 1: Agente retorna apenas estrutura  │
│     - Arquivos a criar, tipos, assinaturas                  │
│     - Sem código de implementação ainda                     │
└────────────────────────┬────────────────────────────────────┘
                         │ dev pede "gera o código"
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  6. IMPLEMENTAÇÃO NÍVEL 2: Agente retorna código completo   │
│     - Componente / page / bridge conforme a spec            │
└────────────────────────┬────────────────────────────────────┘
                         │ dev revisa, itera, faz PR
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  7. SPEC ATUALIZADA: Dev muda status para [x] Implemented   │
└─────────────────────────────────────────────────────────────┘
```

---

## Fluxo Específico: Bridge Nativa

Para qualquer integração com o Android nativo, o fluxo tem uma etapa extra de alinhamento com o time Android:

```
1. Dev → new-spec → spec do bridge (nível 1 + 2)
2. Dev + Time Android → revisam spec → aprovam juntos
3. Dev → new-bridge → types.ts gerado da spec
4. Time Android → implementa o lado Kotlin usando types.ts como contrato
5. Dev → implementa consumidor (componente) usando mock em dev
6. Integração → WebView real + Android real → testa end-to-end
```

---

## Como Invocar as Skills

Você pode invocar uma skill dizendo explicitamente o que quer:

| O que dizer | Skill invocada |
|---|---|
| "Quero uma spec para [feature]" | `new-spec` |
| "Revisa a spec de [arquivo]" | `review-spec` |
| "Scaffolda a page de [rota]" | `new-page` |
| "Cria o componente [nome]" | `new-component` |
| "Gera o bridge de [nome]" | `new-bridge` |

---

## Níveis de Progressive Disclosure

**Sempre que receber uma resposta de Nível 1**, você pode pedir:
- `"nível 2"` ou `"preenche"` ou `"implementa"` → avança para Nível 2
- `"nível 3"` ou `"edge cases"` ou `"variantes"` → avança para Nível 3

**Por que isso importa:** A IA nunca pula etapas. Isso garante que você revisou antes de avançar — o princípio fundamental do SDD.

---

## Regras que a IA Nunca Quebra

1. Não gera código de implementação sem spec aprovada.
2. Não marca specs como `Approved` — só humanos fazem isso.
3. Não adiciona features além do que está na spec.
4. Não acessa `window.AndroidBridge` fora de Client Components.
5. Não usa `next/image` sem configuração de static export.

---

## Estrutura de Arquivos por Função

```
specs/              ← fonte da verdade para features (SDD)
ai/
  agent.md          ← persona e regras do agente
  skills/           ← capacidades atômicas do agente
  docs/
    flow.md         ← este arquivo
lib/
  native-bridge/    ← contrato com o Android (tipos + mock)
components/         ← Client Components por feature
app/                ← rotas (Server Components por padrão)
```

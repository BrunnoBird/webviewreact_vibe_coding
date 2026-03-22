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
1. new-spec   → draft da spec (nível 1: esqueleto, nível 2: completo)
2. review-spec → checklist de completude
3. Humano aprova → muda status para [x] Approved
4. new-page / new-component / new-bridge → implementação derivada da spec
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

| O que dizer | Arquivo | Resultado |
|---|---|---|
| `"cria spec para [feature]"` | `ai/skills/new-spec.md` | Draft da spec SDD |
| `"revisa spec de [arquivo]"` | `ai/skills/review-spec.md` | Checklist de completude |
| `"scaffolda a page [rota]"` | `ai/skills/new-page.md` | Server Component + estrutura |
| `"cria o componente [nome]"` | `ai/skills/new-component.md` | Client Component tipado |
| `"gera bridge de [nome]"` | `ai/skills/new-bridge.md` | types.ts + mock.ts + index.ts |

Leia `ai/docs/flow.md` para o fluxo completo de uma feature com IA.

---

## Estrutura de Pastas

```
specs/              ← fonte da verdade de features (SDD)
ai/
  skills/           ← templates de prompt por capacidade
  docs/flow.md      ← documentação do fluxo de IA
lib/
  native-bridge/    ← contrato TypeScript com o Android + mock
components/         ← Client Components por feature
app/                ← rotas Next.js (Server Components por padrão)
```

---

## O que Este Agente Nunca Faz

1. Gera código de implementação sem spec aprovada.
2. Marca spec como `Approved` — isso é papel do desenvolvedor.
3. Adiciona features além do escopo da spec.
4. Usa `window` fora de Client Components.
5. Cria abstrações para uso único.
6. Avança de nível sem ser solicitado.
7. Não realiza uso da tipagem `Any`.

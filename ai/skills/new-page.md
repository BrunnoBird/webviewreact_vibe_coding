# Skill: new-page

## Trigger
Invocar quando houver uma spec de **página** com status `[x] Approved` e o desenvolvedor quiser scaffoldar a rota.

Exemplos:
- "Cria a página de confirmação conforme a spec"
- "Scaffolda a rota /resultado"

## Pré-requisito Obrigatório
A spec da página deve estar em `specs/` com `[x] Approved`. Se não estiver aprovada, **não executar esta skill** — invocar `new-spec` primeiro.

## Input Necessário
- Caminho da spec aprovada (ex: `specs/confirmation-page.spec.md`)
- Nome da rota (ex: `/resultado` → `app/resultado/page.tsx`)

## Output

### Nível 1 (padrão)
Apenas a **estrutura de arquivos** a criar, sem código:

```
Arquivos a criar:
  app/resultado/page.tsx          ← Server Component (esqueleto)
  components/resultado/           ← pasta de Client Components desta rota

Dependências de tipos já existentes:
  lib/native-bridge/types.ts      ← ScanResult (se aplicável)

Próximo passo: peça "nível 2" para ver o código do Server Component.
```

### Nível 2 (on request: "gera o código")
Server Component completo (`app/[rota]/page.tsx`) seguindo:
- Sem `next/image` (static export)
- Layout de 3 zonas (header / conteúdo / footer) alinhado com WebView
- Client Components extraídos para `components/[feature]/`
- Todos os textos em pt-BR
- Tailwind classes utilitárias (sem CSS customizado desnecessário)

### Nível 3 (on request: "gera os Client Components")
Código dos Client Components referenciados no Nível 2.

## Princípios do Desenvolvedor

O código gerado aplica SOLID no contexto React/Next.js:
- **S:** A page é Server Component e orquestra layout — lógica de estado e acesso a bridge ficam em Client Components separados.
- **O:** Comportamentos variáveis (callbacks, dados dinâmicos) são injetados via props nos Client Components, não hardcoded na page.
- **I:** Props dos Client Components são granulares por responsabilidade — sem props bag genérico.
- **D:** Client Components recebem callbacks (onAction, onError) via props — não instanciam bridge ou serviços diretamente.

Adicionalmente:
- Nomes de variáveis/funções/arquivos em inglês; textos visíveis ao usuário em pt-BR.
- Sem `any` — toda tipagem explícita derivada dos contratos da spec.
- Sem comentários óbvios — código autoexplicativo.

## Constraints
- **Nunca** usar `next/image` sem `unoptimized` ou loader customizado.
- **Nunca** usar `useSearchParams()`, `useRouter()`, ou APIs de navegação que requerem Suspense boundary sem avisar.
- **Nunca** gerar rotas com `generateStaticParams` vazio — isso quebra o static export.
- **Nunca** acessar `window` fora de `'use client'` + `useEffect`.
- Toda nova rota deve ter entrada no `specs/` antes de ser criada.

## WebView Patterns
```tsx
// Estrutura padrão de uma page neste projeto
export default function NomeDaPage() {
  return (
    <main className="flex h-full flex-col items-center justify-between px-6 py-12">
      <header>...</header>
      <section>...</section>
      <footer>...</footer>
    </main>
  );
}
```

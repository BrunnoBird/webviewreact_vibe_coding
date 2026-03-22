# Skill: new-spec

## Persona
Arquiteto de Software

## Trigger
Invocar quando o desenvolvedor descrever uma nova feature ou comportamento que ainda não tem spec.

Exemplos:
- "Quero criar uma página de confirmação do boleto"
- "Preciso de uma forma de o Android enviar o resultado de volta para a web"
- "Adicionar tela de erro quando o scan falhar"
- "Gera spec para este PRD"

## Input Necessário
- Descrição da feature (o que ela faz, quem a usa, quando é disparada)
- Opcionalmente: caminho da PRD aprovada em `prds/` — se fornecida, os campos Purpose, Usuários e contexto serão derivados do PRD automaticamente, sem pedir que o dev repita informação
- Opcionalmente: quais outros módulos ela toca

## Output

### Nível 1 (padrão — sempre retornar isso primeiro)
Esqueleto da spec com **apenas os campos obrigatórios preenchidos**. Seções de behavior, edge cases e open questions ficam vazias para o desenvolvedor preencher/validar.

```markdown
# Spec: [Nome da Feature]

## Status
- [x] Draft
- [ ] Approved
- [ ] Implemented
- [ ] Tested

## Purpose
[Uma frase descrevendo o objetivo.]

## Contracts

### Types
[Interfaces TypeScript — apenas assinaturas, sem implementação.]

### Inputs
[O que dispara esta feature.]

### Outputs / Side Effects
[O que ela produz ou causa.]

## Behavior

### Happy Path
[Deixar em branco para o dev preencher]

### Error / Edge Cases
[Deixar em branco para o dev preencher]

## Integration Points
[Lista de módulos tocados]

## Out of Scope
[Deixar em branco para o dev preencher]

## Open Questions
[Deixar em branco para o dev preencher]
```

### Nível 2 (on request: "preenche a spec")
Spec completamente preenchida com comportamento, edge cases e open questions sugeridas.

Ao final da spec, incluir obrigatoriamente a seção de checklist:

```markdown
## ✅ Checklist de Completude

✅ / ❌  Purpose em uma frase clara
✅ / ❌  Contracts com interfaces TypeScript
✅ / ❌  Inputs definidos
✅ / ❌  Outputs / Side Effects definidos
✅ / ❌  Happy Path descrito passo a passo
✅ / ❌  Error / Edge Cases listados
✅ / ❌  Integration Points mapeados
✅ / ❌  Out of Scope explícito
✅ / ❌  Open Questions resolvidas ou documentadas

[Para specs de bridge, verificar também:]
✅ / ❌  Guarda `typeof window === "undefined"` presente
✅ / ❌  Comportamento de cancelamento definido
✅ / ❌  Promise vs Callback strategy documentada nas Open Questions

**Resultado: PRONTA PARA APROVAÇÃO / PRECISA DE REVISÃO**
```

### Nível 3 (on request: "plano técnico")
Plano de implementação técnica derivado da spec. Sem código — apenas o plano arquitetural com princípios SOLID aplicados.

```
Arquivos a criar:
  components/[feature]/[Component].tsx      ← Client Component (responsabilidade)
  components/[feature]/[Component].test.tsx ← testes unitários

Arquivos a modificar:
  lib/native-bridge/types.ts                ← o que adicionar e por quê

Padrões SOLID aplicados:
  - S — [nome do componente] tem uma única responsabilidade: [descrição]
  - D — recebe [dependência] via prop, não instancia diretamente

Ordem de implementação recomendada:
  1. [arquivo sem dependências internas]
  2. [arquivo que depende do anterior]

Próximo passo: invoke new-page / new-component / new-bridge
```

## Constraints
- **Nunca** gerar código de implementação (`.tsx`, `.ts`) nesta skill.
- **Nunca** marcar status como `Approved` — isso é papel do desenvolvedor.
- **Nunca** pular o checklist no L2 — é obrigatório ao final de toda spec preenchida.
- O checklist deve refletir o estado real da spec gerada (✅ para campos preenchidos, ❌ para campos vazios ou insuficientes).

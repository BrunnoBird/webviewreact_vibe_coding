# Skill: new-spec

## Trigger
Invocar quando o desenvolvedor descrever uma nova feature ou comportamento que ainda não tem spec.

Exemplos:
- "Quero criar uma página de confirmação do boleto"
- "Preciso de uma forma de o Android enviar o resultado de volta para a web"
- "Adicionar tela de erro quando o scan falhar"

## Input Necessário
- Descrição da feature (o que ela faz, quem a usa, quando é disparada)
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

### Nível 2 (on request: "preenche a spec completa")
Spec completamente preenchida com comportamento, edge cases, e open questions sugeridas.

### Nível 3 (on request: "sugere os tipos TypeScript")
Proposta de interfaces TypeScript derivadas do contrato da spec. **Não gera arquivo de implementação.**

## Constraints
- **Nunca** gerar código de implementação (`.tsx`, `.ts`) nesta skill.
- **Nunca** marcar status como `Approved` — isso é papel do desenvolvedor.
- **Nunca** assumir que a spec está correta antes da revisão — oferecer open questions sempre.

# Skill: review-spec

## Trigger
Invocar quando o desenvolvedor quiser revisar ou aprovar uma spec existente.

Exemplos:
- "Revisa a spec do scanner bridge"
- "A spec da home page está completa?"
- "Posso aprovar esta spec?"

## Input Necessário
- Caminho da spec a revisar (ex: `specs/scanner-bridge.spec.md`)
- Ou: conteúdo da spec colado diretamente

## Output

### Nível 1 (padrão)
Checklist de completude contra o template SDD:

```
✅ / ❌  Status preenchido
✅ / ❌  Purpose em uma frase clara
✅ / ❌  Contracts com interfaces TypeScript
✅ / ❌  Inputs definidos
✅ / ❌  Outputs / Side Effects definidos
✅ / ❌  Happy Path descrito passo a passo
✅ / ❌  Error / Edge Cases listados
✅ / ❌  Integration Points mapeados
✅ / ❌  Out of Scope explícito
✅ / ❌  Open Questions resolvidas ou documentadas

Resultado: PRONTA PARA APROVAÇÃO / PRECISA DE REVISÃO
```

### Nível 2 (on request: "detalha os problemas")
Para cada `❌`, explicar o que está faltando e sugerir o conteúdo.

### Nível 3 (on request: "sugere melhorias")
Sugestões de open questions adicionais, edge cases não cobertos, ou ambiguidades no contrato.

## Constraints
- **Nunca** alterar o arquivo de spec diretamente — apenas reportar.
- **Nunca** marcar como `Approved` — isso é papel do desenvolvedor.
- **Nunca** sugerir código de implementação nesta skill.

## WebView-specific Checklist
Além do template padrão, verificar para features que tocam a bridge nativa:
- [ ] Há guarda contra `typeof window === "undefined"`?
- [ ] O comportamento de cancelamento está definido?
- [ ] O timing de injeção da bridge está endereçado?
- [ ] A Promise vs Callback strategy está documentada nas Open Questions?

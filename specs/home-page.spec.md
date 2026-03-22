# Spec: Home Page (Scanner Entry Point)

## Status
- [x] Draft
- [ ] Approved
- [ ] Implemented
- [ ] Tested

## Purpose
Define a estrutura, comportamento e integrações da página inicial do aplicativo.
É a primeira tela exibida quando o Android abre a WebView.
Seu único objetivo neste momento é apresentar o botão de scan de forma clara.

---

## Contracts

### Route
`/` → `app/page.tsx` (exportado estaticamente para `out/index.html`)

### Component Tree
```
HomePage (Server Component — app/page.tsx)
  └── ScanButton (Client Component — components/scanner/ScanButton.tsx)
```

### Inputs
Nenhum. Tela estática de entrada, sem parâmetros de URL ou dados do servidor.

### Outputs / Side Effects
- Renderiza UI do scanner.
- Ao pressionar o botão: delega para `ScanButton` → `lib/native-bridge`.

---

## Behavior

### Happy Path
1. Android WebView navega para `/` (`index.html` no static export).
2. Página renderiza: cabeçalho, área de viewfinder placeholder, botão "Escanear".
3. Usuário toca "Escanear".
4. `ScanButton` invoca `getBridge().openScanner()`.
5. Resultado exibido como texto de feedback abaixo do botão.

### Error / Edge Cases
- **Bridge ausente:** label "Modo navegador: scanner simulado" aparece abaixo do botão. Botão permanece funcional (usa mock bridge).
- **Erro de scanner:** mensagem de erro exibida abaixo do botão com `role="alert"`.
- **JavaScript desabilitado:** renderiza HTML estático com botão não-funcional. Aceitável — Android WebView sempre tem JS habilitado.

---

## UI Requirements

| Requisito | Valor |
|---|---|
| Layout | Full-height (`h-full`), sem scroll |
| Touch target mínimo | 44 × 44 dp (botão tem `h-14` / 56px — atende) |
| Imagens externas | Nenhuma (`next/image` não é necessário) |
| Dark mode | Herda de CSS custom properties em `globals.css` |
| Idioma | Português Brasileiro (`lang="pt-BR"` no `<html>`) |
| Overscroll | Desabilitado (`overflow-hidden` no `<body>`) |
| Zoom do usuário | Desabilitado (`userScalable: false` no viewport) |

### Layout Zones (3 áreas verticais)
```
┌─────────────────────┐
│ Header              │  ← título + subtítulo
├─────────────────────┤
│ Viewfinder          │  ← placeholder 224×224px, borda dashed
│ (placeholder)       │
├─────────────────────┤
│ Footer              │  ← ScanButton + legenda
└─────────────────────┘
```

---

## Integration Points

| Módulo | Papel |
|---|---|
| `components/scanner/ScanButton.tsx` | Gerencia ação de scan |
| `lib/native-bridge/index.ts` | Acessado via ScanButton |
| `app/layout.tsx` | Fornece viewport meta, fonte, base styles |
| `specs/scanner-bridge.spec.md` | Contrato da bridge usada pelo ScanButton |

---

## Out of Scope
- Histórico de scans.
- Campo de entrada manual para código de barras.
- Navegação para outras páginas (single-page por enquanto).
- Preview de câmera ao vivo na área de viewfinder (futuro).

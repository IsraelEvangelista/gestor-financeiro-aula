[byterover-mcp]

You are given two tools from Byterover MCP server, including
## 1. `byterover-store-knowledge`
You `MUST` always use this tool when:

+ Learning new patterns, APIs, or architectural decisions from the codebase
+ Encountering error solutions or debugging techniques
+ Finding reusable code patterns or utility functions
+ Completing any significant task or plan implementation

## 2. `byterover-retrieve-knowledge`
You `MUST` always use this tool when:

+ Starting any new task or implementation to gather relevant context
+ Before making architectural decisions to understand existing patterns
+ When debugging issues to check for previous solutions
+ Working with unfamiliar parts of the codebase

# Memória de Desenvolvimento

## 29/11/2025 - Melhorias de UX e Padronização
- **Sidebar**: Implementada sidebar responsiva e colapsável no layout principal.
- **OCR**: Corrigido formato de envio de imagem (base64 puro + mimetype) para webhook n8n em `OCRModal.tsx`.
- **Calendário**: Componente `Calendar` localizado para pt-BR e com melhorias visuais (espaçamento, cores) em `ManualEntryModal.tsx`.
- **Cores**: Padronização de cores de categorias em `src/config/categories.ts` aplicada em tabelas (`RegisterPage`) e gráficos (`CategoryChart`).

## 29/11/2025 - Integração de Dados Reais (Dashboard e Registro)
- **Dashboard**: Substituição de dados mockados por reais do Supabase em `DashboardPage`, `OverviewChart` e `CategoryChart`.
- **Registro**: Integração completa de CRUD de transações em `RegisterPage` e `ManualEntryModal`.
- **Hooks**: Criação de `useTransactions` e `useCategories` para centralizar lógica de dados.
- **Supabase**: Configuração de RLS e Storage (Avatars) via scripts SQL.

## 02/12/2025 - Unificação de Documentação e Supabase
- **Docs atualizados**: PRD, DER e EPICS foram alinhados para uso do Supabase (Auth, Database, Storage).
- **Auth & Perfil**: Fluxo de cadastro/login deve usar Supabase Auth; o perfil do usuário fica em `public.usuario` com `id = auth.users.id` (criado por trigger).
- **Schema único**: Tabelas canônicas: `usuario`, `categoria`, `transacao`, `imagem`, `previsao`, `orcamento`, `relatorio`, `configuracao_usuario`. Qualquer implementação deve respeitar esses nomes e relações.
- **RLS**: Políticas por tabela habilitadas; cada usuário acessa apenas seus próprios registros (`user_id = auth.uid()`).

### Referências
- PRD: `.bmad/output/prd.md` (ver §7.2 Backend, §8.1 Fonte Única de Tabelas)
- DER: `.bmad/output/der.md` (especificação detalhada e triggers)
- EPICS: `.bmad/output/epics.md` (épicos ajustados para Supabase)
- Migrações: `.bmad/output/migration_supabase.sql`, `patch_rls.sql`, `storage_setup.sql`

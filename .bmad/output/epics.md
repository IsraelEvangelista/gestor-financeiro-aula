# EPICS - Macro Tarefas para Implementação
## Gestor Financeiro - Metodologia BMAD

**Versão:** 1.0
**Data:** 27 de Novembro de 2025
**Autor:** Israel
**Metodologia:** BMAD (Build, Modify, Adapt, Develop)
**Status:** Pronto para Sprints

---

## 1. Visão Geral do Roadmap

### 1.1 Fases do Projeto

**FASE 1 - MVP (Sprints 1-4)**
- Estrutura básica do sistema
- Autenticação e gestão de usuários
- Entrada manual de transações
- Dashboard básico com gráficos
- Deploy inicial

**FASE 2 - INTEGRAÇÃO (Sprints 5-8)**
- Integração n8n para OCR
- Captura por foto
- Categorização automática
- Sistema de orçamentos
- Alertas

**FASE 3 - BI E PREVISÕES (Sprints 9-12)**
- Análises avançadas
- Previsões com regressão
- Relatórios automatizados
- Mobile optimization
- Documentação BMAD

### 1.2 Critérios de Velocidade
- **Sprint Duration:** 2 semanas
- **Story Points por Sprint:** 20-30 pontos (conservador para projeto educacional)
- **Total de Sprints:** 12 sprints
- **Total de Story Points:** 240-300 pontos

### 1.3 Referência de Schema (Supabase)
```
Tabelas: usuario, categoria, transacao, imagem, previsao, orcamento, relatorio, configuracao_usuario
Fonte única: DER.md (campos/relacionamentos) e PRD.md §8.1
Regra: quaisquer epics/stories que toquem dados devem usar esses nomes/relacionamentos
```

---

## 2. ÉPICO 01 - Infraestrutura e Setup
**Prioridade:** ALTA | **Sprints:** 1 | **Story Points:** 21

### 2.1 Descrição
Criar toda a infraestrutura base do projeto: banco de dados, repositórios, ambiente de desenvolvimento, e estrutura inicial do React.

### 2.2 User Stories

**US-01: Setup Supabase (Database + Auth + Storage)**
```
Como desenvolvedor
Quero configurar projeto Supabase com schema e RLS
Para ter a base de dados e autenticação pronta para desenvolvimento

Critérios de Aceitação:
- Projeto Supabase criado e acessível
- Tabelas do DER v1.0 aplicadas via migrações
- RLS habilitado com políticas por tabela
- Trigger de criação de perfil (usuario) após signup
- Seed de categorias padrão por usuário
- Bucket de storage para recibos configurado

Tarefas:
1. Criar projeto no Supabase
2. Configurar `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Aplicar migrações (`migration_supabase.sql`, `patch_rls.sql`, `storage_setup.sql`)
4. Habilitar RLS e revisar políticas
5. Executar seed de categorias por `user_id`
6. Testar consultas com Supabase JS Client
7. Documentar configuração no AGENTS.md
```

**US-02: Setup Repositório Git**
```
Como desenvolvedor
Quero criar repositório Git organizado
Para versionar código e facilitar colaboração

Critérios de Aceitação:
- Repositório criado no GitHub
- .gitignore configurado
- Estrutura de pastas definida
- Conventional commits habilitado
- Branching strategy definida
- GitHub Actions para CI/CD

Tarefas:
1. Criar repositório 'gestor-financeiro-bmad'
2. Configurar .gitignore (node_modules, env files)
3. Estruturar pastas (frontend, backend, docs, scripts)
4. README.md com instruções
5. LICENSE definido
6. Configurar branches (main, develop, feature/*)
7. Configurar proteção para main branch
```

**US-03: Setup Google AI Studio**
```
Como desenvolvedor
Quero configurar projeto React no Google AI Studio
Para desenvolver frontend de forma integrada

Critérios de Aceitação:
- Projeto React criado no Google AI Studio
- GitHub integração configurada
- Build e deploy funcionando
- Estrutura de componentes básica
- Router configurado
- State management implementado

Tarefas:
1. Criar projeto no Google AI Studio
2. Inicializar React com Vite
3. Configurar TypeScript
4. Instalar dependências (React Router, Axios, Chart.js)
5. Estruturar pastas (components, pages, services, hooks)
6. Configurar proxy para API
7. Testar build e deploy
```

**US-04: Setup n8n Instance**
```
Como desenvolvedor
Quero configurar instância n8n para OCR
Para ter automação de workflows disponível

Critérios de Aceitação:
- n8n instance configurado (local ou cloud)
- Webhook endpoints funcionais
- OCR nodes básicos configurados
- Teste de workflow manual
- Documentação de uso

Tarefas:
1. Instalar/configurar n8n
2. Configurar webhook base
3. Criar workflow OCR teste
4. Integrar com Google Vision API (ou Tesseract)
5. Testar processamento de imagem
6. Documentar endpoints
7. Configurar error handling
```

### 2.3 Acceptance Criteria
- [ ] PostgreSQL com todas as tabelas criadas
- [ ] 100% dos seed data carregados
- [ ] Repositório Git com estrutura completa
- [ ] React app rodando no Google AI Studio
- [ ] n8n instance operacional
- [ ] Documentação de setup completa

---

## 3. ÉPICO 02 - Autenticação e Usuários
**Prioridade:** ALTA | **Sprints:** 2 | **Story Points:** 13

### 3.1 Descrição
Implementar sistema completo de autenticação, registro, e gestão de usuários.

### 3.2 User Stories

**US-05: Registro de Usuários (Supabase Auth)**
```
Como visitante
Quero me registrar no sistema
Para criar uma conta e acessar o gestor financeiro

Critérios de Aceitação:
- Formulário de registro com validação
- Campos: email, senha, confirmação senha, nome
- Validação de email (formato e duplicata)
- Requisitos mínimos de senha (8 chars, 1 número, 1 letra)
- Criação de sessão via Supabase Auth
- Criação automática do perfil em `public.usuario` (trigger)
- Redirecionamento para dashboard após registro
- Email de boas-vindas (opcional)

Tarefas:
1. Criar componente RegisterForm
2. Implementar validação frontend
3. Usar Supabase Auth `signUp({ email, password, options: { data: { nome } } })`
4. Confirmar sessão e obter `auth.user.id`
5. Verificar existência de `usuario` e criar se necessário
6. Implementar login automático
7. Testar fluxo completo
```

**US-06: Login de Usuários (Supabase Auth)**
```
Como usuário
Quero fazer login no sistema
Para acessar minha conta e dados financeiros

Critérios de Aceitação:
- Formulário de login (email/senha)
- Validação de credenciais via Supabase Auth
- Sessão gerenciada pelo Supabase (cookies/local storage)
- Redirecionamento para dashboard
- Manter sessão ativa (onAuthStateChange)
- Logout funcional (`supabase.auth.signOut()`)

Tarefas:
1. Criar componente LoginForm
2. Implementar validação frontend
3. Usar `supabase.auth.signInWithPassword({ email, password })`
4. Criar contexto de autenticação com listener `onAuthStateChange`
5. Implementar ProtectedRoute baseado em sessão
6. Testar fluxo login/logout
```

**US-07: Gerenciamento de Perfil**
```
Como usuário
Quero editar meu perfil
Para personalizar preferências e dados

Critérios de Aceitação:
- Tela de perfil com dados atuais
- Edição de nome, email, avatar
- Cambio de senha (senha atual + nova)
- Preferências (moeda, timezone, data)
- Validação de campos
- Feedback de sucesso/erro
- Upload de avatar (opcional)

Tarefas:
1. Criar página Profile
2. Implementar formulários de edição
3. Criar endpoint PUT /user/profile
4. Implementar validação de senha atual
5. Criar endpoint PUT /user/password
6. Implementar upload de avatar
7. Atualizar contexto com novos dados
8. Testar todas as funcionalidades
```

### 3.3 Acceptance Criteria
- [ ] Registro funcionando 100% (Supabase Auth)
- [ ] Login com sessão do Supabase funcional
- [ ] Logout limpa sessão
- [ ] Perfil editável
- [ ] Senha alterável
- [ ] Validações no frontend e backend
- [ ] Testes unitários > 80%

---

## 4. ÉPICO 03 - Gestão de Transações
**Prioridade:** ALTA | **Sprints:** 3-4 | **Story Points:** 26

### 4.1 Descrição
Implementar CRUD completo de transações financeiras (gastos e receitas) com entrada manual.

### 4.2 User Stories

**US-08: Criar Transação Manual**
```
Como usuário
Quero adicionar uma transação manualmente
Para registrar gastos e receitas não capturados por OCR

Critérios de Aceitação:
- Formulário com campos: tipo, valor, descrição, categoria, data
- Dropdown com categorias do usuário
- Date picker para data
- Validação de campos obrigatórios
- Valor deve ser positivo
- Descrição máximo 255 chars
- Salvamento na base de dados
- Feedback visual de sucesso
- Listagem atualizada em tempo real

Tarefas:
1. Criar componente TransactionForm ✅
2. Implementar validação com React Hook Form
3. Criar endpoint POST /transactions
4. Implementar listagem de categorias
5. Validar dados no backend
6. Salvar transação no PostgreSQL
7. Atualizar lista após salvamento
8. Implementar loading states
9. Testar criação de gastos e receitas
```

**US-09: Listar Transações**
```
Como usuário
Quero visualizar minhas transações
Para acompanhar histórico financeiro

Critérios de Aceitação:
- Tabela com todas as transações
- Paginação (20 items por página)
- Filtro por período (data inicio/fim)
- Filtro por tipo (gasto/receita)
- Filtro por categoria
- Ordenação por data (mais recente primeiro)
- Formatação monetária (R$ 1.234,56)
- Botão editar e excluir por linha

Tarefas:
1. Criar componente TransactionList
2. Implementar paginação
3. Criar endpoint GET /transactions (com filtros)
4. Implementar query com WHERE dinâmico
5. Adicionar filtros no frontend
6. Implementar ordenação
7. Formatar valores monetários
8. Adicionar botões de ação
9. Testar com dados reais
```

**US-10: Editar Transação**
```
Como usuário
Quero editar uma transação existente
Para corrigir erros ou atualizar informações

Critérios de Aceitação:
- Modal ou página com formulário preenchido
- Todos os campos editáveis (exceto ID)
- Validação igual ao criar
- Atualização na base de dados
- Feedback de sucesso
- Listagem atualizada após salvar
- Versionamento (log de alterações)

Tarefas:
1. Criar modal TransactionEditModal
2. Implementar pre-preenchimento do form
3. Criar endpoint PUT /transactions/:id
4. Validar ownership (usuário só edita próprias transações)
5. Atualizar dados na base
6. Implementar audit trail (updated_at, updated_by)
7. Atualizar lista após salvamento
8. Testar edição de gastos e receitas
```

**US-11: Excluir Transação**
```
Como usuário
Quero excluir uma transação
Para remover registros incorretos

Critérios de Aceitação:
- Botão excluir com ícone
- Modal de confirmação (Não pode desfazer)
- Soft delete (deleted_at preenchido)
- Atualização da lista após exclusão
- Verificar relacionamentos (imagem OCR)
- Cascata ou bloqueamento conforme regras

Tarefas:
1. Adicionar botão delete na lista
2. Implementar modal de confirmação
3. Criar endpoint DELETE /transactions/:id
4. Implementar soft delete
5. Verificar integridade referencial
6. Atualizar lista após exclusão
7. Testar exclusão com e sem imagem OCR
8. Documentar comportamento
```

**US-12: Upload de Imagem para OCR**
```
Como usuário
Quero anexar foto a uma transação
Para processamento futuro via OCR

Critérios de Aceitação:
- Upload de imagem (JPG, PNG, PDF)
- Preview da imagem
- Validação de tamanho (max 5MB)
- Armazenamento no sistema de arquivos
- Link da imagem na transação
- Status OCR (pending, processing, completed)
- Interface para reprocessar

Tarefas:
1. Criar componente ImageUpload
2. Implementar drag & drop
3. Validar tipo e tamanho
4. Upload para sistema de arquivos
5. Criar endpoint POST /images
6. Salvar path no banco
7. Vincular à transação
8. Implementar preview
9. Testar upload de diferentes formatos
```

### 4.3 Acceptance Criteria
- [ ] CRUD de transações 100% funcional
- [ ] Upload de imagens funcionando
- [ ] Soft delete implementado
- [ ] Filtros e paginação operacionais
- [ ] Validações frontend e backend
- [ ] Performance < 1s para listagem (100+ transações)

---

## 5. ÉPICO 04 - Dashboard Básico
**Prioridade:** ALTA | **Sprints:** 4 | **Story Points:** 21

### 5.1 Descrição
Criar dashboard principal com visualizações básicas de dados financeiros.

### 5.2 User Stories

**US-13: Dashboard Overview**
```
Como usuário
Quero ver resumo financeiro no dashboard
Para ter visão geral das finanças

Critérios de Aceitação:
- Cards com totais: Gastos do mês, Receitas do mês, Saldo
- Comparação com mês anterior (+/- %)
- Gráfico de pizza por categoria
- Transações recentes (últimas 5)
- Responsivo (desktop e mobile)
- Loading states
- Atualização automática

Tarefas:
1. Criar página Dashboard
2. Implementar cards de resumo
3. Criar endpoint GET /dashboard/summary
4. Implementar gráfico de pizza (Chart.js)
5. Listar transações recentes
6. Calcular variações percentuais
7. Implementar refresh automático
8. Testar responsividade ✅ (Sidebar implementada)
```

**US-14: Gráfico Temporal**
```
Como usuário
Quero ver evolução de gastos ao longo do tempo
Para identificar tendências e padrões

Critérios de Aceitação:
- Gráfico de linha (data vs valor)
- Filtro por período (30 dias, 3 meses, 6 meses, 1 ano)
- Toggle gasto/receita
- Zoom in/out
- Tooltips informativos
- Smooth curves
- Loading progress

Tarefas:
1. Implementar LineChart component
2. Criar endpoint GET /transactions/trend
3. Agregação por data (SUM de valores)
4. Filtros de período
5. Implementar toggle
6. Adicionar tooltips
7. Smooth curves options
8. Testar com dados reais
```

**US-15: Breakdown por Categoria**
```
Como usuário
Quero ver gastos organizados por categoria
Para entender distribuição de gastos

Critérios de Aceitação:
- Gráfico de donut/pie
- Lista de categorias com valores
- Percentual por categoria
- Ordenação por valor (maior para menor)
- Cores distintas por categoria
- Click para drill-down
- Valores absolutos e percentuais

Tarefas:
1. Criar DoughnutChart component
2. Agrupar transações por categoria
3. Calcular percentuais
4. Implementar drill-down
5. Adicionar cores dinâmicas ✅
6. Ordenar por valor
7. Exibir valores e percentuais
8. Testar performance com muitas categorias
```

### 5.3 Acceptance Criteria
- [ ] Dashboard carrega em < 2 segundos
- [ ] Gráficos responsivos
- [ ] Filtros funcionais
- [ ] Tooltips informativos
- [ ] Mobile-friendly
- [ ] Dados atualizados em tempo real

---

## 6. ÉPICO 05 - Integração n8n OCR
**Prioridade:** MÉDIA | **Sprints:** 5-6 | **Story Points:** 34

### 6.1 Descrição
Integrar sistema n8n para processamento automático de imagens via OCR.

### 6.2 User Stories

**US-16: Processamento OCR Automático**
```
Como usuário
Quero que fotos sejam processadas automaticamente
Para extrair dados de recibos sem digitar

Critérios de Aceitação:
- Trigger automático ao fazer upload
- Chamada para webhook n8n
- Processamento assíncrono
- Status atualizado em tempo real
- Feedback visual (progress bar)
- Timeout handling (max 60s)
- Retry automático (3 tentativas)

Tarefas:
1. Configurar webhook endpoint no frontend ✅
2. Criar workflow n8n completo
3. Integrar Google Vision API ou Tesseract
4. Implementar status tracking
5. Adicionar progress indicators
6. Implementar retry logic
7. Handle timeout e erros
8. Testar com imagens reais
```

**US-17: Validação de Dados OCR**
```
Como usuário
Quero revisar dados extraídos pelo OCR
Para garantir precisão antes de salvar

Critérios de Aceitação:
- Modal com dados extraídos
- Campos: valor, data, estabelecimento, descrição
- Confidence score por campo
- Campos editáveis para correção
- Botões: Salvar, Editar, Rejeitar, Reprocessar
- Preview da imagem
- Dicas de edição

Tarefas:
1. Criar modal OCRValidationModal
2. Exibir dados extraídos
3. Adicionar confidence indicators
4. Campos editáveis
5. Preview da imagem
6. Botões de ação
7. Endpoint para salvar transação OCR
8. Implementar reprocessamento
9. Testar diferentes tipos de documento
```

**US-18: Aprendizado de Categorização**
```
Como usuário
Quero que sistema aprenda minhas categorias
Para categorização automática mais precisa

Critérios de Aceitação:
- Histórico de categorias por estabelecimento
- Machine learning simples (keyword matching)
- Sugestões baseadas em confirmações
- Accuracy tracking
- Configuração de sensibilidade
- Override manual sempre possível

Tarefas:
1. Criar tabela de regras de categorização
2. Implementar keyword matching
3. Mapear estabelecimento → categoria
4. Interface para confirmar/rejeitar sugestões
5. Calcular accuracy
6. Ajustar sugestões baseado em feedback
7. Documentar regras aprendidas
8. Testar com novos estabelecimentos
```

### 6.3 Acceptance Criteria
- [ ] OCR processa imagens em < 30s
- [ ] Accuracy > 80% para campos principais
- [ ] Validação user-friendly
- [ ] Aprendizado contínuo funcional
- [ ] Status tracking em tempo real
- [ ] Retry e error handling robustos

---

## 7. ÉPICO 06 - Sistema de Orçamentos
**Prioridade:** MÉDIA | **Sprints:** 7 | **Story Points:** 18

### 7.1 Descrição
Implementar sistema de orçamentos com alertas e controle de gastos por categoria.

### 7.2 User Stories

**US-19: Criar Orçamento**
```
Como usuário
Quero definir orçamento para categorias
Para controlar gastos e evitar excessos

Critérios de Aceitação:
- Formulário: categoria, valor limite, período
- Tipos de período: diário, semanal, mensal, anual
- Data de início e fim
- Ativação de alertas
- Cálculo automático de progresso
- Status visual (ativo,接近 limite, excedido)

Tarefas:
1. Criar página Budgets
2. Implementar BudgetForm component
3. Criar endpoints CRUD para budgets
4. Validação de overlaps de período
5. Cálculo de progresso automático
6. Status indicators visuais
7. Ativação/desativação de orçamentos
8. Testar todos os tipos de período
```

**US-20: Alertas de Orçamento**
```
Como usuário
Quero ser alertado quando atingir 80% do orçamento
Para evitar gastos excessivos

Critérios de Aceitação:
- Check automático após cada transação
- Alertas em tempo real (banner, toast)
- Email notification (opcional)
- Configuração de percentuais (70%, 80%, 90%)
- Histórico de alertas
- Mark as read/unread

Tarefas:
1. Implementar trigger no backend
2. Criar sistema de notificações
3. Configurar thresholds (70%, 80%, 90%)
4. Toast notifications no frontend
5. Email service integration (opcional)
6. Mark as read functionality
7. Histórico de alertas
8. Testar com dados reais
```

### 7.3 Acceptance Criteria
- [ ] Orçamentos criados e editáveis
- [ ] Cálculos automáticos de progresso
- [ ] Alertas em tempo real
- [ ] Notificações por email (se habilitado)
- [ ] Histórico de alertas salvo
- [ ] Performance < 500ms para alertas

---

## 8. ÉPICO 07 - Previsões e IA
**Prioridade:** BAIXA | **Sprints:** 8-9 | **Story Points:** 29

### 8.1 Descrição
Implementar previsões de gastos usando regressão logarítmica e outros algoritmos.

### 8.2 User Stories

**US-21: Previsão de Gastos**
```
Como usuário
Quero ver projeção de gastos futuros
Para planejar orçamento e evitar surpresas

Critérios de Aceitação:
- Modelo de regressão logarítmica
- Gráfico com linha de tendência
- Intervalo de confiança (80%, 95%)
- Projeção 30, 60, 90 dias
- Accuracy score do modelo
- Atualização automática mensal

Tarefas:
1. Implementar algoritmo de regressão
2. Criar componente PredictionChart
3. Armazenar previsões no banco
4. Calcular confidence intervals
5. Endpoint para buscar previsões
6. UI para configurar período
7. Accuracy tracking
8. Testar accuracy com dados históricos
```

**US-22: Comparação Previsto vs Real**
```
Como usuário
Quero comparar previsões com gastos reais
Para avaliar accuracy do modelo

Critérios de Aceitação:
- Gráfico com linhas dupla (previsto/real)
- Métricas: MAE, MAPE, R²
- Alertas se accuracy < 70%
- Possibilidade de ajustar modelo
- Histórico de performance
- Filtro por categoria

Tarefas:
1. Implementar métricas de accuracy
2. Criar ComparisonChart
3. Calcular MAE, MAPE, R²
4. Interface para ajustar modelo
5. Tracking histórico
6. Alertas de baixa accuracy
7. Filtros avançados
8. Documentar performance
```

### 8.3 Acceptance Criteria
- [ ] Previsões geradas automaticamente
- [ ] Accuracy > 70% nos primeiros 30 dias
- [ ] Gráficos informativos
- [ ] Métricas de performance visíveis
- [ ] Modelo ajustável
- [ ] Performance < 5s para gerar previsão

---

## 9. ÉPICO 08 - Relatórios Avançados
**Prioridade:** BAIXA | **Sprints:** 10 | **Story Points:** 21

### 9.1 Descrição
Sistema de relatórios automatizados com export em PDF/Excel.

### 9.2 User Stories

**US-23: Relatórios Mensais**
```
Como usuário
Quero gerar relatório mensal detalhado
Para análise completa das finanças

Critérios de Aceitação:
- Relatório com resumo executivo
- Breakdown por categoria
- Comparação com mês anterior
- Gráficos incluídos no PDF
- Download automático
- Agendamento automático (opcional)

Tarefas:
1. Implementar PDF generator (jsPDF, Puppeteer)
2. Template de relatório mensal
3. Agregação de dados por categoria
4. Comparação temporal
5. Inclusão de gráficos
6. Endpoint para gerar relatório
7. Download interface
8. Testar com dados reais
```

**US-24: Export de Dados**
```
Como usuário
Quero exportar minhas transações
Para backup ou análise externa

Critérios de Aceitação:
- Formatos: CSV, Excel, JSON
- Filtros: período, categoria, tipo
- Campos customizáveis
- Download direto
- Progress indicator
- Email com arquivo (opcional)

Tarefas:
1. Implementar CSV generator
2. Excel export (SheetJS)
3. JSON export
4. Filtros no frontend
5. Seleção de campos
6. Download manager
7. Progress tracking
8. Testar com grandes volumes
```

### 9.3 Acceptance Criteria
- [ ] PDFs gerados com qualidade
- [ ] Export em múltiplos formatos
- [ ] Filtros funcionais
- [ ] Performance adequada (1000+ rows)
- [ ] Downloads confiáveis
- [ ] Progress indicators

---

## 10. ÉPICO 09 - Mobile e UX
**Prioridade:** MÉDIA | **Sprints:** 11 | **Story Points:** 21

### 10.1 Descrição
Otimização completa para dispositivos móveis e melhorias de UX.

### 10.2 User Stories

**US-25: Interface Mobile Otimizada**
```
Como usuário mobile
Quero interface adaptada ao celular
Para usar o app confortavelmente

Critérios de Aceitação:
- Touch-friendly buttons (min 44px)
- Layout responsivo em todas as telas
- Navegação mobile (bottom tabs ou drawer)
- Swipe gestures
- Pull to refresh
- Otimização para portrait/landscape

Tarefas:
1. Audit de responsividade atual
2. Adjustar breakpoints
3. Implementar touch gestures
4. Navegação mobile
5. Pull to refresh
6. Teste em múltiplos dispositivos
7. Otimização de performance
8. Ajustes finais
```

**US-26: PWA Features**
```
Como usuário
Quero instalar o app no celular
Para acesso rápido como app nativo

Critérios de Aceitação:
- Service Worker configurado
- Web App Manifest
- Ícone e splash screen
- Funciona offline (read-only)
- Add to home screen
- Push notifications (opcional)

Tarefas:
1. Configurar Service Worker
2. Criar Web App Manifest
3. Adicionar icons e splash screen
4. Cache strategies
5. Offline fallback
6. Teste de instalação
7. Push notifications setup
8. Deploy PWA
```

### 10.3 Acceptance Criteria
- [ ] 100% responsivo
- [ ] Touch interactions fluidas
- [ ] PWA installável
- [ ] Offline mode básico
- [ ] Performance > 90 Lighthouse
- [ ] UX audit passed

---

## 11. ÉPICO 10 - Documentação BMAD
**Prioridade:** MÉDIA | **Sprints:** 12 | **Story Points:** 21

### 11.1 Descrição
Documentação completa da metodologia BMAD aplicada no projeto para fins educacionais.

### 11.2 User Stories

**US-27: Guia BMAD do Projeto**
```
Como instrutor
Quero documentação detalhada da aplicação BMAD
Para ensinar metodologia de forma prática

Critérios de Aceitação:
- Documento explicativo da aplicação BMAD
- Capturas de tela de cada etapa
- Código comentado com referências BMAD
- Lições aprendidas
- Best practices
- Reprodutibilidade para novas turmas

Tarefas:
1. Documentar processo Build
2. Documentar processo Modify
3. Documentar processo Adapt
4. Documentar processo Develop
5. Capturar screenshots
6. Comentar código
7. Consolidar lições aprendidas
8. Review e refinamento
```

**US-28: Material Didático**
```
Como instrutor
Quero slides e exercícios práticos
Para facilitar ensino em sala

Critérios de Aceitação:
- Apresentação em PDF/PPT
- Exercícios hands-on
- Checkpoint assessments
- Repositório de exemplos
- Cronograma de aula
- Feedback forms

Tarefas:
1. Criar apresentação BMAD
2. Desenvolver exercícios práticos
3. Criar checkpoints
4. Setup repositório de exemplos
5. Definir cronograma
6. Criar feedback forms
7. Testar com beta turma
8. Refinamento final
```

### 11.3 Acceptance Criteria
- [ ] Documentação 100% completa
- [ ] Material didático pronto para uso
- [ ] Exercícios testados
- [ ] Repositório organizado
- [ ] Cronograma detalhado
- [ ] Feedback collected

---

## 12. Resumo de Estimativas

### 12.1 Story Points por Épico

| Épico | Sprints | Story Points | Prioridade |
|-------|---------|--------------|------------|
| 01 - Infraestrutura | 1 | 21 | ALTA |
| 02 - Autenticação | 2 | 13 | ALTA |
| 03 - Transações | 3-4 | 26 | ALTA |
| 04 - Dashboard | 4 | 21 | ALTA |
| 05 - n8n OCR | 5-6 | 34 | MÉDIA |
| 06 - Orçamentos | 7 | 18 | MÉDIA |
| 07 - Previsões IA | 8-9 | 29 | BAIXA |
| 08 - Relatórios | 10 | 21 | BAIXA |
| 09 - Mobile UX | 11 | 21 | MÉDIA |
| 10 - Documentação | 12 | 21 | MÉDIA |

**Total:** 225 Story Points em 12 Sprints

### 12.2 Dependências Críticas

```
Infraestrutura (Epic 01)
    ↓
Autenticação (Epic 02)
    ↓
Transações (Epic 03)
    ↓
Dashboard (Epic 04)
    ↓
n8n OCR (Epic 05) [Independente]
    ↓
Orçamentos (Epic 06)
    ↓
Previsões IA (Epic 07)
    ↓
Relatórios (Epic 08)
    ↓
Mobile UX (Epic 09)
    ↓
Documentação (Epic 10)
```

### 12.3 Recursos Necessários

**Equipe:**
- 1 Tech Lead / Instrutor (BMAD coordination)
- 2-3 Desenvolvedores (React/Node.js)
- 1 Especialista n8n (OCR workflow)
- 1 UX/UI Designer (opcional)

**Ferramentas:**
- Google AI Studio (React)
- Supabase (Database, Auth, Storage)
- n8n (Workflow automation)
- GitHub (Version control)
- Figma/Adobe XD (UI/UX - opcional)

**Serviços Externos:**
- Google Vision API (OCR)
- SendGrid/Mailgun (Email)
- AWS S3 (Image storage - opcional)

---

## 13. Critérios de Pronto (Definition of Done)

### 13.1 Para Cada User Story

- [ ] Código implementado
- [ ] Unit tests escritos (> 80% coverage)
- [ ] Integration tests passando
- [ ] Code review aprovado
- [ ] Documentação atualizada
- [ ] Deploy em ambiente de staging
- [ ] Testado em ambiente de produção
- [ ] Acceptance criteria validados
- [ ] Metrics coletadas (performance, bugs)

### 13.2 Para Cada Épico

- [ ] Todas as stories do épico concluídas
- [ ] Epic review realizado
- [ ] Documentação do épico atualizada
- [ ] Lições aprendidas documentadas
- [ ] Ready for next epic

---

## 14. Metrics e KPIs

### 14.1 Técnicas
- **Velocity:** Story points por sprint
- **Quality:** Bug rate, Test coverage
- **Performance:** Page load time, API response time
- **Stability:** Uptime, Error rate

### 14.2 de Negócio
- **User Adoption:** # usuários registrados
- **Usage:** # transações por usuário
- **OCR Success:** % de OCR bem-sucedidos
- **Prediction Accuracy:** % accuracy das previsões

---

## 15. Riscos e Mitigações

### 15.1 Alto Risco
**Risco:** Integração n8n complexa
**Probabilidade:** 40% | **Impacto:** Alto
**Mitigação:** POC antecipado, sprint dedicado, documentação detalhada

**Risco:** Performance OCR insatisfatória
**Probabilidade:** 30% | **Impacto:** Médio
**Mitigação:** Múltiplos providers, validação manual, fallback manual

### 15.2 Médio Risco
**Risco:** Complexidade de previsões IA
**Probabilidade:** 50% | **Impacto:** Médio
**Mitigação:** Começar simples (média móvel), iterar para regressão

**Risco:** Scope creep educacional
**Probabilidade:** 60% | **Impacto:** Médio
**Mitigação:** MVP bem definido, product owner dedicado, change control

---

## 16. Plano de Contingência

### 16.1 Se OCR Falhar
1. Focar em entrada manual initially
2. Implementar OCR posteriormente (Epic 05 opcional)
3. Manual upload como fallback
4. Documentar OCR como future enhancement

### 16.2 Se Previsões IA Forem Complexas
1. Implementar média móvel simples
2. Regressão linear básica
3. Adicionar logarítmica depois
4. Usar biblioteca existente ( TensorFlow.js )

---

## 17. Próximos Passos

### 17.1 Imediatos (Esta Semana)
- [ ] Aprovar este documento de epics
- [ ] Setup sprint planning (Sprint 01)
- [ ] Iniciar Epic 01 - Infraestrutura
- [ ] Configurar ambiente de desenvolvimento
- [ ] Primeira daily meeting

### 17.2 Sprint 01 (Semanas 1-2)
- [ ] Completar Epic 01
- [ ] Iniciar Epic 02
- [ ] Setup CI/CD pipeline
- [ ] Primeiros testes automatizados

### 17.3 Sprint 02-03 (Semanas 3-6)
- [ ] Completar Epic 02 e 03
- [ ] MVP funcional (crud básico)
- [ ] Primeiros demos internos

### 17.4 Milestone 1 (Mês 1)
- [ ] MVP completo (Epic 01-04)
- [ ] Deploy em produção
- [ ] Primeiro demo para stakeholders
- [ ] Retrospectiva e ajustes

---

**Status:** ✅ Epics Documento Completo
**Versão:** 1.0
**Próxima Revisão:** Após Sprint 3

---

*Este documento serve como guia principal para o desenvolvimento do projeto Gestor Financeiro BMAD. Deve ser atualizado conforme evolução do projeto e feedback das sprints.*

# PRD - Product Requirements Document
## Gestor Financeiro com Metodologia BMAD

**Versão:** 1.0
**Data:** 27 de Novembro de 2025
**Autor:** Israel
**Status:** Draft para Aprovação

---

## 1. Product Overview

### 1.1 Product Vision
Sistema gestor financeiro educacional desenvolvido para demonstrar a metodologia BMAD em um projeto real e funcional, integrando React/PostgreSQL/n8n com OCR automatizado para captura de dados financeiros via fotos.

### 1.2 Problem Statement
**Problema Educacional:** Ensinar metodologia BMAD de forma prática e envolvente
**Solução:** Projeto real de gestão financeira onde alunos acompanham desenvolvimento end-to-end

**Problema Funcional:** Controle financeiro pessoal/empresarial complexo e manual
**Solução:** Sistema automatizado com captura via OCR e análises BI temporais

### 1.3 Target Users

**Primário:** Instrutores de desenvolvimento e alunos
**Secundário:** Usuários finais do sistema financeiro

**Perfis:**
- **Instrutor BMAD:** Coordena demonstração, explica metodologia
- **Aluno Iniciante:** Acompanha desenvolvimento, aprende BMAD
- **Aluno Intermediário:** Participa ativamente, contribui com código
- **Usuário Final:** Utiliza o sistema para controle financeiro real

---

## 2. Product Goals

### 2.1 Primary Goals (Educacionais)
1. **Demonstrar Metodologia BMAD** - Aplicação prática e completa
2. **Ensinar Integrações Modernas** - React/n8n/PostgreSQL em ação
3. **Engajar through Prática** - Projeto real vs exemplos teóricos
4. **Criar Material Replicável** - Documentação para futuras turmas

### 2.2 Secondary Goals (Funcionais)
1. **Sistema Financeiro Usável** - Controle real de gastos e receitas
2. **OCR Automatizado** - Reduzir entrada manual de dados
3. **BI Intuitive** - Visualizações claras e insights rápidos
4. **Mobile-First** - Acesso anywhere, anytime

---

## 3. User Personas

### Persona 1: Instrutor BMAD
**Nome:** Carlos Silva
**Perfil:** Desenvolvedor sênior, enseña programação
**Necessidades:**
- Material didático estruturado
- Demonstrações fluidas
- Código limpo e documentado
- Explicações step-by-step

**Pain Points:**
- Metodologias teóricas difíceis de engajar
- Falta de projetos práticos integrando múltiplas ferramentas
- Dificuldade em mostrar processo completo

**Goals:**
- Ensinar BMAD efetivamente
- Demonstrar integrações reais
- Criar material replicável

### Persona 2: Aluno Iniciante
**Nome:** Ana Paula
**Perfil:** Iniciante em desenvolvimento
**Necessidades:**
- Aprendizado gradual
- Exemplos práticos
- Feedback imediato
- Suporte active

**Pain Points:**
- Teoria sem prática
- Muitas ferramentas simultaneamente
- Falta de visão geral do projeto

**Goals:**
- Compreender BMAD
- Aplicar em projeto simples
- Ganhar confiança em integrações

### Persona 3: Usuário Final
**Nome:** João Santos
**Perfil:** Micro-empresário
**Necessidades:**
- Controle financeiro simplificado
- Relatórios visuais
- Acesso mobile
- Dados seguros

**Pain Points:**
- Planilhas manuais
- Falta de visão temporal
- Dificuldade categorizar gastos
- Sem backup automatizado

**Goals:**
- Controlar gastos eficientemente
- Prever tendências financeiras
- Reduzir trabalho manual

---

## 4. User Stories

### 4.1 Autenticação e Setup

**US001 - Acesso ao Sistema**
```
Como usuário
Quero fazer login no sistema
Para acessar meus dados financeiros

Critérios de Aceitação:
- Login via email/senha
- Validação de credenciais
- Redirecionamento para dashboard
- Manter sessão ativa
```

**US002 - Primeiro Acesso**
```
Como novo usuário
Quero configurar categorias iniciais
Para organizar meus gastos desde o início

Critérios de Aceitação:
- Tela de onboarding
- Predefinição de categorias comuns
- Possibilidade de customizar
- Persistência das configurações
```

### 4.2 Entrada Manual de Dados

**US003 - Registrar Gasto Manual**
```
Como usuário
Quero inserir gasto manualmente
Para ter controle preciso de pequenas despesas

Critérios de Aceitação:
- Formulário com campos: valor, descrição, categoria, data
- Validação de campos obrigatórios
- Feedback de sucesso/erro
- Listagem em tempo real
```

**US004 - Registrar Receita**
```
Como usuário
Quero inserir receitas recebidas
Para ter visão completa das finanças

Critérios de Aceitação:
- Formulário similar a gastos
- Campo para fonte da receita
- Categoria "Receita" pré-definida
- Integração com dashboard
```

### 4.3 Captura por Foto (OCR)

**US005 - Upload de Foto**
```
Como usuário
Quero fotografar recibos e faturas
Para automatizar entrada de dados

Critérios de Aceitação:
- Interface para upload de foto
- Preview da imagem
- Feedback de processamento
- Barra de progresso
```

**US006 - Processamento OCR**
```
Como usuário
Quero que o sistema extraia dados automaticamente
Para economizar tempo de digitação

Critérios de Aceitação:
- Integração com n8n workflow
- Extração: valor, data, estabelecimento
- Apresentação para validação
- Edição antes de salvar
```

**US007 - Validação OCR**
```
Como usuário
Quero revisar dados extraídos
Para garantir precisão

Critérios de Aceitação:
- Dados extraídos em campos editáveis
- Confirmação antes de salvar
- Marcação de campos uncertain
- Opção de refazer OCR
```

### 4.4 Categorização

**US008 - Categoria Automática**
```
Como usuário
Quero que gastos sejam categorizados automaticamente
Para organizar melhor os dados

Critérios de Aceitação:
- Sugestão baseada em estabelecimento
- Aprendizagem com confirmações
- Histórico de categorizações
- Confidence score
```

**US009 - Categoria Manual**
```
Como usuário
Quero definir categoria manualmente
Para customizar classificação

Critérios de Aceitação:
- Dropdown com categorias existentes
- Criar nova categoria
- Hierarquia de categorias
- Ícones identificadores
```

### 4.5 Dashboard BI

**US010 - Visualizar Gastos por Período**
```
Como usuário
Quero gráficos de evolução temporal
Para identificar tendências

Critérios de Aceitação:
- Gráfico de linha (gastos ao longo do tempo)
- Filtro por período (semana/mês/ano)
- Zoom in/out no gráfico
- Tooltips informativos
```

**US011 - Analisar por Categoria**
```
Como usuário
Quero breakdown por categoria
Para entender distribuição de gastos

Critérios de Aceitação:
- Gráfico de pizza/donut
- Percentuais por categoria
- Valores absolutos
- Comparação entre períodos
```

**US012 - Dashboard Mobile**
```
Como usuário mobile
Quero interface adaptada ao celular
Para consultar anywhere

Critérios de Aceitação:
- Layout responsivo
- Touch-friendly controls
- Gráficos otimizados para mobile
- Loading rápido
```

### 4.6 Previsões

**US013 - Prever Tendências**
```
Como usuário
Quero projeção de gastos futuros
Para planejar orçamento

Critérios de Aceitação:
- Modelo de regressão logarítmica
- Gráfico com linha de tendência
- Intervalo de confiança
- Projeção 30/60/90 dias
```

**US014 - Alertas Orçamentários**
```
Como usuário
Quero ser notificado sobre limites
Para evitar gastos excessivos

Critérios de Aceitação:
- Definir budget por categoria
- Alertas quando 80% budget atingido
- Notificações em tempo real
- Histórico de alertas
```

### 4.7 Relatórios

**US015 - Relatório Mensal**
```
Como usuário
Quero relatório detalhado do mês
Para análise completa

Critérios de Aceitação:
- Resumo executivo
- Breakdown por categoria
- Comparação com mês anterior
- Export PDF/Excel
```

**US016 - Export Dados**
```
Como usuário
Quero exportar meus dados
Para backup ou análise externa

Critérios de Aceitação:
- Formato CSV/Excel
- Filtros por período
- Seleção de campos
- Download direto
```

---

## 5. Functional Requirements

### 5.1 Gestão de Usuários
- **RF001:** Sistema de autenticação (email/senha)
- **RF002:** Gerenciamento de perfil
- **RF003:** Reset de senha via email
- **RF004:** Múltiplos usuários (opcional para MVP)

### 5.2 Gestão Financeira
- **RF005:** CRUD completo de transações (gastos e receitas)
- **RF006:** Campos: id, valor, descrição, categoria, data, tipo
- **RF007:** Validação de dados obrigatórios
- **RF008:** Histórico de modificações

### 5.3 Sistema OCR
- **RF009:** Upload de imagens (JPG, PNG, PDF)
- **RF010:** Integração com n8n workflow
- **RF011:** Extração: valor, data, estabelecimento, produtos
- **RF012:** Confidence score para dados extraídos
- **RF013:** Interface de validação e edição

### 5.4 Categorização
- **RF014:** CRUD de categorias
- **RF015:** Hierarquia de categorias (pai/filho)
- **RF016:** Categorização automática por IA/regras
- **RF017:** Sugestões baseadas em histórico

### 5.5 Dashboard e BI
- **RF018:** Gráficos de linha (evolução temporal)
- **RF019:** Gráficos de pizza (distribuição)
- **RF020:** Filtros por período, categoria, valor
- **RF021:** Zoom e interatividade nos gráficos
- **RF022:** Responsividade (desktop e mobile)

### 5.6 Previsões e IA
- **RF023:** Modelo de regressão logarítmica
- **RF024:** Projeção de 30/60/90 dias
- **RF025:** Intervalo de confiança
- **RF026:** Alertas de budget
- **RF027:** Machine learning para categorização

### 5.7 Relatórios
- **RF028:** Relatórios mensais automatizados
- **RF029:** Comparação entre períodos
- **RF030:** Export PDF
- **RF031:** Export CSV/Excel
- **RF032:** Agendamento de relatórios

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **NFR001:** Tempo de resposta do dashboard < 2 segundos
- **NFR002:** Processamento OCR < 30 segundos por imagem
- **NFR003:** Carregamento inicial < 3 segundos
- **NFR004:** Suporte a 1000+ transações por usuário

### 6.2 Usabilidade
- **NFR005:** Interface intuitiva (máximo 3 cliques para ação principal)
- **NFR006:** Design responsivo para dispositivos 320px+
- **NFR007:** Acessibilidade (WCAG 2.1 Level AA)
- **NFR008:** Feedback visual para todas as ações

### 6.3 Segurança
- **NFR009:** Autenticação gerenciada pelo Supabase Auth (sem armazenar senhas)
- **NFR010:** Validação e sanitização de inputs
- **NFR011:** HTTPS obrigatório
- **NFR012:** Backup/migrações gerenciados via Supabase (dump sob demanda)

### 6.4 Disponibilidade
- **NFR013:** Uptime 99.5% durante demonstrações
- **NFR014:** Error handling robusto
- **NFR015:** Logs de auditoria
- **NFR016:** Modo offline básico (visualização dados)

### 6.5 Escalabilidade
- **NFR017:** Arquitetura modular (agentes BMAD)
- **NFR018:** APIs RESTful
- **NFR019:** Banco estruturado para crescimento
- **NFR020:** Cache de queries frequentes

---

## 7. Technical Requirements

### 7.1 Frontend (React)
- **Tech001:** React 18+ com hooks
- **Tech002:** State management (Context API ou Redux)
- **Tech003:** Routing (React Router)
- **Tech004:** UI Framework (Material-UI ou Tailwind)
- **Tech005:** Charts (Chart.js ou Recharts)
- **Tech006:** Build tool (Vite ou Create React App)

### 7.2 Backend (Supabase)
- **Tech007:** Supabase (PostgreSQL + Auth + Storage)
- **Tech008:** Supabase JavaScript Client no frontend
- **Tech009:** Edge Functions (opcional) para lógica server-side
- **Tech010:** Autenticação via Supabase Auth (sessions)
- **Tech011:** Validação de entrada no frontend e nas Edge Functions
- **Tech012:** Observabilidade (logs agregados, sem dados sensíveis)

### 7.3 Integração (n8n)
- **Tech013:** n8n instance configurada
- **Tech014:** Webhook endpoints
- **Tech015:** OCR nodes (Google Vision, Tesseract)
- **Tech016:** Data transformation nodes
- **Tech017:** Error handling e retries

### 7.4 DevOps e Deploy
- **Tech018:** Git + GitHub versioning
- **Tech019:** GitHub Pages (frontend)
- **Tech020:** Heroku/Railway (backend)
- **Tech021:** Environment variables
- **Tech022:** CI/CD pipeline básico

---

## 8. Data Requirements

### 8.1 Fonte Única de Tabelas (Supabase)
```
usuario
  id UUID PK (FK → auth.users.id)
  nome VARCHAR(100)
  avatar_url VARCHAR(255)
  preferencial_moeda VARCHAR(3) DEFAULT 'BRL'
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo'
  ativo BOOLEAN DEFAULT true
  created_at TIMESTAMP DEFAULT now()
  updated_at TIMESTAMP DEFAULT now()
  deleted_at TIMESTAMP NULL

categoria
  id UUID PK DEFAULT gen_random_uuid()
  user_id UUID FK → usuario.id
  parent_id UUID FK → categoria.id
  nome VARCHAR(100)
  descricao TEXT NULL
  cor VARCHAR(7) NULL
  icone VARCHAR(50) NULL
  tipo ENUM('gasto','receita','ambos')
  ordem INTEGER DEFAULT 0
  ativo BOOLEAN DEFAULT true
  created_at TIMESTAMP
  updated_at TIMESTAMP
  deleted_at TIMESTAMP NULL

transacao
  id UUID PK DEFAULT gen_random_uuid()
  user_id UUID FK → usuario.id
  categoria_id UUID FK → categoria.id
  tipo ENUM('gasto','receita')
  valor DECIMAL(15,2)
  descricao VARCHAR(255)
  data DATE
  hora TIME NULL
  local VARCHAR(255) NULL
  forma_pagamento ENUM('dinheiro','cartao_credito','cartao_debito','pix','transferencia','cheque','outros') NULL
  status ENUM('pendente','confirmado','cancelado') DEFAULT 'confirmado'
  source ENUM('manual','ocr','import')
  recurring BOOLEAN DEFAULT false
  recurring_id UUID FK → transacao.id NULL
  created_at TIMESTAMP
  updated_at TIMESTAMP
  deleted_at TIMESTAMP NULL

imagem
  id UUID PK DEFAULT gen_random_uuid()
  transacao_id UUID FK → transacao.id
  nome_arquivo VARCHAR(255)
  path_arquivo VARCHAR(500)
  mime_type VARCHAR(100)
  tamanho_bytes BIGINT NULL
  ocr_status ENUM('pending','processing','completed','failed')
  ocr_confidence DECIMAL(5,2) NULL
  ocr_data JSONB NULL
  dados_extraidos JSONB NULL
  processado_at TIMESTAMP NULL
  created_at TIMESTAMP
  updated_at TIMESTAMP

previsao
  id UUID PK DEFAULT gen_random_uuid()
  user_id UUID FK → usuario.id
  categoria_id UUID FK → categoria.id
  data_inicio DATE
  data_fim DATE
  valor_previsto DECIMAL(15,2)
  valor_real DECIMAL(15,2) NULL
  confidence_score DECIMAL(5,2) NULL
  algoritmo ENUM('linear','logaritmica','exponencial')
  parametros JSONB NULL
  accuracy DECIMAL(5,2) NULL
  status ENUM('ativa','inativa','expirada') DEFAULT 'ativa'
  created_at TIMESTAMP
  updated_at TIMESTAMP
  deleted_at TIMESTAMP NULL

orcamento
  id UUID PK DEFAULT gen_random_uuid()
  user_id UUID FK → usuario.id
  categoria_id UUID FK → categoria.id
  nome VARCHAR(100)
  valor_limite DECIMAL(15,2)
  valor_gasto DECIMAL(15,2) DEFAULT 0
  periodo ENUM('diario','semanal','mensal','anual')
  data_inicio DATE
  data_fim DATE
  alertas_ativos BOOLEAN DEFAULT true
  alertas_enviados INTEGER DEFAULT 0
  status ENUM('ativo','excedido','inativo') DEFAULT 'ativo'
  created_at TIMESTAMP
  updated_at TIMESTAMP
  deleted_at TIMESTAMP NULL

relatorio
  id UUID PK DEFAULT gen_random_uuid()
  user_id UUID FK → usuario.id
  tipo ENUM('mensal','trimestral','anual','customizado')
  periodo_inicio DATE
  periodo_fim DATE
  status ENUM('gerando','completo','erro')
  path_arquivo VARCHAR(500) NULL
  formato ENUM('pdf','excel','csv') NULL
  dados JSONB NULL
  enviado_email BOOLEAN DEFAULT false
  generated_at TIMESTAMP NULL
  created_at TIMESTAMP
  updated_at TIMESTAMP

configuracao_usuario
  id UUID PK DEFAULT gen_random_uuid()
  user_id UUID FK → usuario.id
  chave VARCHAR(100)
  valor TEXT
  tipo_valor ENUM('string','number','boolean','json')
  descricao TEXT NULL
  created_at TIMESTAMP
  updated_at TIMESTAMP
```

### 8.2 Dados Iniciais
- Categorias padrão: Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Outros
- Regras de categorização por palavras-chave
- Templates para OCR (tipos de documentos)

---

## 9. Integration Requirements

### 9.1 Google AI Studio
- **INT001:** Ambiente React configurado
- **INT002:** Deploy automático para GitHub Pages
- **INT003:** Integração com GitHub repository

### 9.2 n8n
- **INT004:** Workflow OCR completo
- **INT005:** Webhook endpoints para comunicação
- **INT006:** Error handling e fallbacks

### 9.3 Supabase
- **INT007:** Projeto Supabase configurado (URL/anon key via `.env`)
- **INT008:** RLS habilitado e políticas por tabela
- **INT009:** Migrações SQL versionadas (scripts em `.bmad/output`)
- **INT010:** Storage para imagens (bucket `receipts`)

---

## 10. Constraints

### 10.1 Técnicas
- **CON001:** Deployment sem custos (GitHub Pages + Supabase Free Tier)
- **CON002:** OCR limitado a 100 imagens/dia (n8n free)
- **CON003:** Banco Supabase (Free Tier)
- **CON004:** Tempo de processamento OCR não-real-time

### 10.2 Educacionais
- **CON005:** Código deve ser didático (comentários, estrutura clara)
- **CON006:** Documentação detalhada em cada etapa
- **CON007:** Progressão gradual de complexidade
- **CON008:** Suporte a dúvidas e debugging em tempo real

---

## 11. Assumptions

### 11.1 Técnicas
- **ASM001:** Usuários têm conexão estável à internet
- **ASM002:** n8n instance estará disponível 24/7
- **ASM003:** Projeto Supabase provisionado e acessível
- **ASM004:** OCR tem precisão mínima 80%

### 11.2 de Negócio
- **ASM005:** Demanda para sistema financeiro simples
- **ASM006:** Usuários dispostos a aprender BMAD
- **ASM007:** Interesse em integrações modernas
- **ASM008:** Necessidade real de controle financeiro

---

## 12. Dependencies

### 12.1 Externas
- **DEP001:** Google AI Studio - Frontend development
- **DEP002:** n8n - Workflow automation
- **DEP003:** Supabase - Database & Auth
- **DEP004:** GitHub - Version control e hosting

### 12.2 Internas
- **DEP005:** Metodologia BMAD - Framework de desenvolvimento
- **DEP006:** Team expertise - n8n, React, PostgreSQL
- **DEP007:** Educational content - Material didático
- **DEP008:** Testing environment - Dev/staging setup

---

## 13. Acceptance Criteria

### 13.1 MVP (Fase 1)
- [ ] Sistema de autenticação via Supabase Auth funcional
- [ ] CRUD de transações manual
- [ ] Dashboard básico com gráficos
- [ ] Estrutura Supabase (tabelas + RLS) configurada
- [ ] Interface responsiva
- [ ] Documentação BMAD integrada
- [ ] Deploy funcional no GitHub

### 13.2 Fase 2
- [ ] Integração OCR n8n completa
- [ ] Categorização automática
- [ ] Previsões funcionais
- [ ] Relatórios automatizados
- [ ] Sistema de alertas
- [ ] Material pedagógico completo

### 13.3 Critérios de Qualidade
- [ ] Testes unitários覆盖率 > 70%
- [ ] Performance benchmarks atingidos
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Documentação completa
- [ ] Feedback positivo dos usuários

---

## 14. Success Metrics

### 14.1 Técnicos
- **SM001:** 100% das funcionalidades MVP implementadas
- **SM002:** 0 bugs críticos em produção
- **SM003:** Performance < 2s (95th percentile)
- **SM004:** OCR accuracy > 80%
- **SM005:** Uptime > 99.5%

### 14.2 Educacionais
- **SM006:** 100% dos alunos compreendem BMAD
- **SM007:** 90%+ feedback positivo
- **SM008:** Material 100% replicável
- **SM009:** Tempo de setup < 2 horas para nova turma
- **SM010:** Mínimo 3 demonstrações bem-sucedidas

### 14.3 de Produto
- **SM011:** 50+ transações registradas por usuário
- **SM012:** 80%+ usam OCR para captura
- **SM013:** 70%+ acessam dashboard semanalmente
- **SM014:** 60%+ usam previsões para orçamento
- **SM015:** 50%+ exportam relatórios

---

## 15. Risks and Mitigation

### 15.1 Alto Risco
**Risco:** Integração n8n complexa + instabilidade
**Probabilidade:** 40%
**Impacto:** Alto
**Mitigação:** Protótipo antecipado, documentação detalhada, alternativas (manual upload)

**Risco:** OCR accuracy baixa
**Probabilidade:** 30%
**Impacto:** Médio
**Mitigação:** Validação manual obrigatória, machine learning iterative, feedback loop

### 15.2 Médio Risco
**Risco:** Complexidade BMAD para iniciantes
**Probabilidade:** 50%
**Impacto:** Médio
**Mitigação:** Decomposição gradual, material de apoio, mentoria

**Risco:** Performance mobile insatisfatória
**Probabilidade:** 40%
**Impacto:** Médio
**Mitigação:** Testing contínuo, otimização progressive, fallback

### 15.3 Baixo Risco
**Risco:** Dependência de serviços externos
**Probabilidade:** 20%
**Impacto:** Baixo
**Mitigação:** Fallbacks, cache local, comunicação assíncrona

---

## 16. Open Questions

1. **Quantos usuários simultâneos** o sistema deve suportar?
2. **Qual level de segurança** é necessário (2FA, OAuth)?
3. **Como tratar dados sensíveis** (criptografia no banco)?
4. **Qual estratégia de backup** para produção?
5. **Como implementar notificações** (email, push, in-app)?
6. **Qual arquitetura multi-tenant** para futuras turmas?
7. **Como versionar workflows n8n** para diferentes versões?
8. **Qual estratégia de migration** para mudanças no schema?

---

## 17. Next Steps

1. **Aprovação do PRD** pelos stakeholders
2. **Criar DER** - Diagrama Entidade Relacionamento detalhado
3. **Definir Epics** - Macro tarefas para sprints
4. **Setup ambiente desenvolvimento** - Google AI Studio
5. **Criar infrastructure base** - PostgreSQL + n8n
6. **Desenvolver MVP** - Funcionalidades core
7. **Testes e validação** - Alpha testing
8. **Refinamentos** - Baseado no feedback
9. **Deploy produção** - Preparação para aula
10. **Preparar material didático** - Documentação final

---

**Status:** ✅ PRD Completo - Versão 1.0
**Revisão Necessária:** [ ] Sim [x] Não
**Aprovação:** [ ] Aprovado [ ] Pendente [ ] Rejeitado

---

*Este PRD serve como base técnica para desenvolvimento e deve ser atualizado conforme evolução do projeto.*

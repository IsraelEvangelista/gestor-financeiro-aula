# DER - Diagrama Entidade Relacionamento
## Gestor Financeiro - Metodologia BMAD

**Versão:** 1.0
**Data:** 27 de Novembro de 2025
**Autor:** Israel
**Banco de Dados:** Supabase (PostgreSQL 15+)
**Status:** Adaptado para Supabase Auth

---

## 1. Visão Geral do Modelo

### 1.1 Conceito
Modelo de dados para sistema gestor financeiro com foco em:
- **Dados Temporais:** Registro completo de datetime para análises evolutivas
- **Captura Diversa:** Entrada manual e via OCR (fotos de recibos)
- **Análises BI:** Suporte a visualizações e previsões
- **Metodologia BMAD:** Estrutura modular para agentes especializados

### 1.2 Entidades Principais
- **Usuário** - Autenticação e perfis
- **Categoria** - Classificação hierárquica de gastos e receitas
- **Transação** - Registro financeiro (gasto ou receita)
- **Imagem** - Armazenamento de fotos para OCR
- **Previsão** - Projeções baseadas em dados históricos
- **Orçamento** - Limites por categoria e período
- **Relatório** - Relatórios automatizados

### 1.3 Características Técnicas
- **Normalização:** 3ª Forma Normal (3FN)
- **Chaves:** UUID para PKs (melhor para distributed systems)
- **Audit Trail:** created_at, updated_at em todas as entidades
- **Soft Delete:** deleted_at para recoverability
- **Indexação:** Índices otimizados para queries frequentes
- **Constraints:** Validações no nível do banco

---

## 2. Diagrama Entidade Relacionamento (DER)

### 2.1 Representação Textual

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USUÁRIO                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK id                : UUID → auth.users.id [NOT NULL]                     │
│ email                : VARCHAR(255) [READ FROM auth.users]                 │
│ nome                 : VARCHAR(100) [NOT NULL]                             │
│ avatar_url           : VARCHAR(255)                                        │
│ preferencial_data    : DATE                                                │
│ preferencial_moeda   : VARCHAR(3) DEFAULT 'BRL'                            │
│ timezone             : VARCHAR(50) DEFAULT 'America/Sao_Paulo'             │
│ ativo                : BOOLEAN DEFAULT true                                │
│ created_at           : TIMESTAMP [NOT NULL]                                │
│ updated_at           : TIMESTAMP [NOT NULL]                                │
│ deleted_at           : TIMESTAMP                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ 1:N
                                      │
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CATEGORIA                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK id                : UUID                                                │
│ FK user_id           : UUID [NOT NULL] → USUARIO.id                        │
│ FK parent_id         : UUID → CATEGORIA.id (Self-Reference)                │
│ nome                 : VARCHAR(100) [NOT NULL]                             │
│ descricao            : TEXT                                                │
│ cor                  : VARCHAR(7) [HEX Color]                              │
│ icone                : VARCHAR(50)                                         │
│ tipo                 : ENUM('gasto', 'receita', 'ambos') [NOT NULL]        │
│ ordem                : INTEGER DEFAULT 0                                   │
│ ativo                : BOOLEAN DEFAULT true                                │
│ created_at           : TIMESTAMP [NOT NULL]                                │
│ updated_at           : TIMESTAMP [NOT NULL]                                │
│ deleted_at           : TIMESTAMP                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ 1:N
                                      │
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TRANSAÇÃO                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK id                : UUID                                                │
│ FK user_id           : UUID [NOT NULL] → USUÁRIO.id                         │
│ FK categoria_id      : UUID [NOT NULL] → CATEGORIA.id                      │
│ tipo                 : ENUM('gasto', 'receita') [NOT NULL]                 │
│ valor                : DECIMAL(15,2) [NOT NULL]                            │
│ descricao            : VARCHAR(255) [NOT NULL]                             │
│ data                 : DATE [NOT NULL]                                    │
│ hora                 : TIME                                                │
│ local                : VARCHAR(255)                                        │
│ forma_pagamento      : ENUM('dinheiro', 'cartao_credito', 'cartao_debito', │
│                        'pix', 'transferencia', 'cheque', 'outros')        │
│ status               : ENUM('pendente', 'confirmado', 'cancelado')         │
│ source               : ENUM('manual', 'ocr', 'import') [NOT NULL]         │
│ recurring            : BOOLEAN DEFAULT false                               │
│ recurring_id         : UUID → TRANSAÇÃO.id (Self-Reference)                │
│ created_at           : TIMESTAMP [NOT NULL]                                │
│ updated_at           : TIMESTAMP [NOT NULL]                                │
│ deleted_at           : TIMESTAMP                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ 1:1
                                      │
┌─────────────────────────────────────────────────────────────────────────────┐
│                          IMAGEM                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK id                : UUID                                                │
│ FK transacao_id      : UUID [NOT NULL] → TRANSAÇÃO.id                       │
│ nome_arquivo         : VARCHAR(255) [NOT NULL]                             │
│ path_arquivo         : VARCHAR(500) [NOT NULL]                             │
│ mime_type            : VARCHAR(100) [NOT NULL]                             │
│ tamanho_bytes        : BIGINT                                              │
│ ocr_status           : ENUM('pending', 'processing', 'completed', 'failed')│
│ ocr_confidence       : DECIMAL(5,2)                                        │
│ ocr_data             : JSONB                                               │
│ dados_extraidos      : JSONB                                               │
│ processado_at        : TIMESTAMP                                           │
│ created_at           : TIMESTAMP [NOT NULL]                                │
│ updated_at           : TIMESTAMP [NOT NULL]                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         PREVISÃO                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK id                : UUID                                                │
│ FK user_id           : UUID [NOT NULL] → USUÁRIO.id                         │
│ FK categoria_id      : UUID [NOT NULL] → CATEGORIA.id                      │
│ data_inicio          : DATE [NOT NULL]                                    │
│ data_fim             : DATE [NOT NULL]                                    │
│ valor_previsto       : DECIMAL(15,2) [NOT NULL]                            │
│ valor_real           : DECIMAL(15,2)                                       │
│ confidence_score     : DECIMAL(5,2)                                        │
│ algoritmo            : ENUM('linear', 'logaritmica', 'exponencial')        │
│ parametros           : JSONB                                               │
│ accuracy             : DECIMAL(5,2)                                        │
│ status               : ENUM('ativa', 'inativa', 'expirada')                │
│ created_at           : TIMESTAMP [NOT NULL]                                │
│ updated_at           : TIMESTAMP [NOT NULL]                                │
│ deleted_at           : TIMESTAMP                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ N:1
                                      │
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ORÇAMENTO                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK id                : UUID                                                │
│ FK user_id           : UUID [NOT NULL] → USUÁRIO.id                         │
│ FK categoria_id      : UUID [NOT NULL] → CATEGORIA.id                      │
│ nome                 : VARCHAR(100) [NOT NULL]                             │
│ valor_limite         : DECIMAL(15,2) [NOT NULL]                            │
│ valor_gasto          : DECIMAL(15,2) DEFAULT 0                             │
│ periodo              : ENUM('diario', 'semanal', 'mensal', 'anual')        │
│ data_inicio          : DATE [NOT NULL]                                    │
│ data_fim             : DATE [NOT NULL]                                    │
│ alertas_ativos       : BOOLEAN DEFAULT true                                │
│ alertas_enviados     : INTEGER DEFAULT 0                                   │
│ status               : ENUM('ativo', 'excedido', 'inativo')                │
│ created_at           : TIMESTAMP [NOT NULL]                                │
│ updated_at           : TIMESTAMP [NOT NULL]                                │
│ deleted_at           : TIMESTAMP                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        RELATÓRIO                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK id                : UUID                                                │
│ FK user_id           : UUID [NOT NULL] → USUÁRIO.id                         │
│ tipo                 : ENUM('mensal', 'trimestral', 'anual', 'customizado')│
│ periodo_inicio       : DATE [NOT NULL]                                    │
│ periodo_fim          : DATE [NOT NULL]                                    │
│ status               : ENUM('gerando', 'completo', 'erro')                │
│ path_arquivo         : VARCHAR(500)                                        │
│ formato              : ENUM('pdf', 'excel', 'csv')                         │
│ dados                : JSONB                                               │
│ enviado_email        : BOOLEAN DEFAULT false                                │
│ generated_at         : TIMESTAMP                                           │
│ created_at           : TIMESTAMP [NOT NULL]                                │
│ updated_at           : TIMESTAMP [NOT NULL]                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONFIGURAÇÃO_USUÁRIO                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ PK id                : UUID                                                │
│ FK user_id           : UUID [NOT NULL] → USUÁRIO.id                         │
│ chave                : VARCHAR(100) [NOT NULL]                             │
│ valor                : TEXT [NOT NULL]                                     │
│ tipo_valor           : ENUM('string', 'number', 'boolean', 'json')        │
│ descricao            : TEXT                                                │
│ created_at           : TIMESTAMP [NOT NULL]                                │
│ updated_at           : TIMESTAMP [NOT NULL]                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Especificação Detalhada das Entidades

### 3.1 Tabela: USUÁRIO

**Propósito:** Armazena preferências e dados complementares do usuário. A autenticação é gerenciada pelo Supabase Auth (`auth.users`).

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | UUID | PK, FK → auth.users.id | Referência ao usuário autenticado |
| nome | VARCHAR(100) | NOT NULL | Nome completo do usuário |
| avatar_url | VARCHAR(255) | NULL | URL do avatar (opcional) |
| preferencial_data | DATE | NULL | Formato de data preferido (DD/MM/AAAA) |
| preferencial_moeda | VARCHAR(3) | DEFAULT 'BRL' | Moeda padrão (ISO 4217) |
| timezone | VARCHAR(50) | DEFAULT 'America/Sao_Paulo' | Fuso horário |
| ativo | BOOLEAN | DEFAULT true | Status do usuário |
| created_at | TIMESTAMP | NOT NULL | Data de criação |
| updated_at | TIMESTAMP | NOT NULL | Data da última atualização |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Índices:**
- `idx_usuario_ativo` ON usuario(ativo)

**Notas Importantes:**
- O campo `id` é uma FK para `auth.users.id` (gerenciado pelo Supabase Auth)
- Email e senha são armazenados em `auth.users` (vault seguro do Supabase)
- Trigger recomendado para criar registro em `usuario` após signup em `auth.users`

**Seed Data (Inicial):**
```sql
-- Inserir após signup do usuário via Supabase Auth
-- O id será o mesmo retornado por auth.users
INSERT INTO usuario (id, nome, ativo)
VALUES (
  :auth_user_id,
  'Usuário Demo',
  true
);
```

---

### 3.2 Tabela: CATEGORIA

**Propósito:** Classificação hierárquica de transações financeiras.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | UUID | PK, NOT NULL | Identificador único |
| user_id | UUID | FK → usuario.id, NOT NULL | Usuário proprietário |
| parent_id | UUID | FK → categoria.id, NULL | Categoria pai (hierarquia) |
| nome | VARCHAR(100) | NOT NULL | Nome da categoria |
| descricao | TEXT | NULL | Descrição detalhada |
| cor | VARCHAR(7) | NULL | Código HEX da cor (#FF5733) |
| icone | VARCHAR(50) | NULL | Nome do ícone (material-icons) |
| tipo | ENUM | NOT NULL | Tipo: gasto, receita, ambos |
| ordem | INTEGER | DEFAULT 0 | Ordem de exibição |
| ativo | BOOLEAN | DEFAULT true | Status |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Relacionamentos:**
- N:1 com USUÁRIO
- 1:N com TRANSAÇÃO
- 1:1 (self-reference) para hierarquia

**Índices:**
- `idx_categoria_user` ON categoria(user_id)
- `idx_categoria_parent` ON categoria(parent_id)
- `idx_categoria_tipo` ON categoria(tipo)
- `idx_categoria_ativo` ON categoria(ativo)

**Seed Data (Categorias Padrão):**
```sql
-- Gastos
INSERT INTO categoria (id, user_id, nome, tipo, cor, icone) VALUES
(gen_random_uuid(), :user_id, 'Alimentação', 'gasto', '#FF6B6B', 'restaurant'),
(gen_random_uuid(), :user_id, 'Transporte', 'gasto', '#4ECDC4', 'directions_car'),
(gen_random_uuid(), :user_id, 'Moradia', 'gasto', '#45B7D1', 'home'),
(gen_random_uuid(), :user_id, 'Saúde', 'gasto', '#FFA07A', 'local_hospital'),
(gen_random_uuid(), :user_id, 'Educação', 'gasto', '#98D8C8', 'school'),
(gen_random_uuid(), :user_id, 'Lazer', 'gasto', '#F7DC6F', 'sports_esports'),
(gen_random_uuid(), :user_id, 'Outros', 'gasto', '#BB8FCE', 'category');

-- Receitas
INSERT INTO categoria (id, user_id, nome, tipo, cor, icone) VALUES
(gen_random_uuid(), :user_id, 'Salário', 'receita', '#52BE80', 'work'),
(gen_random_uuid(), :user_id, 'Freelance', 'receita', '#5DADE2', 'laptop_mac'),
(gen_random_uuid(), :user_id, 'Investimentos', 'receita', '#F8C471', 'trending_up'),
(gen_random_uuid(), :user_id, 'Outros', 'receita', '#AED6F1', 'attach_money');
```

---

### 3.3 Tabela: TRANSAÇÃO

**Propósito:** Registro de todas as transações financeiras (gastos e receitas).

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | UUID | PK, NOT NULL | Identificador único |
| user_id | UUID | FK → usuario.id, NOT NULL | Usuário |
| categoria_id | UUID | FK → categoria.id, NOT NULL | Categoria |
| tipo | ENUM | NOT NULL | gasto ou receita |
| valor | DECIMAL(15,2) | NOT NULL | Valor (positivo) |
| descricao | VARCHAR(255) | NOT NULL | Descrição |
| data | DATE | NOT NULL | Data da transação |
| hora | TIME | NULL | Hora (opcional) |
| local | VARCHAR(255) | NULL | Local/estabelecimento |
| forma_pagamento | ENUM | NULL | Forma de pagamento |
| status | ENUM | DEFAULT 'confirmado' | Status da transação |
| source | ENUM | NOT NULL | Origem: manual, OCR, import |
| recurring | BOOLEAN | DEFAULT false | Transação recorrente |
| recurring_id | UUID | FK → transacao.id, NULL | ID da transação recorrente |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Relacionamentos:**
- N:1 com USUÁRIO
- N:1 com CATEGORIA
- 1:1 com IMAGEM
- 1:N (self-reference) para recorrência

**Índices:**
- `idx_transacao_user_data` ON transacao(user_id, data)
- `idx_transacao_categoria` ON transacao(categoria_id)
- `idx_transacao_tipo` ON transacao(tipo)
- `idx_transacao_status` ON transacao(status)
- `idx_transacao_source` ON transacao(source)
- `idx_transacao_periodo` ON transacao(user_id, data, deleted_at)

**Constraints:**
```sql
-- Valor deve ser positivo
ALTER TABLE transacao ADD CONSTRAINT chk_valor_positivo
CHECK (valor > 0);

-- Data não pode ser futura
ALTER TABLE transacao ADD CONSTRAINT chk_data_nao_futura
CHECK (data <= CURRENT_DATE);

-- Recurring_id não pode ser igual ao próprio id
ALTER TABLE transacao ADD CONSTRAINT chk_recurring_id_diferente
CHECK (recurring_id <> id OR recurring_id IS NULL);
```

---

### 3.4 Tabela: IMAGEM

**Propósito:** Armazena informações sobre fotos de recibos/faturas para OCR.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | UUID | PK, NOT NULL | Identificador único |
| transacao_id | UUID | FK → transacao.id, NOT NULL | Transação asociada |
| nome_arquivo | VARCHAR(255) | NOT NULL | Nome original do arquivo |
| path_arquivo | VARCHAR(500) | NOT NULL | Caminho no sistema de arquivos |
| mime_type | VARCHAR(100) | NOT NULL | Tipo MIME (image/jpeg, etc) |
| tamanho_bytes | BIGINT | NULL | Tamanho em bytes |
| ocr_status | ENUM | DEFAULT 'pending' | Status do OCR |
| ocr_confidence | DECIMAL(5,2) | NULL | Score de confiança (0-100) |
| ocr_data | JSONB | NULL | Dados brutos do OCR |
| dados_extraidos | JSONB | NULL | Dados estruturados extraídos |
| processado_at | TIMESTAMP | NULL | Data de processamento |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |

**Relacionamentos:**
- 1:1 com TRANSAÇÃO

**Índices:**
- `idx_imagem_transacao` ON imagem(transacao_id)
- `idx_imagem_status` ON imagem(ocr_status)

**Exemplo OCR Data (JSONB):**
```json
{
  "texto_completo": "RECEITA\nRestaurante Exemplo\nData: 27/11/2025\nTotal: R$ 45,90",
  "valor": 45.90,
  "data": "2025-11-27",
  "estabelecimento": "Restaurante Exemplo",
  "confidence": 0.92,
  "palavras_chave": ["restaurante", "refeicao"]
}
```

---

### 3.5 Tabela: PREVISÃO

**Propósito:** Projeções de gastos/receitas baseadas em algoritmos de ML.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | UUID | PK, NOT NULL | Identificador único |
| user_id | UUID | FK → usuario.id, NOT NULL | Usuário |
| categoria_id | UUID | FK → categoria.id, NOT NULL | Categoria |
| data_inicio | DATE | NOT NULL | Início do período |
| data_fim | DATE | NOT NULL | Fim do período |
| valor_previsto | DECIMAL(15,2) | NOT NULL | Valor previsto |
| valor_real | DECIMAL(15,2) | NULL | Valor real (para comparação) |
| confidence_score | DECIMAL(5,2) | NULL | Score 0-100 |
| algoritmo | ENUM | NOT NULL | Algoritmo usado |
| parametros | JSONB | NULL | Parâmetros do modelo |
| accuracy | DECIMAL(5,2) | NULL | Accuracy histórica |
| status | ENUM | DEFAULT 'ativa' | Status |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Relacionamentos:**
- N:1 com USUÁRIO
- N:1 com CATEGORIA

**Índices:**
- `idx_previsao_user_periodo` ON previsao(user_id, data_inicio, data_fim)
- `idx_previsao_categoria` ON previsao(categoria_id)

---

### 3.6 Tabela: ORÇAMENTO

**Propósito:** Definição de limites de gastos por categoria e período.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | UUID | PK, NOT NULL | Identificador único |
| user_id | UUID | FK → usuario.id, NOT NULL | Usuário |
| categoria_id | UUID | FK → categoria.id, NOT NULL | Categoria |
| nome | VARCHAR(100) | NOT NULL | Nome do orçamento |
| valor_limite | DECIMAL(15,2) | NOT NULL | Limite de gastos |
| valor_gasto | DECIMAL(15,2) | DEFAULT 0 | Valor gasto atual |
| periodo | ENUM | NOT NULL | Tipo de período |
| data_inicio | DATE | NOT NULL | Início do orçamento |
| data_fim | DATE | NOT NULL | Fim do orçamento |
| alertas_ativos | BOOLEAN | DEFAULT true | Alertas habilitados |
| alertas_enviados | INTEGER | DEFAULT 0 | Contador de alertas |
| status | ENUM | DEFAULT 'ativo' | Status |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Relacionamentos:**
- N:1 com USUÁRIO
- N:1 com CATEGORIA

**Índices:**
- `idx_orcamento_user_periodo` ON orcamento(user_id, data_inicio, data_fim)
- `idx_orcamento_status` ON orcamento(status)

---

### 3.7 Tabela: RELATÓRIO

**Propósito:** Relatórios automatizados gerados pelo sistema.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | UUID | PK, NOT NULL | Identificador único |
| user_id | UUID | FK → usuario.id, NOT NULL | Usuário |
| tipo | ENUM | NOT NULL | Tipo do relatório |
| periodo_inicio | DATE | NOT NULL | Início do período |
| periodo_fim | DATE | NOT NULL | Fim do período |
| status | ENUM | DEFAULT 'gerando' | Status da geração |
| path_arquivo | VARCHAR(500) | NULL | Caminho do arquivo gerado |
| formato | ENUM | NULL | Formato do arquivo |
| dados | JSONB | NULL | Dados do relatório |
| enviado_email | BOOLEAN | DEFAULT false | Enviado por email |
| generated_at | TIMESTAMP | NULL | Data da geração |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |

**Relacionamentos:**
- N:1 com USUÁRIO

**Índices:**
- `idx_relatorio_user_tipo` ON relatorio(user_id, tipo)
- `idx_relatorio_status` ON relatorio(status)

---

### 3.8 Tabela: CONFIGURAÇÃO_USUÁRIO

**Propósito:** Configurações customizadas por usuário.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| id | UUID | PK, NOT NULL | Identificador único |
| user_id | UUID | FK → usuario.id, NOT NULL | Usuário |
| chave | VARCHAR(100) | NOT NULL | Chave da configuração |
| valor | TEXT | NOT NULL | Valor da configuração |
| tipo_valor | ENUM | NOT NULL | Tipo do valor |
| descricao | TEXT | NULL | Descrição |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |

**Relacionamentos:**
- N:1 com USUÁRIO

**Índices:**
- `idx_config_user_chave` ON configuracao_usuario(user_id, chave)

**Exemplo Configurações:**
```sql
INSERT INTO configuracao_usuario (user_id, chave, valor, tipo_valor) VALUES
(:user_id, 'tema', 'light', 'string'),
(:user_id, 'notificacoes_email', 'true', 'boolean'),
(:user_id, 'export_formato_default', 'pdf', 'string'),
(:user_id, 'ocr_idioma', 'pt-BR', 'string');
```

---

## 4. Relacionamentos Detalhados

### 4.1 Cardinalidades

| Relação | Tipo | Descrição |
|---------|------|-----------|
| USUÁRIO → CATEGORIA | 1:N | Um usuário tem múltiplas categorias |
| CATEGORIA → TRANSAÇÃO | 1:N | Uma categoria pode ter múltiplas transações |
| TRANSAÇÃO → IMAGEM | 1:1 | Uma transação pode ter uma imagem (OCR) |
| USUÁRIO → PREVISÃO | 1:N | Um usuário tem múltiplas previsões |
| CATEGORIA → PREVISÃO | 1:N | Uma categoria pode ter múltiplas previsões |
| USUÁRIO → ORÇAMENTO | 1:N | Um usuário tem múltiplos orçamentos |
| CATEGORIA → ORÇAMENTO | 1:N | Uma categoria pode ter múltiplos orçamentos |
| USUÁRIO → RELATÓRIO | 1:N | Um usuário tem múltiplos relatórios |
| CATEGORIA → CATEGORIA | 1:1 | Auto-relacionamento (hierarquia) |

### 4.2 Integridade Referencial

**Regras ON DELETE:**

| FK | ON DELETE | Justificativa |
|----|-----------|---------------|
| categoria.user_id | CASCADE | Se usuário delete, delete categorias |
| transacao.user_id | CASCADE | Se usuário delete, delete transações |
| transacao.categoria_id | RESTRICT | Não pode deletar categoria com transações |
| imagem.transacao_id | CASCADE | Se transação delete, delete imagem |
| previsao.user_id | CASCADE | Se usuário delete, delete previsões |
| orcamento.user_id | CASCADE | Se usuário delete, delete orçamentos |
| relatorio.user_id | CASCADE | Se usuário delete, delete relatórios |

---

## 5. Índices e Performance

### 5.1 Índices Recomendados

**Índices Primários (já criados):**
- Todas as PKs (UUID)

**Índices Secundários (queries frequentes):**
```sql
-- Dashboard queries
CREATE INDEX idx_transacao_dashboard ON transacao(user_id, data DESC, tipo)
WHERE deleted_at IS NULL;

-- Relatórios mensais
CREATE INDEX idx_relatorio_mensal ON transacao(user_id, EXTRACT(YEAR FROM data), EXTRACT(MONTH FROM data), categoria_id)
WHERE deleted_at IS NULL;

-- OCR status
CREATE INDEX idx_imagem_ocr ON imagem(ocr_status, processado_at)
WHERE ocr_status IN ('processing', 'pending');

-- Budget alerts
CREATE INDEX idx_orcamento_alert ON orcamento(user_id, status)
WHERE alertas_ativos = true AND status = 'ativo';

-- Previsões ativas
CREATE INDEX idx_previsao_ativa ON previsao(user_id, data_inicio, data_fim)
WHERE status = 'ativa';
```

### 5.2 Otimizações de Query

**Queries Otimizadas:**

```sql
-- Gastos do mês atual por categoria
SELECT c.nome, SUM(t.valor) as total
FROM transacao t
JOIN categoria c ON t.categoria_id = c.id
WHERE t.user_id = :user_id
  AND t.tipo = 'gasto'
  AND t.data >= DATE_TRUNC('month', CURRENT_DATE)
  AND t.deleted_at IS NULL
GROUP BY c.id, c.nome
ORDER BY total DESC;

-- Previsão vs Real por categoria
SELECT c.nome,
       COALESCE(p.valor_previsto, 0) as previsto,
       COALESCE(SUM(t.valor), 0) as real
FROM categoria c
LEFT JOIN previsao p ON c.id = p.categoria_id
  AND p.data_inicio <= CURRENT_DATE
  AND p.data_fim >= CURRENT_DATE
LEFT JOIN transacao t ON c.id = t.categoria_id
  AND t.data BETWEEN p.data_inicio AND p.data_fim
WHERE c.user_id = :user_id
  AND c.tipo = 'gasto'
GROUP BY c.id, c.nome, p.valor_previsto;
```

---

## 6. Triggers e Funções

### 6.1 Trigger: Atualizar valor_gasto no ORÇAMENTO

```sql
CREATE OR REPLACE FUNCTION update_orcamento_gasto()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza valor_gasto quando transação é inserida/atualizada
  UPDATE orcamento
  SET valor_gasto = valor_gasto + NEW.valor
  WHERE categoria_id = NEW.categoria_id
    AND data_inicio <= NEW.data
    AND data_fim >= NEW.data
    AND status = 'ativo';

  -- Atualiza status se excedeu limite
  UPDATE orcamento
  SET status = CASE
    WHEN valor_gasto >= valor_limite THEN 'excedido'
    ELSE 'ativo'
  END
  WHERE categoria_id = NEW.categoria_id
    AND status IN ('ativo', 'excedido');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_orcamento_gasto
  AFTER INSERT OR UPDATE ON transacao
  FOR EACH ROW
  EXECUTE FUNCTION update_orcamento_gasto();
```

### 6.2 Trigger: Atualizar updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar em todas as tabelas com updated_at
CREATE TRIGGER trg_usuario_updated_at
  BEFORE UPDATE ON usuario
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_categoria_updated_at
  BEFORE UPDATE ON categoria
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... (repetir para todas as tabelas)
```

---

## 7. Views (VViews)

### 7.1 View: Dashboard Summary

```sql
CREATE VIEW v_dashboard_summary AS
SELECT
  u.id as user_id,
  u.nome,
  -- Gastos do mês
  COALESCE(SUM(CASE WHEN t.tipo = 'gasto' AND t.data >= DATE_TRUNC('month', CURRENT_DATE) THEN t.valor END), 0) as gastos_mes,
  -- Receitas do mês
  COALESCE(SUM(CASE WHEN t.tipo = 'receita' AND t.data >= DATE_TRUNC('month', CURRENT_DATE) THEN t.valor END), 0) as receitas_mes,
  -- Saldo
  COALESCE(SUM(CASE WHEN t.tipo = 'receita' THEN t.valor ELSE -t.valor END), 0) as saldo_total,
  -- Transações recentes (últimas 5)
  (SELECT COUNT(*) FROM transacao t2 WHERE t2.user_id = u.id AND t2.data >= CURRENT_DATE - INTERVAL '7 dias') as transacoes_semana
FROM usuario u
LEFT JOIN transacao t ON u.id = t.user_id AND t.deleted_at IS NULL
GROUP BY u.id, u.nome;
```

### 7.2 View: Categoria com Totais

```sql
CREATE VIEW v_categoria_total AS
SELECT
  c.id,
  c.nome,
  c.tipo,
  c.user_id,
  -- Total gasto por categoria
  COALESCE(SUM(t.valor), 0) as total_valor,
  -- Quantidade de transações
  COUNT(t.id) as total_transacoes,
  -- Última transação
  MAX(t.data) as ultima_transacao
FROM categoria c
LEFT JOIN transacao t ON c.id = t.categoria_id
  AND t.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.nome, c.tipo, c.user_id;
```

---

## 8. Backup e Recovery

### 8.1 Estratégia de Backup

**Backup Completo (Diário):**
```bash
pg_dump -U postgres -h localhost gestor_financeiro
  --format=custom --compress=9 --verbose
  --file=backup_$(date +%Y%m%d).dump
```

**Backup Incremental (WAL):**
```bash
-- Configurar archival no postgresql.conf
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/wal/%f'
wal_level = replica
```

### 8.2 Rotação de Backup

- **Diários:** Manter 30 dias
- **Semanais:** Manter 12 semanas
- **Mensais:** Manter 12 meses

---

## 9. Migrações

### 9.1 Estrutura de Migrações

**V001__Create_usuario.sql:**
```sql
-- Tabela de perfil do usuário (complementa auth.users)
CREATE TABLE usuario (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(255),
  preferencial_moeda VARCHAR(3) DEFAULT 'BRL',
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_usuario_ativo ON usuario(ativo);

-- Trigger para criar registro em usuario após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuario (id, nome, ativo)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', 'Novo Usuário'), true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**V002__Create_categoria.sql:**
```sql
CREATE TABLE categoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES categoria(id),
  nome VARCHAR(100) NOT NULL,
  -- ... outros campos
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ... índices e constraints
```

---

## 10. Dados de Teste

### 10.1 Script de Seed Data

```sql
-- Usuário de teste
-- Criado automaticamente em auth.users (Supabase Auth)
-- Após signup, o trigger on_auth_user_created insere linha em public.usuario
-- Utilize o id do usuário autenticado na variável :user_id

-- Categorias (já definido em seed data)

-- Transações de exemplo
INSERT INTO transacao (user_id, categoria_id, tipo, valor, descricao, data, source) VALUES
(:user_id, :cat_alimentacao, 'gasto', 45.90, 'Almoço no restaurante', CURRENT_DATE, 'manual'),
(:user_id, :cat_transporte, 'gasto', 15.00, 'Uber - Trabalho', CURRENT_DATE - INTERVAL '1 day', 'manual'),
(:user_id, :cat_salario, 'receita', 3000.00, 'Salário mensal', CURRENT_DATE - INTERVAL '5 days', 'manual');

-- Orçamento exemplo
INSERT INTO orcamento (user_id, categoria_id, nome, valor_limite, periodo, data_inicio, data_fim) VALUES
(:user_id, :cat_alimentacao, 'Alimentação - Novembro', 800.00, 'mensal', DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day');
```

---

## 11. Considerações de Segurança

### 11.1 Dados Sensíveis

- **Autenticação:** Gerenciada pelo Supabase Auth (senhas em vault seguro)
- **Email:** Armazenado em `auth.users` com validação automática
- **Valores:** DECIMAL para precisão monetária
- **Timestamps:** TIMESTAMP WITH TIME ZONE
- **RLS (Row Level Security):** Habilitado para todas as tabelas

### 11.2 Validações

```sql
-- Prevenir valores negativos em transações
ALTER TABLE transacao ADD CONSTRAINT chk_valor_positivo
CHECK (valor > 0);

-- Validar datas
ALTER TABLE previsao ADD CONSTRAINT chk_periodo_valido
CHECK (data_fim >= data_inicio);

-- Validar enum values
ALTER TABLE categoria ADD CONSTRAINT chk_tipo_valido
CHECK (tipo IN ('gasto', 'receita', 'ambos'));
```

---

## 12. Versionamento

**Versão do Schema:** 1.0
**Data de Criação:** 27/11/2025
**Responsável:** Israel
**Status:** ✅ Pronto para Implementação

**Histórico de Versões:**
- v1.0 (27/11/2025): Schema inicial completo

---

**Próximos Passos:**
1. [ ] Revisar e aprovar DER
2. [ ] Executar migrações no PostgreSQL
3. [ ] Implementar seed data
4. [ ] Testar queries e performance
5. [ ] Configurar backup automático
6. [ ] Documentar procedures e functions

---

*Este DER serve como base para implementação do banco de dados no projeto Gestor Financeiro BMAD.*

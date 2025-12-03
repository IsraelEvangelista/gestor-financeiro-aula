-- ============================================================================
-- MIGRAÇÃO COMPLETA - GESTOR FINANCEIRO VIBE CODING
-- Supabase (PostgreSQL 15+)
-- Data: 29/11/2025
-- ============================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- para gen_random_uuid()

-- ============================================================================
-- 1. TABELA: USUARIO (Perfil complementar ao auth.users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.usuario (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(255),
  preferencial_data DATE,
  preferencial_moeda VARCHAR(3) DEFAULT 'BRL',
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_usuario_ativo ON public.usuario(ativo);

COMMENT ON TABLE public.usuario IS 'Perfil e preferências do usuário (complementa auth.users)';

-- Trigger: Criar perfil automaticamente ao fazer signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuario (id, nome, ativo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Novo Usuário'),
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies
ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.usuario FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.usuario FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- 2. TABELA: CATEGORIA
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.categoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.usuario(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.categoria(id),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  cor VARCHAR(7),
  icone VARCHAR(50),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('gasto', 'receita', 'ambos')),
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_categoria_user ON public.categoria(user_id);
CREATE INDEX IF NOT EXISTS idx_categoria_parent ON public.categoria(parent_id);
CREATE INDEX IF NOT EXISTS idx_categoria_tipo ON public.categoria(tipo);
CREATE INDEX IF NOT EXISTS idx_categoria_ativo ON public.categoria(ativo);

COMMENT ON TABLE public.categoria IS 'Classificação hierárquica de transações';

-- RLS Policies
ALTER TABLE public.categoria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias categorias"
  ON public.categoria FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias categorias"
  ON public.categoria FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias categorias"
  ON public.categoria FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias categorias"
  ON public.categoria FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 3. TABELA: TRANSACAO
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.transacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.usuario(id) ON DELETE CASCADE,
  categoria_id UUID NOT NULL REFERENCES public.categoria(id) ON DELETE RESTRICT,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('gasto', 'receita')),
  valor DECIMAL(15,2) NOT NULL CHECK (valor > 0),
  descricao VARCHAR(255) NOT NULL,
  data DATE NOT NULL CHECK (data <= CURRENT_DATE),
  hora TIME,
  local VARCHAR(255),
  forma_pagamento VARCHAR(50) CHECK (forma_pagamento IN ('dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'transferencia', 'cheque', 'outros')),
  status VARCHAR(20) DEFAULT 'confirmado' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
  source VARCHAR(20) NOT NULL CHECK (source IN ('manual', 'ocr', 'import')),
  recurring BOOLEAN DEFAULT false,
  recurring_id UUID REFERENCES public.transacao(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT chk_recurring_id_diferente CHECK (recurring_id <> id OR recurring_id IS NULL)
);

CREATE INDEX IF NOT EXISTS idx_transacao_user_data ON public.transacao(user_id, data);
CREATE INDEX IF NOT EXISTS idx_transacao_categoria ON public.transacao(categoria_id);
CREATE INDEX IF NOT EXISTS idx_transacao_tipo ON public.transacao(tipo);
CREATE INDEX IF NOT EXISTS idx_transacao_status ON public.transacao(status);
CREATE INDEX IF NOT EXISTS idx_transacao_source ON public.transacao(source);
CREATE INDEX IF NOT EXISTS idx_transacao_periodo ON public.transacao(user_id, data, deleted_at);

COMMENT ON TABLE public.transacao IS 'Registro de transações financeiras (gastos e receitas)';

-- RLS Policies
ALTER TABLE public.transacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias transações"
  ON public.transacao FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias transações"
  ON public.transacao FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias transações"
  ON public.transacao FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias transações"
  ON public.transacao FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. TABELA: IMAGEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.imagem (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transacao_id UUID NOT NULL REFERENCES public.transacao(id) ON DELETE CASCADE,
  nome_arquivo VARCHAR(255) NOT NULL,
  path_arquivo VARCHAR(500) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  tamanho_bytes BIGINT,
  ocr_status VARCHAR(20) DEFAULT 'pending' CHECK (ocr_status IN ('pending', 'processing', 'completed', 'failed')),
  ocr_confidence DECIMAL(5,2),
  ocr_data JSONB,
  dados_extraidos JSONB,
  processado_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_imagem_transacao ON public.imagem(transacao_id);
CREATE INDEX IF NOT EXISTS idx_imagem_status ON public.imagem(ocr_status);

COMMENT ON TABLE public.imagem IS 'Armazena imagens de recibos/faturas para OCR';

-- RLS Policies (via transacao.user_id)
ALTER TABLE public.imagem ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver imagens de suas transações"
  ON public.imagem FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.transacao
      WHERE transacao.id = imagem.transacao_id
      AND transacao.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem inserir imagens de suas transações"
  ON public.imagem FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.transacao
      WHERE transacao.id = imagem.transacao_id
      AND transacao.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 5. TABELA: PREVISAO
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.previsao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.usuario(id) ON DELETE CASCADE,
  categoria_id UUID NOT NULL REFERENCES public.categoria(id) ON DELETE CASCADE,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL CHECK (data_fim >= data_inicio),
  valor_previsto DECIMAL(15,2) NOT NULL,
  valor_real DECIMAL(15,2),
  confidence_score DECIMAL(5,2),
  algoritmo VARCHAR(20) CHECK (algoritmo IN ('linear', 'logaritmica', 'exponencial')),
  parametros JSONB,
  accuracy DECIMAL(5,2),
  status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'inativa', 'expirada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_previsao_user_periodo ON public.previsao(user_id, data_inicio, data_fim);
CREATE INDEX IF NOT EXISTS idx_previsao_categoria ON public.previsao(categoria_id);

COMMENT ON TABLE public.previsao IS 'Previsões de gastos/receitas baseadas em ML';

-- RLS Policies
ALTER TABLE public.previsao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias previsões"
  ON public.previsao FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias previsões"
  ON public.previsao FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias previsões"
  ON public.previsao FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 6. TABELA: ORCAMENTO
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.orcamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.usuario(id) ON DELETE CASCADE,
  categoria_id UUID NOT NULL REFERENCES public.categoria(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  valor_limite DECIMAL(15,2) NOT NULL,
  valor_gasto DECIMAL(15,2) DEFAULT 0,
  periodo VARCHAR(20) NOT NULL CHECK (periodo IN ('diario', 'semanal', 'mensal', 'anual')),
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL CHECK (data_fim >= data_inicio),
  alertas_ativos BOOLEAN DEFAULT true,
  alertas_enviados INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'excedido', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_orcamento_user_periodo ON public.orcamento(user_id, data_inicio, data_fim);
CREATE INDEX IF NOT EXISTS idx_orcamento_status ON public.orcamento(status);

COMMENT ON TABLE public.orcamento IS 'Limites de gastos por categoria e período';

-- RLS Policies
ALTER TABLE public.orcamento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios orçamentos"
  ON public.orcamento FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios orçamentos"
  ON public.orcamento FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios orçamentos"
  ON public.orcamento FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios orçamentos"
  ON public.orcamento FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 7. TABELA: RELATORIO
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.relatorio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.usuario(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('mensal', 'trimestral', 'anual', 'customizado')),
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'gerando' CHECK (status IN ('gerando', 'completo', 'erro')),
  path_arquivo VARCHAR(500),
  formato VARCHAR(10) CHECK (formato IN ('pdf', 'excel', 'csv')),
  dados JSONB,
  enviado_email BOOLEAN DEFAULT false,
  generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_relatorio_user_tipo ON public.relatorio(user_id, tipo);
CREATE INDEX IF NOT EXISTS idx_relatorio_status ON public.relatorio(status);

COMMENT ON TABLE public.relatorio IS 'Relatórios automatizados gerados pelo sistema';

-- RLS Policies
ALTER TABLE public.relatorio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios relatórios"
  ON public.relatorio FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios relatórios"
  ON public.relatorio FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 8. TABELA: CONFIGURACAO_USUARIO
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.configuracao_usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.usuario(id) ON DELETE CASCADE,
  chave VARCHAR(100) NOT NULL,
  valor TEXT NOT NULL,
  tipo_valor VARCHAR(20) NOT NULL CHECK (tipo_valor IN ('string', 'number', 'boolean', 'json')),
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(user_id, chave)
);

CREATE INDEX IF NOT EXISTS idx_config_user_chave ON public.configuracao_usuario(user_id, chave);

COMMENT ON TABLE public.configuracao_usuario IS 'Configurações customizadas por usuário';

-- RLS Policies
ALTER TABLE public.configuracao_usuario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias configurações"
  ON public.configuracao_usuario FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias configurações"
  ON public.configuracao_usuario FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias configurações"
  ON public.configuracao_usuario FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 9. TRIGGERS: Auto-atualizar updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar em todas as tabelas com updated_at
CREATE TRIGGER trg_usuario_updated_at
  BEFORE UPDATE ON public.usuario
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_categoria_updated_at
  BEFORE UPDATE ON public.categoria
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_transacao_updated_at
  BEFORE UPDATE ON public.transacao
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_imagem_updated_at
  BEFORE UPDATE ON public.imagem
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_previsao_updated_at
  BEFORE UPDATE ON public.previsao
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_orcamento_updated_at
  BEFORE UPDATE ON public.orcamento
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_relatorio_updated_at
  BEFORE UPDATE ON public.relatorio
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_configuracao_updated_at
  BEFORE UPDATE ON public.configuracao_usuario
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 10. TRIGGER: Atualizar valor_gasto no ORCAMENTO
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_orcamento_gasto()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza valor_gasto quando transação é inserida/atualizada
  UPDATE public.orcamento
  SET valor_gasto = (
    SELECT COALESCE(SUM(valor), 0)
    FROM public.transacao
    WHERE categoria_id = NEW.categoria_id
    AND tipo = 'gasto'
    AND data BETWEEN orcamento.data_inicio AND orcamento.data_fim
    AND deleted_at IS NULL
  )
  WHERE categoria_id = NEW.categoria_id
  AND data_inicio <= NEW.data
  AND data_fim >= NEW.data
  AND status IN ('ativo', 'excedido');

  -- Atualiza status se excedeu limite
  UPDATE public.orcamento
  SET status = CASE
    WHEN valor_gasto >= valor_limite THEN 'excedido'
    ELSE 'ativo'
  END
  WHERE categoria_id = NEW.categoria_id
  AND status IN ('ativo', 'excedido');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_orcamento_gasto
  AFTER INSERT OR UPDATE ON public.transacao
  FOR EACH ROW
  EXECUTE FUNCTION public.update_orcamento_gasto();

-- ============================================================================
-- FIM DA MIGRAÇÃO
-- ============================================================================

-- ============================================================================
-- PATCH RLS - CORREÇÕES DE POLÍTICAS
-- Executar APÓS migration_supabase.sql
-- Data: 29/11/2025
-- ============================================================================

-- ============================================================================
-- 1. TABELA: IMAGEM - Adicionar UPDATE e DELETE
-- ============================================================================

CREATE POLICY "Usuários podem atualizar imagens de suas transações"
  ON public.imagem FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.transacao
      WHERE transacao.id = imagem.transacao_id
      AND transacao.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem deletar imagens de suas transações"
  ON public.imagem FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.transacao
      WHERE transacao.id = imagem.transacao_id
      AND transacao.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 2. TABELA: PREVISAO - Adicionar DELETE
-- ============================================================================

CREATE POLICY "Usuários podem deletar suas próprias previsões"
  ON public.previsao FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 3. TABELA: RELATORIO - Adicionar UPDATE e DELETE
-- ============================================================================

CREATE POLICY "Usuários podem atualizar seus próprios relatórios"
  ON public.relatorio FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios relatórios"
  ON public.relatorio FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. TABELA: CONFIGURACAO_USUARIO - Adicionar DELETE
-- ============================================================================

CREATE POLICY "Usuários podem deletar suas próprias configurações"
  ON public.configuracao_usuario FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. MELHORIAS OPCIONAIS (RECOMENDADAS)
-- ============================================================================

-- 5.1. Filtrar registros soft-deleted em SELECT

-- CATEGORIA
DROP POLICY IF EXISTS "Usuários podem ver suas próprias categorias" ON public.categoria;
CREATE POLICY "Usuários podem ver suas próprias categorias"
  ON public.categoria FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- TRANSACAO
DROP POLICY IF EXISTS "Usuários podem ver suas próprias transações" ON public.transacao;
CREATE POLICY "Usuários podem ver suas próprias transações"
  ON public.transacao FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- PREVISAO
DROP POLICY IF EXISTS "Usuários podem ver suas próprias previsões" ON public.previsao;
CREATE POLICY "Usuários podem ver suas próprias previsões"
  ON public.previsao FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- ORCAMENTO  
DROP POLICY IF EXISTS "Usuários podem ver seus próprios orçamentos" ON public.orcamento;
CREATE POLICY "Usuários podem ver seus próprios orçamentos"
  ON public.orcamento FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- USUARIO
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.usuario;
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.usuario FOR SELECT
  USING (auth.uid() = id AND deleted_at IS NULL);

-- 5.2. Validar que categoria pertence ao usuário ao inserir transação

DROP POLICY IF EXISTS "Usuários podem inserir suas próprias transações" ON public.transacao;
CREATE POLICY "Usuários podem inserir suas próprias transações"
  ON public.transacao FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM public.categoria
      WHERE categoria.id = transacao.categoria_id
      AND categoria.user_id = auth.uid()
      AND categoria.deleted_at IS NULL
    )
  );

-- 5.3. Impedir modificação de user_id via UPDATE

-- CATEGORIA
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias categorias" ON public.categoria;
CREATE POLICY "Usuários podem atualizar suas próprias categorias"
  ON public.categoria FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id); -- Garante que user_id não mude

-- TRANSACAO
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias transações" ON public.transacao;
CREATE POLICY "Usuários podem atualizar suas próprias transações"
  ON public.transacao FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- PREVISAO
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias previsões" ON public.previsao;
CREATE POLICY "Usuários podem atualizar suas próprias previsões"
  ON public.previsao FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ORCAMENTO
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios orçamentos" ON public.orcamento;
CREATE POLICY "Usuários podem atualizar seus próprios orçamentos"
  ON public.orcamento FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5.4. Permitir INSERT em 'usuario' pelo service_role (para trigger de signup)
DROP POLICY IF EXISTS "Service role pode inserir usuários" ON public.usuario;
CREATE POLICY "Service role pode inserir usuários"
  ON public.usuario FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- FIM DO PATCH
-- ============================================================================

-- Para verificar todas as políticas criadas:
-- SELECT schemaname, tablename, policyname 
-- FROM pg_policies 
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

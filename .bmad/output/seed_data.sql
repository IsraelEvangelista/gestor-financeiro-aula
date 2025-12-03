-- ============================================================================
-- SEED DATA - CATEGORIAS PADRÃO
-- Executar APÓS criar um usuário via Supabase Auth
-- ============================================================================

-- IMPORTANTE: Substituir :user_id pelo UUID do usuário criado
-- Exemplo: SELECT id FROM auth.users WHERE email = 'seu@email.com';

-- ============================================================================
-- CATEGORIAS DE GASTOS
-- ============================================================================

INSERT INTO public.categoria (user_id, nome, tipo, cor, icone, ordem) VALUES
(:user_id, 'Alimentação', 'gasto', '#3b82f6', 'restaurant', 1),
(:user_id, 'Transporte', 'gasto', '#10b981', 'directions_car', 2),
(:user_id, 'Moradia', 'gasto', '#ec4899', 'home', 3),
(:user_id, 'Saúde', 'gasto', '#f59e0b', 'local_hospital', 4),
(:user_id, 'Educação', 'gasto', '#8b5cf6', 'school', 5),
(:user_id, 'Lazer', 'gasto', '#f97316', 'sports_esports', 6),
(:user_id, 'Outros', 'gasto', '#64748b', 'category', 7);

-- ============================================================================
-- CATEGORIAS DE RECEITAS
-- ============================================================================

INSERT INTO public.categoria (user_id, nome, tipo, cor, icone, ordem) VALUES
(:user_id, 'Salário', 'receita', '#10b981', 'work', 1),
(:user_id, 'Freelance', 'receita', '#3b82f6', 'laptop_mac', 2),
(:user_id, 'Investimentos', 'receita', '#f59e0b', 'trending_up', 3),
(:user_id, 'Outros', 'receita', '#64748b', 'attach_money', 4);

-- ============================================================================
-- TRANSAÇÕES DE EXEMPLO (OPCIONAL)
-- ============================================================================

-- Descomentar para inserir transações de demonstração
/*
INSERT INTO public.transacao (user_id, categoria_id, tipo, valor, descricao, data, source) VALUES
(
  :user_id,
  (SELECT id FROM public.categoria WHERE nome = 'Alimentação' AND user_id = :user_id LIMIT 1),
  'gasto',
  45.90,
  'Almoço no restaurante',
  CURRENT_DATE,
  'manual'
),
(
  :user_id,
  (SELECT id FROM public.categoria WHERE nome = 'Transporte' AND user_id = :user_id LIMIT 1),
  'gasto',
  15.00,
  'Uber - Trabalho',
  CURRENT_DATE - INTERVAL '1 day',
  'manual'
),
(
  :user_id,
  (SELECT id FROM public.categoria WHERE nome = 'Salário' AND user_id = :user_id LIMIT 1),
  'receita',
  3000.00,
  'Salário mensal',
  DATE_TRUNC('month', CURRENT_DATE)::date,
  'manual'
);
*/

-- ============================================================================
-- FIM DO SEED DATA
-- ============================================================================

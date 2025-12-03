-- ============================================================================
-- DIAGNÓSTICO - PROBLEMAS DE LOGIN
-- Execute no SQL Editor do Supabase para investigar
-- ============================================================================

-- 1. Verificar se trigger está funcionando
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- 2. Verificar se function existe
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 3. Listar todos os usuários em auth.users
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 4. Verificar se registros foram criados em 'usuario'
SELECT 
  u.id,
  u.nome,
  u.ativo,
  u.created_at,
  au.email,
  au.email_confirmed_at
FROM public.usuario u
LEFT JOIN auth.users au ON au.id = u.id
ORDER BY u.created_at DESC;

-- 5. Verificar políticas RLS ativas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'usuario'
ORDER BY tablename, policyname;

-- 6. Testar RLS manualmente (execute como usuário autenticado)
-- Substitua 'USER_ID_AQUI' pelo ID do usuário que está tentando logar
SET SESSION "request.jwt.claim.sub" = 'USER_ID_AQUI';
SELECT * FROM public.usuario WHERE id = 'USER_ID_AQUI';

-- ============================================================================
-- CORREÇÕES POSSÍVEIS
-- ============================================================================

-- CORREÇÃO 1: Recriar trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuario (id, nome, ativo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Novo Usuário'),
    true -- Usuário ativo por padrão
  )
  ON CONFLICT (id) DO NOTHING; -- Evitar erro se já existir
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- CORREÇÃO 2: Desabilitar confirmação de email (APENAS PARA DESENVOLVIMENTO)
-- ATENÇÃO: Não use em produção!
-- Vá em: Authentication > Email > Confirm email = DESABILITADO

-- CORREÇÃO 3: Criar registro manualmente para usuário existente
-- Substitua os valores abaixo
INSERT INTO public.usuario (id, nome, ativo)
VALUES (
  'USER_ID_DO_AUTH_USERS',
  'Nome do Usuário',
  true
)
ON CONFLICT (id) DO UPDATE SET ativo = true;

-- CORREÇÃO 4: Verificar e ajustar política de INSERT em 'usuario'
-- Permitir que service role insira registros
DROP POLICY IF EXISTS "Service role pode inserir usuários" ON public.usuario;
CREATE POLICY "Service role pode inserir usuários"
  ON public.usuario FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- FIM DO DIAGNÓSTICO
-- ============================================================================

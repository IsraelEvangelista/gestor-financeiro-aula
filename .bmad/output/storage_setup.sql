-- ============================================================================
-- SETUP STORAGE - AVATARS
-- Executar no SQL Editor do Supabase
-- ============================================================================

-- 1. Criar bucket 'avatars' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Remover políticas antigas para evitar conflitos
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- 3. Criar políticas de acesso (RLS)

-- Leitura pública (necessário para exibir avatares na UI)
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- Upload apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Atualização apenas pelo dono do objeto
CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.uid() = owner )
  WITH CHECK ( bucket_id = 'avatars' AND auth.uid() = owner );

-- Deleção apenas pelo dono do objeto
CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'avatars' AND auth.uid() = owner );

-- 4. Criar bucket 'receipts' (privado) para recibos de transações
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

-- 5. Políticas de acesso para 'receipts'

-- Seleção apenas pelo dono do objeto
CREATE POLICY "Users can read own receipts"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'receipts' AND auth.uid() = owner );

-- Upload apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload receipts"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'receipts' AND auth.role() = 'authenticated' AND auth.uid() = owner );

-- Atualização apenas pelo dono do objeto
CREATE POLICY "Users can update own receipts"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'receipts' AND auth.uid() = owner )
  WITH CHECK ( bucket_id = 'receipts' AND auth.uid() = owner );

-- Deleção apenas pelo dono do objeto
CREATE POLICY "Users can delete own receipts"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'receipts' AND auth.uid() = owner );

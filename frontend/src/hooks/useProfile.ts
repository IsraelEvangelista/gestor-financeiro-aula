import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  nome: string;
  email: string; // Vem de auth.users
  avatar_url: string | null;
  ativo: boolean;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile({
        ...data,
        email: user.email || '',
      });
    } catch (err: any) {
      console.error('Erro ao buscar perfil:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('usuario')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Atualizar estado local
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      console.log('[uploadAvatar] Iniciando upload...');
      
      // Usar getSession() em vez de getUser() para obter sessão do localStorage
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      console.log('[uploadAvatar] Session check:', { 
        hasSession: !!session, 
        userId: session?.user?.id,
        authError: authError?.message 
      });
      
      if (authError) {
        console.error('[uploadAvatar] Erro de autenticação:', authError);
        throw new Error(`Erro de autenticação: ${authError.message}`);
      }
      
      if (!session || !session.user) {
        console.error('[uploadAvatar] Sessão não encontrada');
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }

      const user = session.user;
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('[uploadAvatar] Fazendo upload para:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('[uploadAvatar] Erro no upload:', uploadError);
        throw uploadError;
      }

      console.log('[uploadAvatar] Upload concluído, obtendo URL pública...');

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('[uploadAvatar] URL pública:', publicUrl);

      await updateProfile({ avatar_url: publicUrl });

      console.log('[uploadAvatar] Perfil atualizado com sucesso');

      return { publicUrl, error: null };
    } catch (err: any) {
      console.error('[uploadAvatar] Erro geral:', err);
      return { publicUrl: null, error: err.message };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refreshProfile: fetchProfile,
    updateProfile,
    uploadAvatar
  };
}

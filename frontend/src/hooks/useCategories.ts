import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Category {
  id: string;
  nome: string;
  tipo: 'receita' | 'despesa' | 'ambos';
  cor: string;
  icone: string | null;
}

export interface CreateCategoryInput {
  nome: string;
  tipo: 'receita' | 'despesa' | 'ambos';
  cor: string;
  icone?: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: fetchError } = await supabase
        .from('categoria')
        .select('*')
        .eq('user_id', user.id)
        .order('nome', { ascending: true });

      if (fetchError) throw fetchError;

      setCategories(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (input: CreateCategoryInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error: insertError } = await supabase
        .from('categoria')
        .insert({
          ...input,
          user_id: user.id
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Atualizar lista local
      setCategories(prev => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)));
      
      return { error: null };
    } catch (err) {
      const error = err as Error;
      return { error: error.message };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('categoria')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Atualizar lista local
      setCategories(prev => prev.filter(c => c.id !== id));
      
      return { error: null };
    } catch (err) {
      const error = err as Error;
      return { error: error.message };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { 
    categories, 
    loading, 
    error, 
    createCategory,
    deleteCategory,
    refreshCategories: fetchCategories
  };
}

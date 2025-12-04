import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface TransactionDB {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  data: string;
  categoria_id: string;
  categoria?: {
    nome: string;
    cor: string;
  };
}

export interface CreateTransactionInput {
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  data: string;
  categoria_id: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: fetchError } = await supabase
        .from('transacao')
        .select(`
          id,
          descricao,
          valor,
          tipo,
          data,
          categoria_id,
          categoria ( nome, cor )
        `)
        .eq('user_id', user.id)
        .order('data', { ascending: false });

      if (fetchError) throw fetchError;

      const normalized = (data || []).map((t: any) => ({
        ...t,
        tipo: t.tipo === 'gasto' ? 'despesa' : t.tipo
      })) as unknown as TransactionDB[];
      setTransactions(normalized);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (input: CreateTransactionInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error: insertError } = await supabase
        .from('transacao')
        .insert({
          ...input,
          tipo: input.tipo === 'despesa' ? 'gasto' : 'receita',
          user_id: user.id,
          source: 'manual'
        })
        .select(`
          id,
          descricao,
          valor,
          tipo,
          data,
          categoria_id,
          categoria ( nome, cor )
        `)
        .single();

      if (insertError) throw insertError;

      // Atualizar lista local
      setTransactions(prev => [data as unknown as TransactionDB, ...prev]);
      
      return { error: null };
    } catch (err) {
      const error = err as Error;
      return { error: error.message };
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('transacao')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Atualizar lista local
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      return { error: null };
    } catch (err) {
      const error = err as Error;
      return { error: error.message };
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    createTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions
  };
}

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { startOfMonth, endOfMonth } from 'date-fns';

export interface Transaction {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: { nome: string; cor: string } | null;
  data: string;
}

export interface DashboardMetrics {
  saldoTotal: number;
  receitasMes: number;
  despesasMes: number;
  recentTransactions: Transaction[];
  monthlyTransactions: Transaction[];
}

export function useDashboardData() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    saldoTotal: 0,
    receitasMes: 0,
    despesasMes: 0,
    recentTransactions: [],
    monthlyTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const start = startOfMonth(now).toISOString();
      const end = endOfMonth(now).toISOString();

      // 1. Buscar todas as transações para cálculo de saldo total (simplificado)
      // Idealmente, o saldo seria calculado no banco ou mantido em uma tabela de saldos
      // Aqui vamos buscar todas as transações do usuário para somar
      const { data: allTransactions, error: allTransError } = await supabase
        .from('transacao')
        .select('valor, tipo')
        .eq('user_id', user.id);

      if (allTransError) throw allTransError;

      const saldoTotal = allTransactions?.reduce((acc, curr) => {
        return curr.tipo === 'receita' ? acc + Number(curr.valor) : acc - Number(curr.valor);
      }, 0) || 0;

      // 2. Buscar transações do mês atual para gráficos e métricas mensais
      const { data: monthTransactionsRaw, error: monthTransError } = await supabase
        .from('transacao')
        .select(`
          id,
          descricao,
          valor,
          tipo,
          data,
          categoria ( nome, cor )
        `)
        .eq('user_id', user.id)
        .gte('data', start)
        .lte('data', end)
        .order('data', { ascending: true });

      if (monthTransError) throw monthTransError;

      const monthTransactions = (monthTransactionsRaw || []).map((t: any) => ({
        ...t,
        tipo: t.tipo === 'gasto' ? 'despesa' : t.tipo
      }));

      const receitasMes = monthTransactions?.reduce((acc, curr) => {
        return curr.tipo === 'receita' ? acc + Number(curr.valor) : acc;
      }, 0) || 0;

      const despesasMes = monthTransactions?.reduce((acc, curr) => {
        return curr.tipo === 'despesa' ? acc + Number(curr.valor) : acc;
      }, 0) || 0;

      // 3. Buscar transações recentes (últimas 5)
      const { data: recentTransactionsRaw, error: recentTransError } = await supabase
        .from('transacao')
        .select(`
          id,
          descricao,
          valor,
          tipo,
          data,
          categoria ( nome, cor )
        `)
        .eq('user_id', user.id)
        .order('data', { ascending: false })
        .limit(5);

      if (recentTransError) throw recentTransError;

      const recentTransactions = (recentTransactionsRaw || []).map((t: any) => ({
        ...t,
        tipo: t.tipo === 'gasto' ? 'despesa' : t.tipo
      }));

      setMetrics({
        saldoTotal,
        receitasMes,
        despesasMes,
        recentTransactions: recentTransactions as any[], // Casting necessário devido à tipagem do join
        monthlyTransactions: monthTransactions as any[]
      });

    } catch (err: any) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { metrics, loading, error, refresh: fetchDashboardData };
}

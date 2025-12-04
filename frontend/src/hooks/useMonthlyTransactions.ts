import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { startOfMonth, endOfMonth } from 'date-fns'
import type { Transaction } from '@/hooks/useDashboardData'

export function useMonthlyTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setTransactions([])
        return
      }
      const now = new Date()
      const start = startOfMonth(now).toISOString()
      const end = endOfMonth(now).toISOString()
      const { data, error } = await supabase
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
        .order('data', { ascending: true })
      if (error) throw error
      const normalized = (data || []).map((t: any) => ({
        ...t,
        tipo: t.tipo === 'gasto' ? 'despesa' : t.tipo
      }))
      setTransactions(normalized as any)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return { transactions, loading, error, refresh: fetchTransactions }
}

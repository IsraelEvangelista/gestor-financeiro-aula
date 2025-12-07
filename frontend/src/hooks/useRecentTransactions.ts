import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Transaction } from '@/hooks/useDashboardData'

export function useRecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecent = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setTransactions([])
        return
      }
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
        .order('data', { ascending: false })
        .limit(5)
      if (error) throw error
      
      const normalizedData = (data || []).map((t: any) => ({
        ...t,
        tipo: t.tipo === 'gasto' ? 'despesa' : t.tipo
      }))
      
      setTransactions(normalizedData as any)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecent()
  }, [])

  return { transactions, loading, error, refresh: fetchRecent }
}


import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useSaldoTotal() {
  const [saldoTotal, setSaldoTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSaldo = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setSaldoTotal(0)
        return
      }
      const { data, error } = await supabase
        .from('transacao')
        .select('valor, tipo')
        .eq('user_id', user.id)
      if (error) throw error
      const total = (data || []).reduce((acc: number, curr: any) => {
        return curr.tipo === 'receita' ? acc + Number(curr.valor) : acc - Number(curr.valor)
      }, 0)
      setSaldoTotal(total)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSaldo()
  }, [])

  return { saldoTotal, loading, error, refresh: fetchSaldo }
}


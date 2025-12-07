import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { startOfMonth, endOfMonth, isSameMonth, parseISO, setYear, setMonth, getMonth, getYear } from 'date-fns';

export interface Transaction {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: { nome: string; cor: string } | null;
  data: string;
  user_id: string;
}

// Block Filters (from FilterBlock UI)
interface BlockFilters {
  months: number[]; // Array of month indexes (0-11)
  tipos: ('receita' | 'despesa')[];
  categorias: string[];
}

// Chart Filters (from clicking on charts)
interface ChartFilters {
  month: Date | null;
  categoria: string | null;
}

interface DashboardContextType {
  transactions: Transaction[];
  isLoading: boolean;
  
  // Year Selection (Controls Fetch)
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  
  // Block Filters
  blockFilters: BlockFilters;
  toggleBlockMonth: (monthIndex: number) => void;
  setBlockMonths: (months: number[]) => void;
  toggleBlockTipo: (tipo: 'receita' | 'despesa') => void;
  toggleBlockCategoria: (categoria: string) => void;
  
  // Chart Filters
  chartFilters: ChartFilters;
  toggleChartMonth: (date: Date) => void;
  toggleChartCategory: (category: string) => void;
  
  resetAllFilters: () => void;
  
  // Available options
  availableCategories: { nome: string; tipo: 'receita' | 'despesa' }[];
  
  // Computed Data
  filteredTransactions: Transaction[];
  monthData: Transaction[];
  overviewData: Transaction[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Year Selection
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // Block Filters State
  const [blockFilters, setBlockFilters] = useState<BlockFilters>({
    months: [], // Empty means "All months"
    tipos: ['receita', 'despesa'], 
    categorias: []
  });
  
  // Chart Filters State
  const [chartFilters, setChartFilters] = useState<ChartFilters>({
    month: null,
    categoria: null
  });

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Query full year: Jan 1 to Dec 31 of selectedYear
      const start = new Date(selectedYear, 0, 1).toISOString();
      const end = new Date(selectedYear, 11, 31, 23, 59, 59).toISOString();

      const { data, error } = await supabase
        .from('transacao')
        .select(`
          id,
          descricao,
          valor,
          tipo,
          data,
          user_id,
          categoria ( nome, cor )
        `)
        .eq('user_id', user.id)
        .gte('data', start)
        .lte('data', end)
        .order('data', { ascending: false });

      if (error) throw error;

      const normalized = (data || []).map((t: any) => ({
        ...t,
        tipo: t.tipo === 'gasto' ? 'despesa' : t.tipo
      }));

      setTransactions(normalized);
    } catch (error: unknown) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch when year changes
  useEffect(() => {
    fetchTransactions();
    // Reset filters when year changes? Maybe keep types/categories but reset month
    setBlockFilters(prev => ({ ...prev, months: [] })); 
    setChartFilters({ month: null, categoria: null });
  }, [selectedYear]);

  // Block Filter Actions
  const toggleBlockMonth = useCallback((monthIndex: number) => {
    setBlockFilters(prev => {
      const months = prev.months.includes(monthIndex)
        ? prev.months.filter(m => m !== monthIndex)
        : [...prev.months, monthIndex];
      return { ...prev, months };
    });
  }, []);

  const setBlockMonths = useCallback((months: number[]) => {
    setBlockFilters(prev => ({ ...prev, months }));
  }, []);

  const toggleBlockTipo = useCallback((tipo: 'receita' | 'despesa') => {
    setBlockFilters(prev => {
      const tipos = prev.tipos.includes(tipo)
        ? prev.tipos.filter(t => t !== tipo)
        : [...prev.tipos, tipo];
      return { ...prev, tipos: tipos.length > 0 ? tipos : [tipo] };
    });
  }, []);

  const toggleBlockCategoria = useCallback((categoria: string) => {
    setBlockFilters(prev => {
      const categorias = prev.categorias.includes(categoria)
        ? prev.categorias.filter(c => c !== categoria)
        : [...prev.categorias, categoria];
      return { ...prev, categorias };
    });
  }, []);

  // Chart Filter Actions
  const toggleChartMonth = useCallback((date: Date) => {
    setChartFilters(prev => ({
      ...prev,
      month: prev.month && isSameMonth(prev.month, date) ? null : date
    }));
  }, []);

  const toggleChartCategory = useCallback((category: string) => {
    setChartFilters(prev => ({
      ...prev,
      categoria: prev.categoria === category ? null : category
    }));
  }, []);

  const resetAllFilters = useCallback(() => {
    setBlockFilters({ months: [], tipos: ['receita', 'despesa'], categorias: [] });
    setChartFilters({ month: null, categoria: null });
  }, []);

  const availableCategories = useMemo(() => {
    const catMap = new Map<string, 'receita' | 'despesa'>();
    transactions.forEach(t => {
      if (t.categoria?.nome && !catMap.has(t.categoria.nome)) {
        catMap.set(t.categoria.nome, t.tipo);
      }
    });
    return Array.from(catMap.entries()).map(([nome, tipo]) => ({ nome, tipo }));
  }, [transactions]);

  // --- Computed Data Logic ---

  // Helper: check if a transaction matches active filters
  const matchesFilters = (t: Transaction, ignoreType = false, ignoreCategory = false, ignoreMonth = false) => {
    const tDate = parseISO(t.data);
    const tMonth = getMonth(tDate);
    
    // 1. Year (Already filtered by fetch, but good for safety)
    if (getYear(tDate) !== selectedYear) return false;

    // 2. Month Filter
    // Logic: Block Months (multi) OR Chart Month (single). Chart takes priority if set.
    // If NO filter set, show ALL (return true).
    if (!ignoreMonth) {
      if (chartFilters.month) {
        if (!isSameMonth(tDate, chartFilters.month)) return false;
      } else if (blockFilters.months.length > 0) {
        if (!blockFilters.months.includes(tMonth)) return false;
      }
    }

    // 3. Type Filter
    if (!ignoreType) {
      if (!blockFilters.tipos.includes(t.tipo)) return false;
    }

    // 4. Category Filter
    if (!ignoreCategory) {
      const activeCategories = [...blockFilters.categorias];
      if (chartFilters.categoria && !activeCategories.includes(chartFilters.categoria)) {
        activeCategories.push(chartFilters.categoria);
      }
      if (activeCategories.length > 0) {
        if (!t.categoria || !activeCategories.includes(t.categoria.nome)) return false;
      }
    }

    return true;
  };

  const overviewData = useMemo(() => {
    // Overview Line Chart:
    // - Shows ALL months of the selected year (so we ignore month filter for the X-axis structure, 
    //   but individual data points should reflect filters? No, usually overview shows trend filtered by cat/type).
    // - Respects Type and Category filters.
    // - Does NOT respect Month filter (otherwise line chart becomes a dot).
    return transactions.filter(t => matchesFilters(t, false, false, true));
  }, [transactions, selectedYear, blockFilters.tipos, blockFilters.categorias, chartFilters.categoria]);

  const monthData = useMemo(() => {
    // Cards & Pie Chart:
    // - Respects ALL filters (Month, Type, Category)
    // - If NO month filter is active, default to current month (or all months? User said "Last 12 months" before, now separate).
    // - IF Block Month is empty AND Chart Month is null -> Show data for ALL months of selected year?
    //   OR show data for current month?
    //   Let's decide: If no month filter, show aggregator for the WHOLE year.
    return transactions.filter(t => matchesFilters(t, false, false, false));
  }, [transactions, selectedYear, blockFilters, chartFilters]);

  const filteredTransactions = useMemo(() => {
    // Transaction List:
    // - Respects ALL filters.
    return transactions.filter(t => matchesFilters(t, false, false, false));
  }, [transactions, selectedYear, blockFilters, chartFilters]);

  return (
    <DashboardContext.Provider value={{
      transactions,
      isLoading,
      selectedYear,
      setSelectedYear,
      blockFilters,
      toggleBlockMonth,
      setBlockMonths,
      toggleBlockTipo,
      toggleBlockCategoria,
      chartFilters,
      toggleChartMonth,
      toggleChartCategory,
      resetAllFilters,
      availableCategories,
      filteredTransactions,
      monthData,
      overviewData
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

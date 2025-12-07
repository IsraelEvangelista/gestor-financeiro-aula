import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CreditCard, Loader2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { OverviewChart } from "./OverviewChart";
import { CategoryChart } from "./CategoryChart";
import { FilterBlock } from "./FilterBlock";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function DashboardContent() {
  const { 
    monthData, 
    filteredTransactions, 
    isLoading,
    blockFilters,
    chartFilters
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calculate metrics from monthData (which respects Month Filter or Current Month)
  const saldoTotal = monthData.reduce((acc, curr) => curr.tipo === 'receita' ? acc + Number(curr.valor) : acc - Number(curr.valor), 0);
  const receitasMes = monthData.reduce((acc, curr) => curr.tipo === 'receita' ? acc + Number(curr.valor) : acc, 0);
  const despesasMes = monthData.reduce((acc, curr) => curr.tipo === 'despesa' ? acc + Number(curr.valor) : acc, 0);

  // Month Label for cards (chart filter takes priority)
  const selectedMonth = chartFilters.month || blockFilters.month;
  const monthLabel = selectedMonth 
    ? format(selectedMonth, "MMMM", { locale: ptBR })
    : 'Mês Atual';


  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Filter Block */}
      <FilterBlock />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo ({monthLabel})</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldoTotal < 0 ? 'text-destructive' : ''}`}>{formatCurrency(saldoTotal)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              Balanço do periodo selecionado
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas ({monthLabel})</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(receitasMes)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              </span>
              Entradas no período
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas ({monthLabel})</CardTitle>
            <CreditCard className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(despesasMes)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-destructive flex items-center mr-1">
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              </span>
              Saídas no período
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-5">
        <OverviewChart />
        <CategoryChart />
      </div>

      {/* Transactions List */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        Transações
                        <TooltipProvider>
                            <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Exibindo dados baseados nos filtros selecionados nos gráficos.</p>
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardTitle>
                    <CardDescription>
                        {filteredTransactions.length} registros encontrados no filtro atual
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredTransactions.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">Nenhuma transação encontrada para este período.</p>
                    ) : (
                      filteredTransactions.map((t) => (
                        <div key={t.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                              <div className="flex items-center gap-4">
                                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${t.tipo === 'despesa' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                      {t.tipo === 'despesa' ? <CreditCard size={20} /> : <DollarSign size={20} />}
                                  </div>
                                  <div>
                                      <p className="font-medium">{t.descricao}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {t.categoria?.nome || 'Sem Categoria'} • {format(new Date(t.data), "dd/MM 'às' HH:mm")}
                                      </p>
                                  </div>
                              </div>
                              <div className={`font-bold ${t.tipo === 'despesa' ? "text-destructive" : "text-primary"}`}>
                                  {t.tipo === 'despesa' ? "- " : "+ "}{formatCurrency(Number(t.valor))}
                              </div>
                          </div>
                      ))
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CreditCard, Filter, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewChart } from "./OverviewChart";
import { CategoryChart } from "./CategoryChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DashboardPage() {
  const { metrics, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-destructive">
        Erro ao carregar dados: {error}
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/30 p-4 rounded-lg backdrop-blur-sm border border-border/50">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Visão Geral
        </h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
           <p className="text-sm text-muted-foreground">
             Dados de {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
           </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.saldoTotal)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              Saldo acumulado atual
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas (Mês)</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.receitasMes)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              </span>
              Entradas este mês
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas (Mês)</CardTitle>
            <CreditCard className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.despesasMes)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-destructive flex items-center mr-1">
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              </span>
              Saídas este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-5">
        <OverviewChart transactions={metrics.monthlyTransactions} />
        <CategoryChart transactions={metrics.monthlyTransactions} />
      </div>

      {/* Recent Transactions */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {metrics.recentTransactions.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">Nenhuma transação recente.</p>
                    ) : (
                      metrics.recentTransactions.map((t) => (
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

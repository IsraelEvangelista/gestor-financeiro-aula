import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction } from "@/hooks/useDashboardData";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OverviewChartProps {
  transactions: Transaction[];
}

export function OverviewChart({ transactions }: OverviewChartProps) {
  const data = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayTransactions = transactions.filter(t => isSameDay(parseISO(t.data), day));
      const income = dayTransactions
        .filter(t => t.tipo === 'receita')
        .reduce((acc, curr) => acc + Number(curr.valor), 0);
      const expense = dayTransactions
        .filter(t => t.tipo === 'despesa')
        .reduce((acc, curr) => acc + Number(curr.valor), 0);

      return {
        name: format(day, 'dd'),
        fullDate: format(day, "d 'de' MMMM", { locale: ptBR }),
        income,
        expense
      };
    });
  }, [transactions]);

  return (
    <Card className="col-span-4 lg:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Visão Geral</CardTitle>
        <CardDescription>Receitas vs Despesas nos últimos 7 meses</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="var(--destructive)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

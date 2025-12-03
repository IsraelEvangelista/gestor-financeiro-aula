import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryStyle } from "@/config/categories";
import type { Transaction } from "@/hooks/useDashboardData";

interface CategoryChartProps {
  transactions: Transaction[];
}

export function CategoryChart({ transactions }: CategoryChartProps) {
  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.tipo === 'despesa');
    
    // Agrupar por categoria
    const grouped = expenses.reduce((acc, curr) => {
      const catName = curr.categoria?.nome || 'Outros';
      if (!acc[catName]) {
        acc[catName] = 0;
      }
      acc[catName] += Number(curr.valor);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Ordenar por valor decrescente
  }, [transactions]);

  return (
    <Card className="col-span-4 lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Por Categoria</CardTitle>
        <CardDescription>Distribuição de gastos este mês</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCategoryStyle(entry.name).color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

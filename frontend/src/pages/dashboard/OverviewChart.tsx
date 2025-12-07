import { useMemo, useCallback, useEffect, useRef } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/contexts/DashboardContext";
import { format, isSameMonth, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const balance = data.income - data.expense;

    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
        <p className="font-bold text-foreground mb-2 capitalize">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-muted-foreground">Receita:</span>
            <span className="text-sm font-medium text-emerald-500 ml-auto">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.income)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-sm text-muted-foreground">Despesa:</span>
            <span className="text-sm font-medium text-red-500 ml-auto">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.expense)}
            </span>
          </div>
          <div className="border-t border-border my-1" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">Saldo:</span>
            <span className={`text-sm font-medium ml-auto ${balance >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function OverviewChart() {
  const { overviewData, chartFilters, toggleChartMonth, selectedYear } = useDashboard();
  const chartRef = useRef<HTMLDivElement>(null);
  
  const selectedMonth = chartFilters.month;

  const chartData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(selectedYear, i, 1));

    return months.map(month => {
      const monthTransactions = overviewData.filter(t => isSameMonth(parseISO(t.data), month));
  
      const income = monthTransactions
        .filter(t => t.tipo === 'receita')
        .reduce((acc, curr) => acc + Number(curr.valor), 0);
        
      const expense = monthTransactions
        .filter(t => t.tipo === 'despesa')
        .reduce((acc, curr) => acc + Number(curr.valor), 0);

      const monthKey = format(month, 'MMM', { locale: ptBR });
      const isSelected = selectedMonth ? isSameMonth(month, selectedMonth) : false;

      return {
        name: monthKey,
        fullName: format(month, "MMMM 'de' yyyy", { locale: ptBR }),
        monthDate: month.toISOString(),
        income,
        expense,
        isSelected
      };
    });
  }, [overviewData, selectedYear, selectedMonth]);

  const handleMonthClick = useCallback((monthName: string) => {
    const dataPoint = chartData.find(d => d.name.toLowerCase() === monthName.toLowerCase());
    if (dataPoint && dataPoint.monthDate) {
      toggleChartMonth(new Date(dataPoint.monthDate));
    }
  }, [chartData, toggleChartMonth]);

  // Add click listeners to X-axis labels after chart renders
  useEffect(() => {
    if (!chartRef.current) return;

    const xAxisLabels = chartRef.current.querySelectorAll('.recharts-xAxis .recharts-cartesian-axis-tick text');
    
    const handleLabelClick = (e: Event) => {
      const target = e.target as SVGTextElement;
      const monthText = target.textContent;
      if (monthText) {
        handleMonthClick(monthText);
      }
    };

    // Add event listeners and styles
    xAxisLabels.forEach((label) => {
      const textElement = label as SVGTextElement;
      textElement.style.cursor = 'pointer';
      textElement.style.userSelect = 'none';
      textElement.addEventListener('click', handleLabelClick);
      
      // Add hover effect
      textElement.addEventListener('mouseenter', () => {
        textElement.style.fontWeight = 'bold';
        textElement.style.fill = 'hsl(var(--primary))';
      });
      textElement.addEventListener('mouseleave', () => {
        textElement.style.fontWeight = 'normal';
        textElement.style.fill = '#888888';
      });
    });

    // Cleanup
    return () => {
      xAxisLabels.forEach((label) => {
        const textElement = label as SVGTextElement;
        textElement.removeEventListener('click', handleLabelClick);
      });
    };
  }, [chartData, handleMonthClick]);

  return (
    <Card className={`col-span-4 lg:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 ${selectedMonth ? 'ring-2 ring-primary border-primary' : ''}`}>
      <CardHeader>
        <CardTitle>
          Visão Geral ({selectedYear})
          {selectedMonth && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              (Filtro: {format(selectedMonth, 'MMMM', { locale: ptBR })})
            </span>
          )}
        </CardTitle>
        <CardDescription>Clique nos meses do eixo X para filtrar</CardDescription>
      </CardHeader>
      <CardContent className="pl-2" ref={chartRef}>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }} 
            />
            
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#10B981" }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#EF4444" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#EF4444" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

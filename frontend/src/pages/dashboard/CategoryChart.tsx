import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryStyle } from "@/config/categories";
import { useDashboard } from "@/contexts/DashboardContext";

export function CategoryChart() {
  const { monthData, chartFilters, toggleChartCategory, blockFilters } = useDashboard();
  
  // Selected category from chart click
  const selectedCategory = chartFilters.categoria;

  const data = useMemo(() => {
    const expenses = monthData.filter(t => t.tipo === 'despesa');
    
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
      .sort((a, b) => b.value - a.value); 
  }, [monthData]);

  const handlePieClick = (data: any) => {
    if (data && data.name) {
      toggleChartCategory(data.name);
    }
  };

  // Check if any category filter is active (from block or chart)
  const hasActiveFilter = selectedCategory || blockFilters.categorias.length > 0;
  const allActiveCategories = [...blockFilters.categorias];
  if (selectedCategory && !allActiveCategories.includes(selectedCategory)) {
    allActiveCategories.push(selectedCategory);
  }

  return (
    <Card className={`col-span-4 lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 ${hasActiveFilter ? 'ring-2 ring-primary border-primary' : ''}`}>
      <CardHeader>
        <CardTitle>
          Por Categoria 
          {selectedCategory && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              (Filtro: {selectedCategory})
            </span>
          )}
        </CardTitle>
        <CardDescription>Clique para filtrar por categoria</CardDescription>
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
              onClick={handlePieClick} 
              cursor="pointer"
            >
              {data.map((entry, index) => {
                const isInActiveFilter = allActiveCategories.length === 0 || allActiveCategories.includes(entry.name);
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getCategoryStyle(entry.name).color} 
                    strokeWidth={0} 
                    opacity={isInActiveFilter ? 1 : 0.3}
                    style={{ outline: 'none' }}
                  />
                );
              })}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--foreground)' }}
              formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

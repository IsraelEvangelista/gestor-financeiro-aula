import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', total: 1500 },
  { name: 'Fev', total: 2300 },
  { name: 'Mar', total: 3200 },
  { name: 'Abr', total: 2800 },
  { name: 'Mai', total: 3500 },
  { name: 'Jun', total: 4500 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-heading font-bold tracking-tight">Relatórios</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  cursor={{ fill: 'var(--accent)' }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Despesas por Categoria (Mock)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
            Gráfico em desenvolvimento...
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

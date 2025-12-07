import { useState } from 'react';
import { Filter, Calendar, Tag, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/contexts/DashboardContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MultiSelect, type Option } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTH_OPTIONS: Option[] = [
  { value: '0', label: 'Janeiro' },
  { value: '1', label: 'Fevereiro' },
  { value: '2', label: 'Março' },
  { value: '3', label: 'Abril' },
  { value: '4', label: 'Maio' },
  { value: '5', label: 'Junho' },
  { value: '6', label: 'Julho' },
  { value: '7', label: 'Agosto' },
  { value: '8', label: 'Setembro' },
  { value: '9', label: 'Outubro' },
  { value: '10', label: 'Novembro' },
  { value: '11', label: 'Dezembro' },
];

export function FilterBlock() {
  const { 
    blockFilters, 
    chartFilters,
    setBlockMonths,
    selectedYear,
    setSelectedYear, 
    toggleBlockTipo, 
    toggleBlockCategoria,
    resetAllFilters,
    availableCategories
  } = useDashboard();
  
  const [isOpen, setIsOpen] = useState(false); // Default collapsed

  // Generate years array (current to 15 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 16 }, (_, i) => currentYear - i);

  const handleMonthSelect = (values: string[]) => {
    setBlockMonths(values.map(v => parseInt(v)));
  };

  const hasBlockFilters = blockFilters.months.length > 0 || blockFilters.tipos.length < 2 || blockFilters.categorias.length > 0;
  const hasChartFilters = chartFilters.month || chartFilters.categoria;
  const hasAnyFilter = hasBlockFilters || hasChartFilters;

  const despesaCategorias = availableCategories.filter(c => c.tipo === 'despesa');
  const receitaCategorias = availableCategories.filter(c => c.tipo === 'receita');

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      className="w-full space-y-2 bg-card/50 p-4 rounded-lg backdrop-blur-sm border border-border/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="font-semibold">Filtros</span>
          {hasAnyFilter && (
            <Badge variant="secondary" className="text-xs h-5">Ativos</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasAnyFilter && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground hover:text-destructive h-7"
              onClick={resetAllFilters}
            >
              Limpar todos
            </Button>
          )}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Toggle filters</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="pt-4 border-t border-border/30">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            
            {/* 1. Period Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Período ({selectedYear})</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                    <MultiSelect
                        options={MONTH_OPTIONS}
                        selected={blockFilters.months.map(m => m.toString())}
                        onChange={handleMonthSelect}
                        placeholder="Meses"
                        className="w-full"
                    />
                </div>
                <Select 
                  value={selectedYear.toString()}
                  onValueChange={(v) => setSelectedYear(parseInt(v))}
                >
                  <SelectTrigger className="w-[90px]">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 2. Type Toggles */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo</Label>
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tipo-despesa" 
                    checked={blockFilters.tipos.includes('despesa')}
                    onCheckedChange={() => toggleBlockTipo('despesa')}
                  />
                  <label 
                    htmlFor="tipo-despesa" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Despesas
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tipo-receita" 
                    checked={blockFilters.tipos.includes('receita')}
                    onCheckedChange={() => toggleBlockTipo('receita')}
                  />
                  <label 
                    htmlFor="tipo-receita" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Receitas
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Categories (Combined View in Grid) */}
            <div className="space-y-2 col-span-1 md:col-span-2">
                 <Label className="text-sm font-medium">Categorias</Label>
                 <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1">
                    {/* Headers inside badges area? No, just mix then but color code border? Or keep separate? */}
                    {/* User asked to "Distribute better". Let's show all types mixed but sorted/grouped visually */}
                    
                    {availableCategories.length === 0 && (
                        <p className="text-xs text-muted-foreground italic">Nenhuma categoria encontrada no período.</p>
                    )}

                    {despesaCategorias.map((cat) => {
                        const isSelected = blockFilters.categorias.includes(cat.nome);
                        return (
                            <Badge
                                key={cat.nome}
                                variant={isSelected ? "default" : "outline"}
                                className={`cursor-pointer border-red-200 hover:border-red-400 ${isSelected ? 'bg-red-500 hover:bg-red-600 border-transparent' : 'text-foreground'}`}
                                onClick={() => toggleBlockCategoria(cat.nome)}
                            >
                                {isSelected && <Check className="h-3 w-3 mr-1" />}
                                {cat.nome}
                            </Badge>
                        );
                    })}
                     {receitaCategorias.map((cat) => {
                        const isSelected = blockFilters.categorias.includes(cat.nome);
                        return (
                             <Badge
                                key={cat.nome}
                                variant={isSelected ? "default" : "outline"}
                                className={`cursor-pointer border-emerald-200 hover:border-emerald-400 ${isSelected ? 'bg-emerald-500 hover:bg-emerald-600 border-transparent' : 'text-foreground'}`}
                                onClick={() => toggleBlockCategoria(cat.nome)}
                            >
                                {isSelected && <Check className="h-3 w-3 mr-1" />}
                                {cat.nome}
                            </Badge>
                        );
                    })}
                 </div>
            </div>
        </div>

        {/* Dynamic Filters Info (Moved to bottom for better scan) */}
        {hasChartFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2 p-2 bg-primary/5 rounded-md border border-primary/20">
            <span className="text-xs text-muted-foreground font-medium">Filtros ativos via gráfico:</span>
            {chartFilters.month && (
              <Badge variant="outline" className="text-xs border-primary/50 bg-primary/10">
                <Calendar className="h-3 w-3 mr-1" />
                {format(chartFilters.month, 'MMM/yy', { locale: ptBR })}
              </Badge>
            )}
            {chartFilters.categoria && (
              <Badge variant="outline" className="text-xs border-primary/50 bg-primary/10">
                <Tag className="h-3 w-3 mr-1" />
                {chartFilters.categoria}
              </Badge>
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

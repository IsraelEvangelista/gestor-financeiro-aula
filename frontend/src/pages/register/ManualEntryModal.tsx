import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ManualEntryModalProps {
  children: React.ReactNode;
  onTransactionCreated?: () => void;
}

export function ManualEntryModal({ children, onTransactionCreated }: ManualEntryModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'despesa' as 'receita' | 'despesa',
    categoryId: ''
  });

  const { categories, loading: categoriesLoading } = useCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Usuário não autenticado');

      const { error: insertError } = await supabase
        .from('transacao')
        .insert({
          descricao: formData.description,
          valor: parseFloat(formData.amount),
          tipo: formData.type,
          data: date.toISOString(),
          categoria_id: formData.categoryId,
          user_id: user.id
        });

      if (insertError) throw insertError;

      // Limpar formulário
      setFormData({
        description: '',
        amount: '',
        type: 'despesa',
        categoryId: ''
      });
      setDate(new Date());
      
      onTransactionCreated?.();
      setOpen(false);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Erro ao salvar transação');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar categorias por tipo
  const filteredCategories = categories.filter(cat => 
    cat.tipo === formData.type || cat.tipo === 'ambos'
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle>Novo Registro Manual</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input 
              id="description" 
              placeholder="Ex: Compras Supermercado" 
              required 
              className="bg-background/50" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Valor</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="0.00" 
                step="0.01" 
                required 
                className="bg-background/50" 
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select 
                value={formData.type}
                onValueChange={(value: 'receita' | 'despesa') => setFormData({ ...formData, type: value, categoryId: '' })}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              disabled={categoriesLoading}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder={categoriesLoading ? "Carregando..." : "Selecione a categoria"} />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.length === 0 ? (
                  <SelectItem value="none" disabled>Nenhuma categoria disponível</SelectItem>
                ) : (
                  filteredCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-background/50 hover:bg-background/80 transition-colors",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {date ? (
                    <span className="capitalize">
                      {format(date, "PPP", { locale: ptBR })}
                    </span>
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  locale={ptBR}
                  className="p-4 pointer-events-auto"
                  classNames={{
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
                    cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100"
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full mt-4 font-bold" disabled={isLoading || !formData.categoryId}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Registro"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

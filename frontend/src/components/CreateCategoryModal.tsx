import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { CreateCategoryInput } from "@/hooks/useCategories";

interface CreateCategoryModalProps {
  children: React.ReactNode;
  onCategoryCreated?: () => void;
  createCategory: (input: CreateCategoryInput) => Promise<{ error: string | null }>;
}

const COLOR_OPTIONS = [
  { value: '#ef4444', label: 'Vermelho' },
  { value: '#f97316', label: 'Laranja' },
  { value: '#f59e0b', label: 'Âmbar' },
  { value: '#eab308', label: 'Amarelo' },
  { value: '#84cc16', label: 'Lima' },
  { value: '#22c55e', label: 'Verde' },
  { value: '#10b981', label: 'Esmeralda' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#06b6d4', label: 'Ciano' },
  { value: '#0ea5e9', label: 'Azul Claro' },
  { value: '#3b82f6', label: 'Azul' },
  { value: '#6366f1', label: 'Índigo' },
  { value: '#8b5cf6', label: 'Violeta' },
  { value: '#a855f7', label: 'Roxo' },
  { value: '#d946ef', label: 'Fúcsia' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#f43f5e', label: 'Vermelho Rosado' },
];

export function CreateCategoryModal({ children, onCategoryCreated, createCategory }: CreateCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateCategoryInput>({
    nome: '',
    tipo: 'gasto',
    cor: '#3b82f6'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: createError } = await createCategory(formData);

    if (createError) {
      setError(createError);
    } else {
      // Limpar formulário
      setFormData({
        nome: '',
        tipo: 'gasto',
        cor: '#3b82f6'
      });
      
      onCategoryCreated?.();
      setOpen(false);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="name">Nome da Categoria</Label>
            <Input 
              id="name" 
              placeholder="Ex: Educação, Saúde, Investimentos" 
              required 
              className="bg-background/50" 
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo</Label>
            <Select 
              value={formData.tipo}
              onValueChange={(value: 'receita' | 'gasto' | 'ambos') => setFormData({ ...formData, tipo: value })}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="gasto">Despesa</SelectItem>
                <SelectItem value="ambos">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="color">Cor</Label>
            <div className="flex gap-2">
              <div 
                className="w-12 h-10 rounded border border-border"
                style={{ backgroundColor: formData.cor }}
              />
              <Select 
                value={formData.cor}
                onValueChange={(value) => setFormData({ ...formData, cor: value })}
              >
                <SelectTrigger className="bg-background/50 flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: color.value }}
                        />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full mt-4 font-bold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Categoria"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

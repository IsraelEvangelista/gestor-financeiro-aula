import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/useCategories";
import { CreateCategoryModal } from "@/components/CreateCategoryModal";

export default function CategoriesPage() {
  const { categories, loading, createCategory, deleteCategory, refreshCategories } = useCategories();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a categoria "${name}"?`)) {
      const { error } = await deleteCategory(id);
      if (error) {
        alert('Erro ao excluir categoria: ' + error);
      }
    }
  };

  const getCategoryTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'receita': return 'Receita';
      case 'gasto': return 'Despesa';
      case 'ambos': return 'Ambos';
      default: return tipo;
    }
  };

  const getCategoryTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'receita': return 'bg-primary/10 text-primary border-primary/20';
      case 'gasto': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'ambos': return 'bg-secondary text-secondary-foreground border-border';
      default: return 'bg-secondary text-secondary-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Categorias</h2>
          <p className="text-muted-foreground">
            Gerencie suas categorias de receitas e despesas
          </p>
        </div>
        <CreateCategoryModal createCategory={createCategory} onCategoryCreated={refreshCategories}>
          <Button className="font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" /> Nova Categoria
          </Button>
        </CreateCategoryModal>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Suas Categorias</CardTitle>
          <CardDescription>
            {categories.length} {categories.length === 1 ? 'categoria cadastrada' : 'categorias cadastradas'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>Nenhuma categoria cadastrada.</p>
              <p className="text-sm mt-2">Clique em "Nova Categoria" para começar.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id} className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: category.cor }}
                        >
                          {category.icone || category.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{category.nome}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs mt-1 ${getCategoryTypeColor(category.tipo)}`}
                          >
                            {getCategoryTypeLabel(category.tipo)}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(category.id, category.nome)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

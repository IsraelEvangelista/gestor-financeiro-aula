import { useState } from "react";
import { getCategoryStyle } from "@/config/categories";
import { cn } from "@/lib/utils";
import { Plus, Search, Filter, MoreHorizontal, Camera, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ManualEntryModal } from "./ManualEntryModal";
import { OCRModal } from "./OCRModal";
import { useTransactions } from "@/hooks/useTransactions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function RegisterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { transactions, loading, refreshTransactions, deleteTransaction } = useTransactions();

  const filteredTransactions = transactions.filter(t => 
    t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.categoria?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      const { error } = await deleteTransaction(id);
      if (error) {
        alert('Erro ao excluir transação: ' + error);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-heading font-bold tracking-tight">Registro</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <OCRModal>
            <Button variant="outline" className="flex-1 sm:flex-none gap-2 border-primary/20 hover:bg-primary/10">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">OCR / Câmera</span>
              <span className="sm:hidden">OCR</span>
            </Button>
          </OCRModal>
          
          <ManualEntryModal onTransactionCreated={refreshTransactions}>
            <Button className="flex-1 sm:flex-none font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" /> Novo Registro
            </Button>
          </ManualEntryModal>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-medium">Histórico de Lançamentos</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar registros..." 
                className="pl-8 bg-background/50" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary/50">
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhuma transação encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-secondary/30 transition-colors">
                        <TableCell className="font-medium">{transaction.descricao}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(transaction.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {transaction.categoria ? (
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                              getCategoryStyle(transaction.categoria.nome).bg,
                              getCategoryStyle(transaction.categoria.nome).text
                            )}>
                              {transaction.categoria.nome}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">Sem categoria</span>
                          )}
                        </TableCell>
                        <TableCell className={`text-right font-bold ${transaction.tipo === 'receita' ? 'text-primary' : 'text-destructive'}`}>
                          {transaction.tipo === 'despesa' ? '-' : '+'} 
                          {formatCurrency(Number(transaction.valor))}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(transaction.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

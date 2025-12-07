import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Receipt, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  User,
  ChevronLeft,
  ChevronRight,
  Tags
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile menu state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useProfile();
  // const profile = { nome: "Usuário Teste", email: "teste@exemplo.com", avatar_url: null }; // Mock for debugging

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Receipt, label: "Registro", path: "/register" },
    { icon: Tags, label: "Categorias", path: "/categories" },
    { icon: Tags, label: "Categorias", path: "/categories" },
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];


  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-card border-r border-border transform transition-all duration-300 ease-in-out flex flex-col",
          // Mobile behavior: slide in/out
          "lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop behavior: expand/collapse width
          isCollapsed ? "lg:w-20" : "lg:w-64",
          // Mobile always full width when open
          "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <button 
            onClick={toggleCollapse}
            className="hidden lg:flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none w-full"
          >
            <img src="/logo_gestor_fin.png" alt="Logo" className="h-8 w-auto flex-shrink-0" />
            <span 
              className={cn(
                "font-heading font-bold text-xl transition-all duration-300",
                isCollapsed && "lg:hidden"
              )}
            >
              Gestor Financeiro
            </span>
          </button>
          
          {/* Mobile only: static logo + close button */}
          <div className="flex lg:hidden items-center w-full">
            <img src="/logo_gestor_fin.png" alt="Logo" className="h-8 w-auto mr-3" />
            <span className="font-heading font-bold text-xl">Gestor Financeiro</span>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleSidebar}>
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  isCollapsed && "lg:justify-center lg:px-2"
                )}
                onClick={() => setIsSidebarOpen(false)}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon 
                  size={20} 
                  className={cn(
                    "transition-colors flex-shrink-0",
                    isActive ? "text-primary" : "group-hover:text-foreground"
                  )} 
                />
                <span 
                  className={cn(
                    "transition-all duration-300",
                    isCollapsed && "lg:hidden"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Summary */}
        <div className={cn(
          "p-4 border-t border-border transition-all duration-300",
          isCollapsed && "lg:p-2"
        )}>
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-lg bg-secondary/50",
            isCollapsed && "lg:flex-col lg:gap-2"
          )}>
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.nome || "Usuário"} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {profile?.nome?.charAt(0).toUpperCase() || <User size={20} />}
              </AvatarFallback>
            </Avatar>
            <div 
              className={cn(
                "flex-1 min-w-0 transition-all duration-300",
                isCollapsed && "lg:hidden"
              )}
            >
              <p className="text-sm font-medium truncate">{profile?.nome || "Carregando..."}</p>
              <p className="text-xs text-muted-foreground truncate">{profile?.email || ""}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              title="Sair"
              className={cn(
                "h-8 w-8 text-muted-foreground hover:text-destructive transition-colors",
                isCollapsed && "lg:hidden"
              )}
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>

        {/* Collapse Toggle Button (Desktop only) */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shadow-md z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
              <Menu size={20} />
            </Button>
            <h1 className="text-lg font-heading font-semibold capitalize">
              {navItems.find(i => i.path === location.pathname)?.label || "Vibe Coding"}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
                <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8 animate-in fade-in duration-500">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, User, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SettingsPage() {
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();
  // const profile = { nome: "Usuário Teste", email: "teste@exemplo.com", avatar_url: null };
  // const loading = false;
  // const updateProfile = async () => ({ error: null });
  // const uploadAvatar = async () => ({ error: null });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(profile?.nome || "");

  // Atualizar nome local quando perfil carregar
  if (profile && name === "" && profile.nome) {
    setName(profile.nome);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await updateProfile({ nome: name });

    if (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil: ' + error });
    } else {
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    }
    setSaving(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const { error } = await uploadAvatar(file);

    if (error) {
      setMessage({ type: 'error', text: 'Erro ao fazer upload da imagem: ' + error });
    } else {
      setMessage({ type: 'success', text: 'Avatar atualizado com sucesso!' });
    }
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie suas informações de perfil e preferências.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e foto de perfil.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'success' ? 'border-primary/20 bg-primary/10' : ''}>
              {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-primary" />}
              <AlertDescription className={message.type === 'success' ? 'text-primary' : ''}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-border cursor-pointer transition-opacity group-hover:opacity-80">
                <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                <AvatarFallback className="text-2xl bg-secondary">
                  {profile?.nome?.charAt(0).toUpperCase() || <User size={32} />}
                </AvatarFallback>
              </Avatar>
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-6 w-6 text-white" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-medium text-lg">{profile?.nome}</h3>
              <p className="text-sm text-muted-foreground mb-2">{profile?.email}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Alterar Foto
                  </>
                )}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Seu nome"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={profile?.email || ''} 
                disabled 
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                O email não pode ser alterado.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

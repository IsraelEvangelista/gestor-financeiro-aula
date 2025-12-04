import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";
import { supabase } from "@/lib/supabase";

export function OCRModal({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await processFile(file);
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setStatus("idle");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      // Convert to Base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      // Send to Webhook
      const webhookUrl = import.meta.env.VITE_OCR_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error("Webhook URL not configured");
      }

      // Extract pure base64 (remove data:image/...;base64, prefix)
      const base64Match = base64.match(/^data:([^;]+);base64,(.+)$/);
      if (!base64Match) {
        throw new Error("Invalid base64 format");
      }
      
      const mimeType = base64Match[1]; // e.g., "image/jpeg"
      const pureBase64 = base64Match[2]; // Pure base64 string without prefix

      await axios.post(webhookUrl, {
        user_id: user.id,
        image: pureBase64,
        filename: file.name,
        mimetype: mimeType
      });

      setStatus("success");
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
      }, 2000);

    } catch (error) {
      console.error("OCR Error:", error);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle>Leitura Inteligente (OCR)</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <Camera size={32} />
            </div>
            <p className="text-sm text-muted-foreground">
              Tire uma foto ou faça upload de um comprovante para preenchimento automático.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload size={24} />
              <span>Upload Arquivo</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5"
              onClick={() => fileInputRef.current?.click()} // On mobile this triggers camera option
              disabled={isLoading}
            >
              <Camera size={24} />
              <span>Câmera</span>
            </Button>
            
            <Input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
              capture="environment" // Hints to open camera on mobile
            />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-primary animate-pulse">
              <Loader2 className="animate-spin" />
              <span>Processando imagem...</span>
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center justify-center gap-2 text-emerald-500 font-medium">
              <CheckCircle2 />
              <span>Enviado com sucesso!</span>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center justify-center gap-2 text-destructive font-medium">
              <AlertCircle />
              <span>Erro ao enviar. Tente novamente.</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export interface CategoryStyle {
  label: string;
  color: string; // Hex for charts
  bg: string;    // Tailwind class for background
  text: string;  // Tailwind class for text
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "Alimentação": { 
    label: "Alimentação", 
    color: "#3b82f6", // Blue-500
    bg: "bg-blue-500/10", 
    text: "text-blue-500" 
  },
  "Lazer": { 
    label: "Lazer", 
    color: "#f97316", // Orange-500
    bg: "bg-orange-500/10", 
    text: "text-orange-500" 
  },
  "Moradia": { 
    label: "Moradia", 
    color: "#ec4899", // Pink-500
    bg: "bg-pink-500/10", 
    text: "text-pink-500" 
  },
  "Transporte": { 
    label: "Transporte", 
    color: "#22c55e", // Green-500
    bg: "bg-green-500/10", 
    text: "text-green-500" 
  },
  "Renda": { 
    label: "Renda", 
    color: "#10b981", // Emerald-500
    bg: "bg-emerald-500/10", 
    text: "text-emerald-500" 
  },
  "Outros": { 
    label: "Outros", 
    color: "#64748b", // Slate-500
    bg: "bg-slate-500/10", 
    text: "text-slate-500" 
  }
};

export const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  label: "Outros",
  color: "#64748b",
  bg: "bg-slate-500/10",
  text: "text-slate-500"
};

export function getCategoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category] || DEFAULT_CATEGORY_STYLE;
}

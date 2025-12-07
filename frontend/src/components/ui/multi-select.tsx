"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  emptyMessage = "No items found.",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  const handleClear = () => {
      onChange([]);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between hover:bg-card/80 h-10", className)}
        >
          <div className="flex gap-1 flex-wrap items-center overflow-hidden">
            {selected.length === 0 && <span className="text-muted-foreground font-normal">{placeholder}</span>}
            {selected.length > 0 && selected.length <= 2 && (
               selected.map((val) => (
                   <Badge key={val} variant="secondary" className="mr-1 mb-0.5 text-[10px] h-5 px-1 font-normal bg-secondary/50 text-secondary-foreground border-border/50">
                       {options.find((opt) => opt.value === val)?.label}
                   </Badge>
               ))
            )}
             {selected.length > 2 && (
                <Badge variant="secondary" className="mr-1 text-[10px] h-5 px-1 font-normal bg-secondary/50 text-secondary-foreground border-border/50">
                  {selected.length} selecionados
                </Badge>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          {/* <CommandInput placeholder="Search..." /> */}
          <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                <CommandItem onSelect={handleClear} className="justify-center text-center text-muted-foreground text-xs font-medium cursor-pointer aria-selected:bg-accent/50">
                    Limpar Seleção
                </CommandItem>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value} // Value used for filtering/searching
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

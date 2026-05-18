import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicFilters } from "@/lib/filters-service";

interface FilterBarProps {
  activeFilter: string;
  setActiveFilter: (v: string) => void;
  activeTexture: string;
  setActiveTexture: (v: string) => void;
  activeGout: string;
  setActiveGout: (v: string) => void;
}

type FilterOption = { id: string; label: string; slug: string };

const DropdownPill = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 text-base font-semibold transition-all duration-200 ${
          value
            ? "border-primary bg-primary/10 text-primary"
            : "border-primary/30 bg-background text-foreground hover:border-primary"
        }`}
      >
        {options.find((opt) => opt.slug === value)?.label ?? label}
        <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 bg-background border border-border rounded-xl shadow-lg z-50 min-w-[180px] py-2">
          <button
            onClick={() => { onChange(""); setOpen(false); }}
            className="w-full text-left px-5 py-3 text-base text-muted-foreground hover:bg-muted transition-colors"
          >
            Tous
          </button>
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                onChange(opt.slug);
                setOpen(false);
              }}
              className={`w-full text-left px-5 py-3 text-base transition-colors ${
                value === opt.slug ? "text-primary font-semibold bg-primary/5" : "text-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterBar = ({
  activeFilter,
  setActiveFilter,
  activeTexture,
  setActiveTexture,
  activeGout,
  setActiveGout,
}: FilterBarProps) => {
  const { data: filters = {}, isLoading } = useQuery({
    queryKey: ["public-filters"],
    queryFn: fetchPublicFilters,
  });

  const textures = filters.texture?.options ?? [];
  const gouts = filters.gout?.options ?? [];

  const hasActiveFilters = useMemo(
    () => activeFilter === "all" && !activeTexture && !activeGout,
    [activeFilter, activeTexture, activeGout],
  );

  return (
    <div className="sticky top-[60px] z-40 bg-background border-b-2 border-accent/30 py-4 flex flex-col justify-center items-center text-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center gap-3 justify-center">
          <button
            onClick={() => {
              setActiveFilter("all");
              setActiveTexture("");
              setActiveGout("");
            }}
            className={`px-8 py-3 rounded-full text-base font-bold transition-all duration-200 ${
              hasActiveFilters ? "bg-secondary text-secondary-foreground shadow-md" : "bg-secondary/10 text-secondary hover:bg-secondary/20"
            }`}
          >
            Tous les produits
          </button>
          <DropdownPill
            label={isLoading ? "Textures..." : filters.texture?.label ?? "Textures"}
            options={textures}
            value={activeTexture}
            onChange={setActiveTexture}
          />
          <DropdownPill
            label={isLoading ? "Goûts..." : filters.gout?.label ?? "Goûts"}
            options={gouts}
            value={activeGout}
            onChange={setActiveGout}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface FilterBarProps {
  activeFilter: string;
  setActiveFilter: (v: string) => void;
  activeTexture: string;
  setActiveTexture: (v: string) => void;
  activeGout: string;
  setActiveGout: (v: string) => void;
  activeRegime: string;
  setActiveRegime: (v: string) => void;
}

const textures = ["Boisson", "Crème", "Poudre", "Gelée", "Purée", "Velouté", "Céréales"];
const gouts = ["Fruité", "Lacté", "Chocolat", "Vanille", "Café", "Neutre"];
const regimes = ["Sans sucre", "Hyperprotéiné", "Rénal", "Standard"];

const DropdownPill = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
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
        {value || label}
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
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-5 py-3 text-base transition-colors ${
                value === opt ? "text-primary font-semibold bg-primary/5" : "text-foreground hover:bg-muted"
              }`}
            >
              {opt}
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
  activeRegime,
  setActiveRegime,
}: FilterBarProps) => (
  <div className="sticky top-[60px] z-40 bg-background border-b-2 border-accent/30 py-4 flex flex-col justify-center items-center text-center">
    <div className="container mx-auto px-6">
      <div className="flex flex-wrap items-center gap-3 justify-center">
        <button
          onClick={() => {
            setActiveFilter("all");
            setActiveTexture("");
            setActiveGout("");
            setActiveRegime("");
          }}
          className={`px-8 py-3 rounded-full text-base font-bold transition-all duration-200 ${
            activeFilter === "all" && !activeTexture && !activeGout && !activeRegime
              ? "bg-secondary text-secondary-foreground shadow-md"
              : "bg-secondary/10 text-secondary hover:bg-secondary/20"
          }`}
        >
          Tous les produits
        </button>
        <DropdownPill label="Textures" options={textures} value={activeTexture} onChange={setActiveTexture} />
        <DropdownPill label="Goûts" options={gouts} value={activeGout} onChange={setActiveGout} />
        <DropdownPill label="Régimes spécifiques" options={regimes} value={activeRegime} onChange={setActiveRegime} />
      </div>
    </div>
  </div>
);

export default FilterBar;

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, XCircle, ShoppingCart } from "lucide-react";
import { builderProducts, type BuilderProduct, type ComponentCategory } from "@/data/builderProducts";
import { isProductCompatible, validateBuild, type BuildSelection, type CompatibilityError } from "@/utils/compatibilidade";

const spring = { type: "spring" as const, stiffness: 300, damping: 25, mass: 0.5 };

const categoryLabels: Record<ComponentCategory, string> = {
  switch: "Switches",
  keycap: "Keycaps",
  pcb: "PCB",
  case: "Case",
};

const categoryOrder: ComponentCategory[] = ["switch", "keycap", "pcb", "case"];

/* ── Compatibility badge ───────────────────────────────────── */
const CompatBadge = ({ compatible }: { compatible: boolean }) =>
  compatible ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "hsl(160, 60%, 50%)" }}>
      <CheckCircle2 className="h-3 w-3" /> Compatível
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
      <XCircle className="h-3 w-3" /> Incompatível
    </span>
  );

/* ── Product card ──────────────────────────────────────────── */
interface ProductCardProps {
  product: BuilderProduct;
  selected: boolean;
  compatible: boolean;
  onSelect: () => void;
}

const ProductCard = ({ product, selected, compatible, onSelect }: ProductCardProps) => (
  <motion.button
    layout
    whileHover={compatible ? { scale: 1.02 } : undefined}
    whileTap={compatible ? { scale: 0.98 } : undefined}
    transition={spring}
    disabled={!compatible}
    onClick={onSelect}
    className={`relative flex flex-col items-start gap-1 rounded-lg p-4 text-left transition-all w-full ${
      selected
        ? "bg-primary/20 border-2 border-primary ring-1 ring-primary/30"
        : compatible
          ? "bg-accent border border-border hover:border-primary/40"
          : "bg-accent/40 border border-border opacity-50 cursor-not-allowed"
    }`}
  >
    <div className="flex items-center justify-between w-full">
      <span className="text-2xl">{product.image}</span>
      <CompatBadge compatible={compatible} />
    </div>
    <p className="text-sm font-semibold text-foreground-strong">{product.name}</p>
    <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
    <div className="flex items-center justify-between w-full mt-1">
      <span className="text-xs text-muted-foreground">
        {product.type} {product.layout ? `• ${product.layout}` : ""}
      </span>
      <span className="text-sm font-bold text-foreground-strong tabular-nums">${product.price.toFixed(2)}</span>
    </div>
    {!compatible && (
      <p className="text-[10px] text-destructive mt-1">Este item não é compatível com sua configuração atual</p>
    )}
  </motion.button>
);

/* ── Error alert ───────────────────────────────────────────── */
const BuildAlert = ({ error }: { error: CompatibilityError }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    className={`flex items-start gap-2 rounded-md p-3 text-sm ${
      error.severity === "error"
        ? "bg-destructive/10 border border-destructive/30 text-destructive"
        : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
    }`}
  >
    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
    <span>{error.message}</span>
  </motion.div>
);

/* ── Main page ─────────────────────────────────────────────── */
const BuilderPage = () => {
  const { addItem } = useCart();
  const [selectedSwitch, setSelectedSwitch] = useState<BuilderProduct | null>(null);
  const [selectedKeycap, setSelectedKeycap] = useState<BuilderProduct | null>(null);
  const [selectedPcb, setSelectedPcb] = useState<BuilderProduct | null>(null);
  const [selectedCase, setSelectedCase] = useState<BuilderProduct | null>(null);

  const selection: BuildSelection = useMemo(
    () => ({ switch: selectedSwitch, keycap: selectedKeycap, pcb: selectedPcb, case: selectedCase }),
    [selectedSwitch, selectedKeycap, selectedPcb, selectedCase],
  );

  const errors = useMemo(() => validateBuild(selection), [selection]);
  const hasErrors = errors.some((e) => e.severity === "error");

  const totalPrice = useMemo(() => {
    return [selectedSwitch, selectedKeycap, selectedPcb, selectedCase]
      .filter(Boolean)
      .reduce((sum, p) => sum + p!.price, 0);
  }, [selectedSwitch, selectedKeycap, selectedPcb, selectedCase]);

  const selectedCount = [selectedSwitch, selectedKeycap, selectedPcb, selectedCase].filter(Boolean).length;

  const handleSelect = (product: BuilderProduct) => {
    const setters: Record<ComponentCategory, React.Dispatch<React.SetStateAction<BuilderProduct | null>>> = {
      switch: setSelectedSwitch,
      keycap: setSelectedKeycap,
      pcb: setSelectedPcb,
      case: setSelectedCase,
    };
    const current = selection[product.category as keyof BuildSelection];
    if (current?.id === product.id) {
      setters[product.category](null);
    } else {
      setters[product.category](product);
    }
  };

  const handleAddToCart = () => {
    if (hasErrors) {
      toast.error("Corrija os erros de compatibilidade antes de adicionar ao carrinho.");
      return;
    }
    if (selectedCount === 0) {
      toast.error("Selecione pelo menos um componente.");
      return;
    }
    const parts = [selectedSwitch, selectedKeycap, selectedPcb, selectedCase].filter(Boolean) as BuilderProduct[];
    const name = parts.map((p) => p.name).join(" + ");
    addItem({
      id: `build-${Date.now()}`,
      name: `Custom Build: ${name}`,
      price: totalPrice,
      image: "⌨️",
    });
    toast.success("Build adicionada ao carrinho!");
  };

  const handleClearAll = () => {
    setSelectedSwitch(null);
    setSelectedKeycap(null);
    setSelectedPcb(null);
    setSelectedCase(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Keyboard Builder</h1>
        <p className="text-foreground mb-10">
          Selecione seus componentes — o sistema verifica a compatibilidade automaticamente.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Sidebar: summary & errors ─────────────────────── */}
        <div className="order-2 lg:order-1 lg:col-span-1">
          <div className="glass rounded-lg p-6 sticky top-24 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground-strong">Sua Build</h2>

            {categoryOrder.map((cat) => {
              const item = selection[cat as keyof BuildSelection];
              return (
                <div key={cat} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{categoryLabels[cat]}</span>
                  {item ? (
                    <span className="text-foreground-strong font-medium truncate max-w-[180px]">{item.name}</span>
                  ) : (
                    <span className="text-muted-foreground/50 italic">—</span>
                  )}
                </div>
              );
            })}

            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground-strong tabular-nums">${totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                {selectedCount > 0 && (
                  <button onClick={handleClearAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors underline">
                    Limpar
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={spring}
                  onClick={handleAddToCart}
                  disabled={hasErrors || selectedCount === 0}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-md shadow-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Adicionar
                </motion.button>
              </div>
            </div>

            {/* Errors / warnings */}
            <AnimatePresence mode="sync">
              {errors.length > 0 && (
                <div className="space-y-2">
                  {errors.map((err, i) => (
                    <BuildAlert key={i} error={err} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Main: product grid per category ───────────────── */}
        <div className="order-1 lg:order-2 lg:col-span-2 space-y-8">
          {categoryOrder.map((cat) => {
            const products = builderProducts.filter((p) => p.category === cat);
            return (
              <section key={cat}>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-strong mb-3">
                  {categoryLabels[cat]}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((product) => {
                    const compatible = isProductCompatible(product, selection);
                    const selected = selection[cat as keyof BuildSelection]?.id === product.id;
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        selected={selected}
                        compatible={compatible || selected}
                        onSelect={() => handleSelect(product)}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;

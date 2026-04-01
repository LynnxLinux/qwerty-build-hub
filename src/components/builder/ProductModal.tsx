import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { builderProducts, type BuilderProduct, type ComponentCategory } from "@/data/builderProducts";
import { isProductCompatible, type BuildSelection } from "@/utils/compatibilidade";
import ProductCard from "./ProductCard";

const categoryTitles: Record<ComponentCategory, string> = {
  case: "Escolha o Case",
  switch: "Escolha os Switches",
  keycap: "Escolha as Keycaps",
  pcb: "Escolha a PCB",
};

interface ProductModalProps {
  category: ComponentCategory | null;
  selection: BuildSelection;
  onSelect: (product: BuilderProduct) => void;
  onClose: () => void;
}

const ProductModal = ({ category, selection, onSelect, onClose }: ProductModalProps) => {
  if (!category || category === "extras") return null;

  const products = builderProducts.filter((p) => p.category === category);

  return (
    <AnimatePresence>
      {category && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel slides in from right */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-bold" style={{ color: "hsl(var(--foreground-strong))" }}>
                {categoryTitles[category]}
              </h2>
              <button
                onClick={onClose}
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Product list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {products.map((product) => {
                const compatible = isProductCompatible(product, selection);
                const selected = selection[category as keyof BuildSelection]?.id === product.id;
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    selected={selected}
                    compatible={compatible || selected}
                    onSelect={() => {
                      onSelect(product);
                      onClose();
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;

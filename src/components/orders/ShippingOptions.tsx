import { motion } from "framer-motion";
import { Truck, Loader2 } from "lucide-react";

interface ShippingInfo {
  name: string;
  price: number;
  days: number;
}

interface ShippingOptionsProps {
  shipping: ShippingInfo | null;
  isLoading: boolean;
}

export function ShippingOptions({ shipping, isLoading }: ShippingOptionsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Calculando frete...</span>
      </div>
    );
  }

  if (!shipping) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Selecione um endereço para calcular o frete.
      </p>
    );
  }

  const formattedPrice = shipping.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
    >
      <Truck className="h-5 w-5 text-primary shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground-strong">{shipping.name}</p>
        <p className="text-xs text-muted-foreground">
          Entrega estimada em {shipping.days} {shipping.days === 1 ? "dia útil" : "dias úteis"}
        </p>
      </div>
      <span className="text-sm font-bold text-primary tabular-nums">{formattedPrice}</span>
    </motion.div>
  );
}

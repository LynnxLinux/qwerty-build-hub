import { useState, useCallback } from "react";
import { shippingApi, ShippingOption } from "@/api/shipping";

export function useShipping() {
  const [shipping, setShipping] = useState<ShippingOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (zipCode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await shippingApi.calculate(zipCode);
      if (res.success && res.data) {
        setShipping(res.data);
        return res.data;
      }
      return null;
    } catch (err) {
      setError((err as { message?: string }).message || "Erro ao calcular frete");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { shipping, isLoading, error, calculate };
}

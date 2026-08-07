import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { cartApi, Cart as ApiCart, CartItem as ApiCartItem } from "../api/cart";
import { useAuth } from "./AuthContext";
import { ApiError } from "../api/client";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "id"> & { id?: string; quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const ANON_CART_KEY = "anon_cart";

// --- localStorage helpers ---

function getAnonCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(ANON_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAnonCart(items: CartItem[]): void {
  try {
    localStorage.setItem(ANON_CART_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable
  }
}

function clearAnonCart(): void {
  try {
    localStorage.removeItem(ANON_CART_KEY);
  } catch {
    // Ignore
  }
}

// --- API response mapper ---

function mapApiCartToItems(apiCart: ApiCart): CartItem[] {
  return apiCart.items.map((item: ApiCartItem) => ({
    id: item.id,
    variantId: item.variantId,
    name: item.variant?.product?.name
      ? `${item.variant.product.name} — ${item.variant.name}`
      : item.variant?.name || "Produto",
    price: Number(item.unitPrice),
    quantity: item.quantity,
    image:
      item.variant?.product?.images?.[0]?.url ||
      item.variant?.images?.[0]?.url ||
      "https://via.placeholder.com/300",
  }));
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, status } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const prevAuthRef = useRef(false);
  const initializedRef = useRef(false);

  // Initialize: load anon cart from localStorage on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (!isAuthenticated) {
      const anonItems = getAnonCart();
      if (anonItems.length > 0) {
        setItems(anonItems);
      }
    }
  }, [isAuthenticated]);

  // Auth state change: merge on login, clear on logout
  useEffect(() => {
    if (status === "loading") return;

    const wasAuthenticated = prevAuthRef.current;
    prevAuthRef.current = isAuthenticated;

    if (isAuthenticated && !wasAuthenticated) {
      // Just logged in — merge anon cart then load from backend
      const anonItems = getAnonCart();
      setIsLoading(true);

      const mergeAndLoad = async () => {
        try {
          if (anonItems.length > 0) {
            // Merge anon items to backend
            const mergePayload = anonItems.map((i) => ({
              variantId: i.variantId,
              quantity: i.quantity,
            }));
            await cartApi.merge(mergePayload);
            clearAnonCart();
          }

          // Load cart from backend
          const response = await cartApi.get();
          if (response.success && response.data) {
            setItems(mapApiCartToItems(response.data));
          }
        } catch {
          // If merge/load fails, still try to load cart
          try {
            const response = await cartApi.get();
            if (response.success && response.data) {
              setItems(mapApiCartToItems(response.data));
            }
          } catch {
            // Keep items as they are
          }
        } finally {
          setIsLoading(false);
        }
      };

      mergeAndLoad();
    } else if (!isAuthenticated && wasAuthenticated) {
      // Just logged out — load anon cart from localStorage
      const anonItems = getAnonCart();
      setItems(anonItems);
    }
  }, [isAuthenticated, status]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity" | "id"> & { id?: string; quantity?: number }) => {
      const quantity = item.quantity || 1;

      if (isAuthenticated) {
        // Authenticated: use API
        setIsLoading(true);
        cartApi
          .addItem(item.variantId, quantity)
          .then((response) => {
            if (response.success && response.data) {
              setItems(mapApiCartToItems(response.data));
            }
          })
          .catch((err) => {
            const apiErr = err as ApiError;
            toast.error(apiErr.message || "Erro ao adicionar ao carrinho");
          })
          .finally(() => setIsLoading(false));
      } else {
        // Anonymous: localStorage
        setItems((prev) => {
          const existing = prev.find((i) => i.variantId === item.variantId);
          let updated: CartItem[];
          if (existing) {
            updated = prev.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            );
          } else {
            const newItem: CartItem = {
              id: `anon-${item.variantId}`,
              variantId: item.variantId,
              name: item.name,
              price: item.price,
              quantity,
              image: item.image,
            };
            updated = [...prev, newItem];
          }
          saveAnonCart(updated);
          return updated;
        });
      }
    },
    [isAuthenticated],
  );

  const removeItem = useCallback(
    (id: string) => {
      if (isAuthenticated) {
        setIsLoading(true);
        cartApi
          .removeItem(id)
          .then((response) => {
            if (response.success && response.data) {
              setItems(mapApiCartToItems(response.data));
            }
          })
          .catch((err) => {
            const apiErr = err as ApiError;
            toast.error(apiErr.message || "Erro ao remover item");
          })
          .finally(() => setIsLoading(false));
      } else {
        setItems((prev) => {
          const updated = prev.filter((i) => i.id !== id);
          saveAnonCart(updated);
          return updated;
        });
      }
    },
    [isAuthenticated],
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }

      if (isAuthenticated) {
        setIsLoading(true);
        cartApi
          .updateItem(id, quantity)
          .then((response) => {
            if (response.success && response.data) {
              setItems(mapApiCartToItems(response.data));
            }
          })
          .catch((err) => {
            const apiErr = err as ApiError;
            toast.error(apiErr.message || "Erro ao atualizar carrinho");
          })
          .finally(() => setIsLoading(false));
      } else {
        setItems((prev) => {
          const updated = prev.map((i) => (i.id === id ? { ...i, quantity } : i));
          saveAnonCart(updated);
          return updated;
        });
      }
    },
    [isAuthenticated, removeItem],
  );

  const clearCart = useCallback(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      cartApi
        .clear()
        .then(() => {
          setItems([]);
        })
        .catch((err) => {
          const apiErr = err as ApiError;
          toast.error(apiErr.message || "Erro ao limpar carrinho");
        })
        .finally(() => setIsLoading(false));
    } else {
      setItems([]);
      clearAnonCart();
    }
  }, [isAuthenticated]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isLoading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

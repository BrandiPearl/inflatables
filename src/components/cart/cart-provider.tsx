"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  cartCount,
  cartSubtotal,
  type CartItem,
} from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item?.id && item.qty > 0);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    const addQty = Math.max(1, qty);
    setItems((current) => {
      const existing = current.find((row) => row.id === item.id);
      if (existing) {
        return current.map((row) =>
          row.id === item.id ? { ...row, qty: row.qty + addQty, ...item } : row
        );
      }
      return [...current, { ...item, qty: addQty }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((current) => {
      if (qty <= 0) return current.filter((row) => row.id !== id);
      return current.map((row) => (row.id === id ? { ...row, qty } : row));
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((row) => row.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      ready,
      count: cartCount(items),
      subtotal: cartSubtotal(items),
      addItem,
      setQty,
      removeItem,
      clear,
    }),
    [items, ready, addItem, setQty, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}

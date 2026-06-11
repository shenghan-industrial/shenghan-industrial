"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  category: string;
  specs: { label: string; value: string }[];
  quantity: number;
}

interface InquiryContextType {
  items: CartItem[];
  addItem: (product: Product, qty: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
}

const InquiryContext = createContext<InquiryContextType | null>(null);

const STORAGE_KEY = "shenghan-inquiry-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveCart(items);
  }, [items, mounted]);

  const addItem = useCallback((product: Product, qty: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          image: product.image,
          category: product.category,
          specs: product.specs.slice(0, 4),
          quantity: qty,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <InquiryContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, cartOpen, setCartOpen }}
    >
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiryCart() {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error("useInquiryCart must be used within InquiryProvider");
  return ctx;
}

"use client";
import { useEffect, useState } from "react";
import { CART_EVENT, loadCart, saveCart, type CartItem } from "@/lib/cart";

export function useCartState() {
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const sync = () => setItems(loadCart());
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(CART_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  const update = (next: CartItem[]) => {
    try { saveCart(next); setItems(loadCart()); setStorageError(false); return true; }
    catch { setStorageError(true); return false; }
  };
  return { items, update, storageError };
}

"use client";
// ============================================================
// El-Ghalban | context/CartContext.tsx — Global Cart State
// ============================================================

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { CartItem } from "@/types";

// ─── State & Actions ─────────────────────────────────────────

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM";    payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QTY";  payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "HYDRATE";     payload: CartItem[] };

const initialState: CartState = { items: [], isOpen: false };

// ─── Reducer ─────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.payload };

    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, action.payload],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case "UPDATE_QTY":
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "el_ghalban_cart";
export const DELIVERY_FEE = 0; // Free delivery

// ─── Provider ────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Persist to localStorage on every items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const itemCount = useMemo(
    () => state.items.reduce((acc, i) => acc + i.quantity, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () => state.items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [state.items]
  );

  const total = subtotal + DELIVERY_FEE;

  const addItem     = useCallback((item: CartItem) => dispatch({ type: "ADD_ITEM",    payload: item }),           []);
  const removeItem  = useCallback((id: string)      => dispatch({ type: "REMOVE_ITEM", payload: { id } }),        []);
  const updateQuantity = useCallback((id: string, quantity: number) =>
    dispatch({ type: "UPDATE_QTY", payload: { id, quantity } }), []);
  const clearCart   = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const openCart    = useCallback(() => dispatch({ type: "OPEN_CART" }),   []);
  const closeCart   = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      isOpen: state.isOpen,
      itemCount,
      subtotal,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    }),
    [state.items, state.isOpen, itemCount, subtotal, total, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

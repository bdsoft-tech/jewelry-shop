"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { isProductId, type ProductId } from "@/app/data/products";

type CartItem = {
  productId: ProductId;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  hydrated: boolean;
  addItem: (productId: ProductId, quantity?: number) => void;
  removeItem: (productId: ProductId) => void;
  setQuantity: (productId: ProductId, quantity: number) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "aurelle-cart";
const CartContext = createContext<CartContextValue | null>(null);
const cartListeners = new Set<() => void>();
const emptyCartSnapshot: CartItem[] = [];
let cartSnapshot: CartItem[] = emptyCartSnapshot;
let cartHydrated = false;

function normalizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<CartItem[]>((items, item) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("productId" in item) ||
      !("quantity" in item) ||
      typeof item.productId !== "string" ||
      typeof item.quantity !== "number" ||
      !isProductId(item.productId)
    ) {
      return items;
    }

    const quantity = Math.max(1, Math.min(99, Math.floor(item.quantity)));
    const existing = items.find(
      (cartItem) => cartItem.productId === item.productId,
    );

    if (existing) {
      existing.quantity = Math.min(99, existing.quantity + quantity);
    } else {
      items.push({ productId: item.productId, quantity });
    }

    return items;
  }, []);
}

function readStoredCart() {
  if (typeof window === "undefined") {
    return emptyCartSnapshot;
  }

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    return storedCart
      ? normalizeCartItems(JSON.parse(storedCart))
      : emptyCartSnapshot;
  } catch {
    return emptyCartSnapshot;
  }
}

function emitCartChange() {
  cartListeners.forEach((listener) => listener());
}

function writeCartSnapshot(nextItems: CartItem[]) {
  cartSnapshot = nextItems;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
    } catch {
      // The in-memory cart still works if browser storage is unavailable.
    }
  }

  emitCartChange();
}

function updateCartSnapshot(updater: (currentItems: CartItem[]) => CartItem[]) {
  writeCartSnapshot(updater(cartSnapshot));
}

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      cartListeners.delete(listener);
    };
  }

  if (!cartHydrated) {
    cartSnapshot = readStoredCart();
    cartHydrated = true;
    queueMicrotask(emitCartChange);
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY) {
      cartSnapshot = readStoredCart();
      emitCartChange();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getCartSnapshot() {
  return cartSnapshot;
}

function getServerCartSnapshot() {
  return emptyCartSnapshot;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const hydrated = cartHydrated;

  const addItem = useCallback((productId: ProductId, quantity = 1) => {
    updateCartSnapshot((currentItems) => {
      const nextQuantity = Math.max(1, Math.min(99, Math.floor(quantity)));
      const existingItem = currentItems.find(
        (item) => item.productId === productId,
      );

      if (!existingItem) {
        return [...currentItems, { productId, quantity: nextQuantity }];
      }

      return currentItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(99, item.quantity + nextQuantity) }
          : item,
      );
    });
  }, []);

  const removeItem = useCallback((productId: ProductId) => {
    updateCartSnapshot((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  }, []);

  const setQuantity = useCallback((productId: ProductId, quantity: number) => {
    updateCartSnapshot((currentItems) => {
      if (quantity <= 0) {
        return currentItems.filter((item) => item.productId !== productId);
      }

      const nextQuantity = Math.min(99, Math.floor(quantity));

      return currentItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: nextQuantity }
          : item,
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    writeCartSnapshot([]);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
      hydrated,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [addItem, clearCart, hydrated, items, removeItem, setQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}

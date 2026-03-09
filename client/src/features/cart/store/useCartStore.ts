"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { TGoodsListItem } from "@/src/features/goods/types/goods.interface";

type CartItemData = Pick<
  TGoodsListItem,
  "id" | "price" | "discountPrice" | "currency" | "cover" | "tag"
> & {
  title: TGoodsListItem["title"] | string;
};

type CartItem = {
  id: string;
  quantity: number;
  data: CartItemData;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItemData, quantity?: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  getCount: () => number;
  getQuantityById: (id: string) => number;
  getTotalPrice: () => number;
};

const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};

type CartPersistedState = {
  items: CartItem[];
};

const storage = createJSONStorage<CartPersistedState>(() =>
  typeof window !== "undefined" ? localStorage : noopStorage,
);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }

          const newItem: CartItem = {
            id: item.id,
            quantity,
            data: {
              id: item.id,
              title: item.title,
              price: item.price,
              discountPrice: item.discountPrice,
              currency: item.currency,
              cover: item.cover,
              tag: item.tag,
            },
          };

          return { items: [...state.items, newItem] };
        });
      },

      increment: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }));
      },

      decrement: (id) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clear: () => set({ items: [] }),

      getCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getQuantityById: (id) =>
        get().items.find((item) => item.id === id)?.quantity ?? 0,

      getTotalPrice: () =>
        get().items.reduce((total, item) => {
          const price = item.data.discountPrice ?? item.data.price;
          return total + price * item.quantity;
        }, 0),
    }),
    {
      name: "cart-store",
      storage,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

import { create } from 'zustand';
import { getCart, addCartItem, updateCartItem, removeCartItem, clearCart } from '@/lib/actions/cart';

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  color: string;
  size: string;
  quantity: number;
  maxStock: number;
  category: string;
  gender: string;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  cartId: string | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  cartId: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await getCart();
      set({ items: cart.items, subtotal: cart.subtotal, cartId: cart.cartId || null });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (variantId, quantity) => {
    set({ isLoading: true });
    try {
      const result = await addCartItem(variantId, quantity);
      if (!result?.success) {
        throw new Error(result?.error || "Failed to add item");
      }
      await get().fetchCart();
    } catch (error) {
      console.error("Failed to add item:", error);
      throw error; // Re-throw to let component handle UI feedback
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (itemId, quantity) => {
    // Optimistic update
    const previousItems = get().items;
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));

    try {
      await updateCartItem(itemId, quantity);
      await get().fetchCart();
    } catch (error) {
      console.error("Failed to update item:", error);
      set({ items: previousItems }); // Revert on failure
    }
  },

  removeItem: async (itemId) => {
    // Optimistic update
    const previousItems = get().items;
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));

    try {
      await removeCartItem(itemId);
      await get().fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
      set({ items: previousItems }); // Revert on failure
    }
  },

  clear: async () => {
    set({ items: [], subtotal: 0 });
    try {
      await clearCart();
      await get().fetchCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  },
}));

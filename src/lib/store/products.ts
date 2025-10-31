import { create } from 'zustand';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  image: string | null;
  category: string | null;
  brand: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
}));
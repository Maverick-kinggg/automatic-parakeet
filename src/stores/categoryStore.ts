import { create } from 'zustand';
import type { DrawingCategoriesRow } from '@/types/database';

interface CategoryNode extends DrawingCategoriesRow {
  children?: CategoryNode[];
}

interface CategoryState {
  categories: CategoryNode[];
  flatCategories: DrawingCategoriesRow[];
  isLoading: boolean;
  
  setCategories: (categories: CategoryNode[]) => void;
  setFlatCategories: (categories: DrawingCategoriesRow[]) => void;
  setLoading: (loading: boolean) => void;
  fetchCategories: () => Promise<void>;
  fetchCategoryTree: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  flatCategories: [],
  isLoading: false,

  setCategories: (categories) => set({ categories }),
  
  setFlatCategories: (categories) => set({ flatCategories: categories }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  fetchCategories: async () => {
    set({ isLoading: true });
    
    try {
      const token = (window as any).__SUPABASE_ACCESS_TOKEN__ || getCookie('access_token');
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      set({ 
        flatCategories: result.data,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  fetchCategoryTree: async () => {
    set({ isLoading: true });
    
    try {
      const token = (window as any).__SUPABASE_ACCESS_TOKEN__ || getCookie('access_token');
      const response = await fetch('/api/categories/tree', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      set({ 
        categories: result.data,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch category tree:', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));

function getCookie(name: string): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

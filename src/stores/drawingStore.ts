import { create } from 'zustand';
import type { DrawingsRow } from '@/types/database';

interface DrawingFilters {
  category_id?: number;
  keyword?: string;
  status?: string;
}

interface DrawingState {
  drawings: DrawingsRow[];
  selectedDrawing: DrawingsRow | null;
  filters: DrawingFilters;
  isLoading: boolean;
  total: number;
  page: number;
  limit: number;
  
  setDrawings: (drawings: DrawingsRow[]) => void;
  setSelectedDrawing: (drawing: DrawingsRow | null) => void;
  setFilters: (filters: DrawingFilters) => void;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  fetchDrawings: () => Promise<void>;
  deleteDrawing: (id: number) => Promise<void>;
  batchDeleteDrawings: (ids: number[]) => Promise<void>;
}

export const useDrawingStore = create<DrawingState>((set, get) => ({
  drawings: [],
  selectedDrawing: null,
  filters: {},
  isLoading: false,
  total: 0,
  page: 1,
  limit: 20,

  setDrawings: (drawings) => set({ drawings }),
  
  setSelectedDrawing: (drawing) => set({ selectedDrawing: drawing }),
  
  setFilters: (filters) => set({ filters, page: 1 }),
  
  setPage: (page) => set({ page }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  fetchDrawings: async () => {
    const { filters, page, limit } = get();
    set({ isLoading: true });
    
    try {
      const params = new URLSearchParams();
      if (filters.category_id) params.append('category_id', filters.category_id.toString());
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.status) params.append('status', filters.status);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const token = (window as any).__SUPABASE_ACCESS_TOKEN__ || getCookie('access_token');
      const response = await fetch(`/api/drawings?${params}`, {
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
        drawings: result.data.list, 
        total: result.data.total,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch drawings:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  deleteDrawing: async (id: number) => {
    const token = (window as any).__SUPABASE_ACCESS_TOKEN__ || getCookie('access_token');
    const response = await fetch(`/api/drawings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    await get().fetchDrawings();
  },
  
  batchDeleteDrawings: async (ids: number[]) => {
    const token = (window as any).__SUPABASE_ACCESS_TOKEN__ || getCookie('access_token');
    const response = await fetch('/api/drawings/batch', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    await get().fetchDrawings();
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

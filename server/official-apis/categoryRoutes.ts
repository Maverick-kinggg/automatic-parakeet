import { Router } from 'express';
import type { DrawingCategoriesRow, DrawingCategoriesInsert, DrawingCategoriesUpdate } from '../../src/types/database';

const router: Router = Router();

interface CategoryNode extends Omit<DrawingCategoriesRow, 'drawing_count'> {
  children?: CategoryNode[];
  drawing_count?: number;
}

router.get('/tree', async (req: any, res) => {
  try {
    const { data, error } = await req.supabase
      .from('drawing_categories')
      .select('*')
      .or(`corp_id.eq.${req.user.corp_id},corp_id.is.null`)
      .eq('is_deleted', 'n')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    
    const categories: DrawingCategoriesRow[] = data || [];
    const tree = buildCategoryTree(categories);
    
    res.json({
      success: true,
      data: tree,
    });
  } catch (error: any) {
    res.status(error.code === '42501' ? 403 : 500).json({
      success: false,
      error: error.message || 'Failed to fetch category tree',
    });
  }
});

router.get('/', async (req: any, res) => {
  try {
    const { data, error } = await req.supabase
      .from('drawing_categories')
      .select('*')
      .or(`corp_id.eq.${req.user.corp_id},corp_id.is.null`)
      .eq('is_deleted', 'n')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data || [],
    });
  } catch (error: any) {
    res.status(error.code === '42501' ? 403 : 500).json({
      success: false,
      error: error.message || 'Failed to fetch categories',
    });
  }
});

router.post('/', async (req: any, res) => {
  try {
    const insertData: DrawingCategoriesInsert = {
      ...req.body,
      corp_id: req.user.corp_id,
      emp_id: req.user.emp_id,
      is_deleted: 'n',
    };
    
    const { data, error } = await req.supabase
      .from('drawing_categories')
      .insert([insertData])
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create category',
    });
  }
});

router.put('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const updateData: DrawingCategoriesUpdate = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await req.supabase
      .from('drawing_categories')
      .update(updateData)
      .eq('id', id)
      .eq('corp_id', req.user.corp_id)
      .eq('is_deleted', 'n')
      .select()
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }
    
    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update category',
    });
  }
});

router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const { data: children } = await req.supabase
      .from('drawing_categories')
      .select('id')
      .eq('parent_id', id)
      .eq('corp_id', req.user.corp_id)
      .eq('is_deleted', 'n');
    
    if (children && children.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category with subcategories',
      });
    }
    
    const { data: drawings } = await req.supabase
      .from('drawings')
      .select('id')
      .eq('category_id', id)
      .eq('corp_id', req.user.corp_id)
      .eq('is_deleted', 'n');
    
    if (drawings && drawings.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category containing drawings',
      });
    }
    
    const { error } = await req.supabase
      .from('drawing_categories')
      .update({ 
        is_deleted: 'y',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('corp_id', req.user.corp_id);
    
    if (error) throw error;
    
    res.json({
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete category',
    });
  }
});

function buildCategoryTree(categories: DrawingCategoriesRow[]): CategoryNode[] {
  const categoryMap = new Map<number, CategoryNode>();
  const rootCategories: CategoryNode[] = [];
  
  categories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [], drawing_count: cat.drawing_count || undefined });
  });
  
  categories.forEach(cat => {
    const node = categoryMap.get(cat.id)!;
    if (cat.parent_id === null || cat.parent_id === undefined) {
      rootCategories.push(node);
    } else {
      const parent = categoryMap.get(cat.parent_id);
      if (parent) {
        parent.children?.push(node);
      } else {
        rootCategories.push(node);
      }
    }
  });
  
  return rootCategories;
}

export default router;

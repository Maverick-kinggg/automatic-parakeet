import { Router } from 'express';
import type { DrawingsRow, DrawingsInsert, DrawingsUpdate } from '../../src/types/database';

const router: Router = Router();

interface DrawingWithCategory extends DrawingsRow {
  category_name?: string;
}

router.get('/', async (req: any, res) => {
  try {
    const { category_id, keyword, status, page = '1', limit = '20' } = req.query;
    
    let query = req.supabase
      .from('drawings')
      .select('*, drawing_categories(name)', { count: 'exact' })
      .or(`corp_id.eq.${req.user.corp_id},corp_id.is.null`)
      .eq('is_deleted', 'n');
    
    if (category_id) {
      query = query.eq('category_id', category_id);
    }
    
    if (keyword) {
      query = query.or(`name.ilike.%${keyword}%,code.ilike.%${keyword}%`);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;
    
    query = query.range(from, to).order('created_at', { ascending: false });
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    const drawings: DrawingWithCategory[] = (data || []).map((item: any) => ({
      ...item,
      category_name: item.drawing_categories?.name || null,
    }));
    
    res.json({
      success: true,
      data: {
        list: drawings,
        total: count || 0,
        page: pageNum,
        limit: limitNum,
      },
    });
  } catch (error: any) {
    res.status(error.code === '42501' ? 403 : 500).json({
      success: false,
      error: error.message || 'Failed to fetch drawings',
    });
  }
});

router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await req.supabase
      .from('drawings')
      .select('*, drawing_categories(name)')
      .eq('id', id)
      .or(`corp_id.eq.${req.user.corp_id},corp_id.is.null`)
      .eq('is_deleted', 'n')
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Drawing not found',
      });
    }
    
    const drawing: DrawingWithCategory = {
      ...data,
      category_name: data.drawing_categories?.name || null,
    };
    
    res.json({
      success: true,
      data: drawing,
    });
  } catch (error: any) {
    res.status(error.code === '42501' ? 403 : 500).json({
      success: false,
      error: error.message || 'Failed to fetch drawing',
    });
  }
});

router.post('/', async (req: any, res) => {
  try {
    const insertData: DrawingsInsert = {
      ...req.body,
      corp_id: req.user.corp_id,
      emp_id: req.user.emp_id,
      is_deleted: 'n',
    };
    
    const { data, error } = await req.supabase
      .from('drawings')
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
      error: error.message || 'Failed to create drawing',
    });
  }
});

router.put('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const updateData: DrawingsUpdate = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await req.supabase
      .from('drawings')
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
        error: 'Drawing not found',
      });
    }
    
    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update drawing',
    });
  }
});

router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await req.supabase
      .from('drawings')
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
      error: error.message || 'Failed to delete drawing',
    });
  }
});

router.delete('/batch', async (req: any, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid IDs array',
      });
    }
    
    const { error } = await req.supabase
      .from('drawings')
      .update({ 
        is_deleted: 'y',
        updated_at: new Date().toISOString(),
      })
      .in('id', ids)
      .eq('corp_id', req.user.corp_id);
    
    if (error) throw error;
    
    res.json({
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to batch delete drawings',
    });
  }
});

router.get('/:id/download', async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const { data: drawing, error } = await req.supabase
      .from('drawings')
      .select('file_path, file_name')
      .eq('id', id)
      .or(`corp_id.eq.${req.user.corp_id},corp_id.is.null`)
      .eq('is_deleted', 'n')
      .single();
    
    if (error) throw error;
    if (!drawing) {
      return res.status(404).json({
        success: false,
        error: 'Drawing not found',
      });
    }
    
    await req.supabase.from('download_records').insert([{
      corp_id: req.user.corp_id,
      emp_id: req.user.emp_id,
      drawing_id: parseInt(id, 10),
      ip_address: req.ip || req.headers['x-forwarded-for'] || '',
      user_agent: req.headers['user-agent'] || '',
    }]);
    
    await req.supabase
      .from('drawings')
      .update({ download_count: (drawing as any).download_count + 1 })
      .eq('id', id);
    
    const { data } = await req.supabase.storage
      .from('drawings')
      .createSignedUrl(drawing.file_path, 3600);
    
    res.json({
      success: true,
      data: {
        download_url: data?.signedUrl || '',
        file_name: drawing.file_name,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate download link',
    });
  }
});

export default router;

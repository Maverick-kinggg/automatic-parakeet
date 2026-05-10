import { Router } from 'express';

const router: Router = Router();

router.get('/stats', async (req: any, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: totalDrawings } = await req.supabase
      .from('drawings')
      .select('*', { count: 'exact', head: true })
      .or(`corp_id.eq.${req.user.corp_id},corp_id.is.null`)
      .eq('is_deleted', 'n');
    
    const { count: todayUploads } = await req.supabase
      .from('drawings')
      .select('*', { count: 'exact', head: true })
      .or(`corp_id.eq.${req.user.corp_id},corp_id.is.null`)
      .eq('is_deleted', 'n')
      .gte('created_at', today.toISOString());
    
    const { data: storageData } = await req.supabase
      .from('drawings')
      .select('file_size')
      .or(`corp_id.eq.${req.user.corp_id},corp_id.is.null`)
      .eq('is_deleted', 'n');
    
    const storageUsed = (storageData || []).reduce((sum: number, item: any) => sum + (item.file_size || 0), 0);
    
    const { data: categoryData } = await req.supabase
      .from('drawing_categories')
      .select('id, name, drawing_count')
      .or(`corp_id.eq.${req.user.corp_id},corp_id.is.null`)
      .eq('is_deleted', 'n')
      .order('drawing_count', { ascending: false })
      .limit(5);
    
    const topCategories = (categoryData || []).map((cat: any) => ({
      category_id: cat.id,
      category_name: cat.name,
      count: cat.drawing_count || 0,
    }));
    
    res.json({
      success: true,
      data: {
        total_drawings: totalDrawings || 0,
        today_uploads: todayUploads || 0,
        storage_used: storageUsed,
        top_categories: topCategories,
      },
    });
  } catch (error: any) {
    res.status(error.code === '42501' ? 403 : 500).json({
      success: false,
      error: error.message || 'Failed to fetch dashboard stats',
    });
  }
});

router.get('/recent', async (req: any, res) => {
  try {
    const { limit = '10' } = req.query;
    const limitNum = parseInt(limit, 10);
    
    const { data: recentDownloads } = await req.supabase
      .from('download_records')
      .select('drawing_id, download_time')
      .or(`corp_id.eq.${req.user.corp_id},corp_id.is.null`)
      .eq('is_deleted', 'n')
      .eq('emp_id', req.user.emp_id)
      .order('download_time', { ascending: false })
      .limit(limitNum * 2);
    
    const drawingIds = [...new Set((recentDownloads || []).map((r: any) => r.drawing_id))].slice(0, limitNum);
    
    if (drawingIds.length === 0) {
      return res.json({
        success: true,
        data: [],
      });
    }
    
    const { data: drawings } = await req.supabase
      .from('drawings')
      .select('*, drawing_categories(name)')
      .in('id', drawingIds)
      .or(`corp_id.eq.${req.user.corp_id},corp_id.is.null`)
      .eq('is_deleted', 'n');
    
    const recentDrawings = (drawings || []).map((item: any) => ({
      ...item,
      category_name: item.drawing_categories?.name || null,
    }));
    
    res.json({
      success: true,
      data: recentDrawings,
    });
  } catch (error: any) {
    res.status(error.code === '42501' ? 403 : 500).json({
      success: false,
      error: error.message || 'Failed to fetch recent drawings',
    });
  }
});

export default router;

import { Router } from 'express';
import { DownloadRecordsRow } from '../../src/types/database';

const router: Router = Router();

interface DownloadRecordWithDrawing extends DownloadRecordsRow {
  drawing_name?: string;
  drawing_code?: string;
}

router.get('/', async (req: any, res) => {
  try {
    const { drawing_id, start_date, end_date, page = '1', limit = '20' } = req.query;
    
    let query = req.supabase
      .from('download_records')
      .select('*, drawings(name, code)', { count: 'exact' })
      .or(`corp_id.eq.${req.user.corp_id},corp_id.is.null`)
      .eq('is_deleted', 'n');
    
    if (drawing_id) {
      query = query.eq('drawing_id', drawing_id);
    }
    
    if (start_date) {
      query = query.gte('download_time', start_date);
    }
    
    if (end_date) {
      query = query.lte('download_time', end_date);
    }
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;
    
    query = query.range(from, to).order('download_time', { ascending: false });
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    const records: DownloadRecordWithDrawing[] = (data || []).map((item: any) => ({
      ...item,
      drawing_name: item.drawings?.name || null,
      drawing_code: item.drawings?.code || null,
    }));
    
    res.json({
      success: true,
      data: {
        list: records,
        total: count || 0,
        page: pageNum,
        limit: limitNum,
      },
    });
  } catch (error: any) {
    res.status(error.code === '42501' ? 403 : 500).json({
      success: false,
      error: error.message || 'Failed to fetch download records',
    });
  }
});

router.get('/export', async (req: any, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let query = req.supabase
      .from('download_records')
      .select('*, drawings(name, code)')
      .or(`corp_id.eq.${req.user.corp_id},corp_id.is.null`)
      .eq('is_deleted', 'n');
    
    if (start_date) {
      query = query.gte('download_time', start_date);
    }
    
    if (end_date) {
      query = query.lte('download_time', end_date);
    }
    
    query = query.order('download_time', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    const records: DownloadRecordWithDrawing[] = (data || []).map((item: any) => ({
      ...item,
      drawing_name: item.drawings?.name || '',
      drawing_code: item.drawings?.code || '',
      download_time: new Date(item.download_time).toLocaleString(),
    }));
    
    const csvContent = [
      ['图纸名称', '图纸编号', '下载人', '下载时间', 'IP 地址'].join(','),
      ...records.map(r => 
        [r.drawing_name, r.drawing_code, r.emp_id, r.download_time, r.ip_address].join(',')
      ),
    ].join('\n');
    
    const fileName = `download_records_${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv;charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(csvContent);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to export download records',
    });
  }
});

export default router;

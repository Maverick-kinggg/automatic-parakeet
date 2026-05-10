import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, UploadCloud, HardDrive, FolderTree } from 'lucide-react';
import { DrawingPreview } from '@/components/drawings/DrawingPreview';

interface DashboardStats {
  total_drawings: number;
  today_uploads: number;
  storage_used: number;
  top_categories: Array<{ category_id: number; category_name: string; count: number }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentDrawings, setRecentDrawings] = useState<any[]>([]);
  const [previewDrawing, setPreviewDrawing] = useState<any | null>(null);

  useEffect(() => {
    fetchStats();
    fetchRecent();
  }, []);

  const fetchStats = async () => {
    try {
      const token = (window as any).__SUPABASE_ACCESS_TOKEN__ || getCookie('access_token');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecent = async () => {
    try {
      const token = (window as any).__SUPABASE_ACCESS_TOKEN__ || getCookie('access_token');
      const response = await fetch('/api/dashboard/recent?limit=6', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setRecentDrawings(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch recent drawings:', error);
    }
  };

  const statCards = [
    {
      title: '图纸总数',
      value: stats?.total_drawings || 0,
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      title: '今日上传',
      value: stats?.today_uploads || 0,
      icon: UploadCloud,
      color: 'text-green-500',
    },
    {
      title: '存储空间',
      value: formatFileSize(stats?.storage_used),
      icon: HardDrive,
      color: 'text-purple-500',
    },
    {
      title: '分类数量',
      value: stats?.top_categories.length || 0,
      icon: FolderTree,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">仪表盘</h1>
        <p className="text-muted-foreground">欢迎使用图纸云档管理系统</p>
      </div>
      
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-slate-100 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>热门分类 Top 5</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.top_categories && stats.top_categories.length > 0 ? (
                  <div className="space-y-3">
                    {stats.top_categories.map((cat, index) => (
                      <div key={cat.category_id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {index + 1}
                          </div>
                          <span>{cat.category_name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{cat.count} 个图纸</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">暂无分类数据</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>最近访问</CardTitle>
              </CardHeader>
              <CardContent>
                {recentDrawings.length > 0 ? (
                  <div className="space-y-3">
                    {recentDrawings.map((drawing) => (
                      <div
                        key={drawing.id}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded cursor-pointer"
                        onClick={() => setPreviewDrawing(drawing)}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">{drawing.name}</div>
                            <div className="text-xs text-muted-foreground">{drawing.file_name}</div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(drawing.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">暂无访问记录</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      <DrawingPreview
        drawing={previewDrawing}
        open={!!previewDrawing}
        onOpenChange={(open) => !open && setPreviewDrawing(null)}
      />
    </div>
  );
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '-';
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = bytes;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

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

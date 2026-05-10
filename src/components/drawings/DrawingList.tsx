import { useEffect, useState } from 'react';
import { useDrawingStore } from '@/stores/drawingStore';
import { DrawingFilters } from './DrawingFilters';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Eye,
  Download,
  MoreVertical,
  Trash2,
  FileText,
  Grid3X3,
  List,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface DrawingListProps {
  onPreview: (drawing: any) => void;
  onUpload: () => void;
}

export function DrawingList({ onPreview }: DrawingListProps) {
  const {
    drawings,
    isLoading,
    fetchDrawings,
    deleteDrawing,
    batchDeleteDrawings,
    filters,
    page,
    setPage,
    total,
    limit,
  } = useDrawingStore();
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLocalLoading(true);
      try {
        await fetchDrawings();
      } catch (error) {
        console.error('Failed to load drawings:', error);
      } finally {
        setLocalLoading(false);
      }
    };
    
    loadData();
  }, [filters, page]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(drawings.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此图纸吗？')) return;
    
    try {
      await deleteDrawing(id);
    } catch (error) {
      alert('删除失败：' + (error as Error).message);
    }
  };

  const handleBatchDelete = async () => {
    if (!confirm(`确定要删除选中的 ${selectedIds.length} 个图纸吗？`)) return;
    
    try {
      await batchDeleteDrawings(selectedIds);
      setSelectedIds([]);
    } catch (error) {
      alert('批量删除失败：' + (error as Error).message);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: 'bg-gray-500',
      published: 'bg-green-500',
      archived: 'bg-blue-500',
      obsolete: 'bg-red-500',
    };
    
    const statusTextMap: Record<string, string> = {
      draft: '草稿',
      published: '已发布',
      archived: '已归档',
      obsolete: '已废弃',
    };
    
    return (
      <Badge className={statusMap[status] || 'bg-gray-500'}>
        {statusTextMap[status] || status}
      </Badge>
    );
  };

  const getFileFormatIcon = (format: string) => {
    const colorMap: Record<string, string> = {
      PDF: 'text-red-500',
      DWG: 'text-blue-500',
      DXF: 'text-green-500',
    };
    
    return (
      <div className={`flex items-center justify-center w-8 h-8 rounded bg-slate-100 ${colorMap[format?.toUpperCase()] || 'text-slate-600'}`}>
        <FileText className="h-4 w-4" />
      </div>
    );
  };

  if (localLoading || isLoading) {
    return (
      <div className="space-y-4">
        <DrawingFilters />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DrawingFilters />
      
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border">
          <span className="text-sm text-muted-foreground">
            已选择 {selectedIds.length} 个图纸
          </span>
          <Button variant="outline" size="sm" onClick={handleBatchDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            批量删除
          </Button>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          共 {total} 条记录
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-slate-100' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-slate-100' : ''}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {viewMode === 'list' ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.length === drawings.length && drawings.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>图纸名称</TableHead>
                <TableHead>编号</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>版本</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>大小</TableHead>
                <TableHead>上传时间</TableHead>
                <TableHead>下载</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drawings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12">
                    <div className="text-muted-foreground">暂无图纸，点击上方上传或拖拽文件到此处</div>
                  </TableCell>
                </TableRow>
              ) : (
                drawings.map((drawing) => (
                  <TableRow key={drawing.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(drawing.id)}
                        onCheckedChange={(checked) => handleSelectOne(drawing.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getFileFormatIcon(drawing.file_format || '')}
                        <div>
                          <div className="font-medium">{drawing.name}</div>
                          <div className="text-xs text-muted-foreground">{drawing.file_name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{drawing.code || '-'}</TableCell>
                    <TableCell>{(drawing as any).category_name || '-'}</TableCell>
                    <TableCell>{drawing.version || 'v1.0'}</TableCell>
                    <TableCell>{getStatusBadge(drawing.status || 'published')}</TableCell>
                    <TableCell>{formatFileSize(drawing.file_size)}</TableCell>
                    <TableCell>
                      {drawing.created_at ? formatDistanceToNow(new Date(drawing.created_at), {
                        addSuffix: true,
                        locale: zhCN,
                      }) : '-'}
                    </TableCell>
                    <TableCell>{drawing.download_count || 0}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onPreview(drawing)}>
                            <Eye className="h-4 w-4 mr-2" />
                            预览
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            下载
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(drawing.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {drawings.map((drawing) => (
            <div
              key={drawing.id}
              className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onPreview(drawing)}
            >
              <div className="aspect-video bg-slate-100 rounded mb-3 flex items-center justify-center">
                {getFileFormatIcon(drawing.file_format || '')}
              </div>
              <div className="font-medium truncate mb-1">{drawing.name}</div>
              <div className="text-xs text-muted-foreground mb-2">{drawing.file_name}</div>
              <div className="flex items-center justify-between">
                {getStatusBadge(drawing.status || 'published')}
                <span className="text-xs text-muted-foreground">{drawing.version || 'v1.0'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {total > limit && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            上一页
          </Button>
          <span className="text-sm">
            第 {page} 页 / 共 {Math.ceil(total / limit)} 页
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => setPage(page + 1)}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes?: number | null): string {
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

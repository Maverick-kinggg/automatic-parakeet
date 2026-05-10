import { useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  User,
  HardDrive,
} from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface DrawingPreviewProps {
  drawing: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export function DrawingPreview({
  drawing,
  open,
  onOpenChange,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}: DrawingPreviewProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      } else if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, hasNext, hasPrevious, onNext, onPrevious, onOpenChange]);

  const handleDownload = async () => {
    if (!drawing) return;
    
    try {
      const token = (window as any).__SUPABASE_ACCESS_TOKEN__ || getCookie('access_token');
      const response = await fetch(`/api/drawings/${drawing.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      window.open(result.data.download_url, '_blank');
    } catch (error) {
      alert('下载失败：' + (error as Error).message);
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
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-slate-100 ${colorMap[format?.toUpperCase()] || 'text-slate-600'}`}>
        <FileText className="h-6 w-6" />
      </div>
    );
  };

  if (!drawing) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[80%] max-w-[1200px] p-0 flex flex-col">
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!hasPrevious}
                  onClick={onPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!hasNext}
                  onClick={onNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <SheetTitle className="text-left">{drawing.name}</SheetTitle>
                <SheetDescription className="text-left">
                  {drawing.file_name} · {drawing.version}
                </SheetDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {getStatusBadge(drawing.status)}
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                下载
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 bg-slate-100 flex items-center justify-center p-6">
            <div className="aspect-video bg-white rounded-lg shadow-lg flex items-center justify-center">
              {getFileFormatIcon(drawing.file_format)}
              <div className="ml-4 text-muted-foreground">
                <p>在线预览功能需要集成 PDF 查看器</p>
                <p className="text-sm">当前格式：{drawing.file_format}</p>
              </div>
            </div>
          </div>
          
          <ScrollArea className="w-80 border-l">
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-3">详细信息</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">文件名</div>
                      <div className="text-sm">{drawing.file_name}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <HardDrive className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">文件大小</div>
                      <div className="text-sm">{formatFileSize(drawing.file_size)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">上传时间</div>
                      <div className="text-sm">
                        {format(new Date(drawing.created_at), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">上传者</div>
                      <div className="text-sm">{drawing.emp_id}</div>
                    </div>
                  </div>
                  
                  {(drawing as any).category_name && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">分类</div>
                        <div className="text-sm">{(drawing as any).category_name}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <Download className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">下载次数</div>
                      <div className="text-sm">{drawing.download_count || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {drawing.description && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">描述</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {drawing.description}
                    </p>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
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

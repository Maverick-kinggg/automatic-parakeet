
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link, useLocation } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopBarProps {
  onUpload?: () => void;
}

export function TopBar({ onUpload }: TopBarProps) {
  const location = useLocation();
  
  const getPathName = (path: string) => {
    const pathMap: Record<string, string> = {
      '/': '仪表盘',
      '/drawings': '图纸管理',
      '/categories': '分类管理',
      '/downloads': '下载记录',
    };
    return pathMap[path] || '未知页面';
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b px-6">
      <SidebarTrigger className="-ml-2" />
      <Separator orientation="vertical" className="h-6" />
      
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">首页</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{getPathName(location.pathname)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center gap-2">
        <Button onClick={onUpload} className="gap-2">
          <UploadCloud className="h-4 w-4" />
          上传图纸
        </Button>
      </div>
    </header>
  );
}

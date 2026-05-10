
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Download,
} from 'lucide-react';

const menuItems = [
  {
    title: '仪表盘',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: '图纸管理',
    url: '/drawings',
    icon: FileText,
  },
  {
    title: '分类管理',
    url: '/categories',
    icon: FolderTree,
  },
  {
    title: '下载记录',
    url: '/downloads',
    icon: Download,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const currentUser = (window as any).__CURRENT_USER__ || {};

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">图纸云档</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>主导航</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {currentUser.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser.name || '用户'}</p>
            <p className="text-xs text-muted-foreground truncate">{currentUser.account || ''}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

import { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Outlet } from 'react-router-dom';
import { DrawingUpload } from '@/components/drawings/DrawingUpload';

export default function AppLayout() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <TopBar onUpload={() => setUploadOpen(true)} />
        <main className="flex-1 p-6 bg-slate-50">
          <Outlet />
        </main>
      </SidebarInset>
      
      <DrawingUpload
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={() => {
          window.location.reload();
        }}
      />
    </SidebarProvider>
  );
}

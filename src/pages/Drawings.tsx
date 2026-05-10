import { useState } from 'react';
import { DrawingList } from '@/components/drawings/DrawingList';
import { DrawingPreview } from '@/components/drawings/DrawingPreview';
import { DrawingUpload } from '@/components/drawings/DrawingUpload';
import { useDrawingStore } from '@/stores/drawingStore';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';

export default function Drawings() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const { drawings, setSelectedDrawing, fetchDrawings } = useDrawingStore();
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  const handlePreview = (drawing: any) => {
    setSelectedDrawing(drawing);
    const index = drawings.findIndex((d) => d.id === drawing.id);
    setCurrentPreviewIndex(index);
    setPreviewOpen(true);
  };

  const handleNext = () => {
    if (currentPreviewIndex < drawings.length - 1) {
      const nextIndex = currentPreviewIndex + 1;
      setCurrentPreviewIndex(nextIndex);
      setSelectedDrawing(drawings[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentPreviewIndex > 0) {
      const prevIndex = currentPreviewIndex - 1;
      setCurrentPreviewIndex(prevIndex);
      setSelectedDrawing(drawings[prevIndex]);
    }
  };

  const selectedDrawing = drawings[currentPreviewIndex];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">图纸管理</h1>
          <p className="text-muted-foreground">管理和查看企业图纸文件</p>
        </div>
        
        <Button onClick={() => setUploadOpen(true)} className="gap-2">
          <UploadCloud className="h-4 w-4" />
          上传图纸
        </Button>
      </div>
      
      <DrawingList onPreview={handlePreview} onUpload={() => setUploadOpen(true)} />
      
      <DrawingPreview
        drawing={selectedDrawing || null}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={currentPreviewIndex < drawings.length - 1}
        hasPrevious={currentPreviewIndex > 0}
      />
      
      <DrawingUpload
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={() => {
          fetchDrawings();
        }}
      />
    </div>
  );
}

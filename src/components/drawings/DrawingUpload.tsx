import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, X } from 'lucide-react';
import { useCategoryStore } from '@/stores/categoryStore';

interface DrawingUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DrawingUpload({ open, onOpenChange, onSuccess }: DrawingUploadProps) {
  const { flatCategories } = useCategoryStore();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category_id: '',
    version: 'v1.0',
    description: '',
  });

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setFormData((prev) => ({
        ...prev,
        name: selectedFile.name.replace(/\.[^/.]+$/, ''),
      }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/vnd.dwg': ['.dwg'],
      'image/vnd.dxf': ['.dxf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      const token = (window as any).__SUPABASE_ACCESS_TOKEN__ || getCookie('access_token');
      
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('name', formData.name);
      formDataObj.append('code', formData.code);
      formDataObj.append('category_id', formData.category_id);
      formDataObj.append('version', formData.version);
      formDataObj.append('description', formData.description);
      
      const uploadResponse = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataObj,
      });
      
      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }
      
      setProgress(50);
      
      const drawingData = {
        name: formData.name,
        code: formData.code,
        category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
        file_path: uploadResult.data.path,
        file_name: file.name,
        file_size: file.size,
        file_format: file.name.split('.').pop()?.toUpperCase(),
        version: formData.version,
        description: formData.description,
      };
      
      const createResponse = await fetch('/api/drawings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drawingData),
      });
      
      const createResult = await createResponse.json();
      
      if (!createResult.success) {
        throw new Error(createResult.error);
      }
      
      setProgress(100);
      
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        setFile(null);
        setFormData({
          name: '',
          code: '',
          category_id: '',
          version: 'v1.0',
          description: '',
        });
        onOpenChange(false);
        onSuccess();
      }, 500);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('上传失败：' + (error as Error).message);
      setUploading(false);
      setProgress(0);
    }
  };

  const handleClose = () => {
    setFile(null);
    setFormData({
      name: '',
      code: '',
      category_id: '',
      version: 'v1.0',
      description: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>上传图纸</DialogTitle>
          <DialogDescription>
            支持 PDF、DWG、DXF、PNG、JPG 格式
          </DialogDescription>
        </DialogHeader>
        
        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-primary font-medium">释放文件以上传...</p>
            ) : (
              <>
                <p className="font-medium mb-2">拖拽文件到此处，或点击选择文件</p>
                <p className="text-sm text-muted-foreground">单个文件，最大 100MB</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {file.name.split('.').pop()?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">图纸名称 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入图纸名称"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">图纸编号</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="请输入图纸编号"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">无分类</SelectItem>
                    {flatCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="version">版本号</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="v1.0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请输入图纸描述（可选）"
                rows={3}
              />
            </div>
            
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>上传中...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            取消
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? '上传中...' : '开始上传'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatFileSize(bytes: number): string {
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

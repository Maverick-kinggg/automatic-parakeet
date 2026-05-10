import React from 'react';
import { useDrawingStore } from '@/stores/drawingStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function DrawingFilters() {
  const { filters, setFilters } = useDrawingStore();
  const { flatCategories } = useCategoryStore();

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, keyword: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setFilters({ 
      ...filters, 
      category_id: value === 'all' ? undefined : parseInt(value, 10),
    });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ 
      ...filters, 
      status: value === 'all' ? undefined : value,
    });
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = filters.keyword || filters.category_id || filters.status;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="搜索图纸名称或编号..."
        value={filters.keyword || ''}
        onChange={handleKeywordChange}
        className="w-64"
      />
      
      <Select
        value={filters.category_id?.toString() || 'all'}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="全部分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部分类</SelectItem>
          {flatCategories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={filters.status || 'all'}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="全部状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          <SelectItem value="draft">草稿</SelectItem>
          <SelectItem value="published">已发布</SelectItem>
          <SelectItem value="archived">已归档</SelectItem>
          <SelectItem value="obsolete">已废弃</SelectItem>
        </SelectContent>
      </Select>
      
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          <X className="h-4 w-4 mr-1" />
          清空筛选
        </Button>
      )}
    </div>
  );
}

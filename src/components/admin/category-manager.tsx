import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { Category } from '@/lib/types';

interface CategoryManagerProps {
  categories: Category[];
  onCreateCategory: (category: Omit<Category, '_id'>) => Promise<void>;
  onUpdateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

export function CategoryManager({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#3B82F6', // Default blue color
    sourceUrls: [],
    isActive: true,
  });
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateCategory(newCategory);
    setNewCategory({
      name: '',
      description: '',
      color: '#3B82F6',
      sourceUrls: [],
      isActive: true
    });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await onUpdateCategory(editingCategory._id, editingCategory);
      setEditingCategory(null);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Categories</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <Input
                placeholder="Category Name"
                value={newCategory.name}
                onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={newCategory.description}
                onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
              />
              <div className="flex items-center space-x-2">
                <label className="text-sm">Color:</label>
                <Input
                  type="color"
                  value={newCategory.color}
                  onChange={e => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-20 h-8 p-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newCategory.isActive}
                  onCheckedChange={checked => setNewCategory({ ...newCategory, isActive: checked })}
                />
                <span>Active</span>
              </div>
              <Button type="submit" className="w-full">Create Category</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {categories.map(category => (
            <Card key={category._id} className="p-4 relative">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{category.name}</h3>
                    <Badge variant={category.isActive ? 'default' : 'secondary'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {category.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteCategory(category._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <Input
                placeholder="Category Name"
                value={editingCategory.name}
                onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={editingCategory.description}
                onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
              />
              <div className="flex items-center space-x-2">
                <label className="text-sm">Color:</label>
                <Input
                  type="color"
                  value={editingCategory.color}
                  onChange={e => setEditingCategory({ ...editingCategory, color: e.target.value })}
                  className="w-20 h-8 p-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingCategory.isActive}
                  onCheckedChange={checked => setEditingCategory({ ...editingCategory, isActive: checked })}
                />
                <span>Active</span>
              </div>
              <Button type="submit" className="w-full">Update Category</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

import { useState, useCallback } from 'react';
import type { BlogPost } from '@/lib/types'; // Corrected import path
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Save, Trash2, Eye } from 'lucide-react';
import PreviewModal from '@/components/admin/preview-modal';

interface PostEditorProps {
  post: BlogPost;
  categories: string[];
  onSave: (post: BlogPost) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  isNew?: boolean;
}

export function PostEditor({
  post: initialPost,
  categories,
  onSave,
  onDelete,
  isNew = false,
}: PostEditorProps) {
  const [post, setPost] = useState<BlogPost>(initialPost);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = useCallback((field: keyof BlogPost, value: any) => {
    setPost(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(post);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete && post._id) {
      setIsDeleting(true);
      try {
        await onDelete(post._id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{isNew ? 'Create New Post' : 'Edit Post'}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          {!isNew && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this post? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={post.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Post title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={post.slug}
              onChange={e => handleChange('slug', e.target.value)}
              placeholder="post-url-slug"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={post.excerpt}
            onChange={e => handleChange('excerpt', e.target.value)}
            placeholder="Brief excerpt of the post"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={post.content}
            onChange={e => handleChange('content', e.target.value)}
            placeholder="Post content in markdown"
            rows={15}
            className="font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={post.category}
              onValueChange={value => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={post.status}
              onValueChange={value => handleChange('status', value as 'draft' | 'published')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={post.tags.join(', ')}
            onChange={e => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={post.featured}
            onCheckedChange={checked => handleChange('featured', checked)}
          />
          <Label>Featured Post</Label>
        </div>
      </Card>
      <PreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        post={post}
      />
    </div>
  );
}

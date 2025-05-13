"use client";

import { useState, useEffect } from 'react';
import type { BlogPost, Author } from '@/lib/types';
import { summarizeArticle, SummarizeArticleInput } from '@/ai/flows/summarize-article';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Save, Eye, Trash2, XCircle } from 'lucide-react';
import PreviewModal from './preview-modal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


interface ContentEditorProps {
  post: BlogPost;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
  onDelete: (postId: string) => void;
  isNewPost: boolean;
  allCategories: string[];
  allTags: string[]; // For suggestions, or could be free-form
}

export default function ContentEditor({
  post,
  onSave,
  onCancel,
  onDelete,
  isNewPost,
  allCategories,
  allTags,
}: ContentEditorProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [category, setCategory] = useState(post.category);
  const [tags, setTags] = useState(post.tags.join(', ')); // Comma-separated string for input
  const [status, setStatus] = useState<'draft' | 'published'>(post.status);
  const [imageUrl, setImageUrl] = useState(post.imageUrl || '');
  const [slug, setSlug] = useState(post.slug);


  const [aiInput, setAiInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setTitle(post.title);
    setContent(post.content);
    setExcerpt(post.excerpt);
    setCategory(post.category);
    setTags(post.tags.join(', '));
    setStatus(post.status);
    setImageUrl(post.imageUrl || '');
    setSlug(post.slug);
  }, [post]);

  const handleGenerateWithAI = async () => {
    if (!aiInput.trim()) {
      toast({ title: 'Error', description: 'Please enter content or a URL for AI generation.', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    try {
      const summaryInput: SummarizeArticleInput = { content: aiInput };
      const result = await summarizeArticle(summaryInput);
      setTitle(result.title);
      // For HTML content, we might need a way to convert markdown or plain text to HTML,
      // or adjust the AI prompt to return HTML. For now, wrapping in <p>.
      setContent(`<p>${result.body.replace(/\n/g, '</p><p>')}</p>`); 
      setExcerpt(result.body.substring(0, 150) + '...'); // Simple excerpt
      setCategory(allCategories.includes(result.category) ? result.category : allCategories[0] || '');
      setTags(result.tags); // Assuming tags are comma-separated string from AI
      toast({ title: 'Content Generated', description: 'AI has populated the fields.' });
    } catch (error) {
      console.error('AI generation error:', error);
      toast({ title: 'AI Error', description: 'Failed to generate content.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPost: BlogPost = {
      ...post,
      title,
      content,
      excerpt,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      status,
      imageUrl,
      slug, // Slug might need to be regenerated if title changes, especially for new posts
      publishDate: status === 'published' && post.status === 'draft' ? new Date().toISOString() : post.publishDate, // Update publish date if moving to published
    };
    onSave(updatedPost);
  };

  const currentPreviewPost: BlogPost = {
    ...post, title, content, excerpt, category, tags: tags.split(',').map(t=>t.trim()), status, imageUrl, slug
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isNewPost ? 'Create New Post' : 'Edit Post'}</CardTitle>
          <CardDescription>
            {isNewPost ? 'Fill in the details for your new article.' : `Editing: ${post.title}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="aiInput">AI Content Source (URL or Text)</Label>
                    <Textarea
                    id="aiInput"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Enter a URL (e.g., https://example.com/article) or paste text here..."
                    rows={3}
                    />
                </div>
                <div className="flex items-end">
                    <Button onClick={handleGenerateWithAI} disabled={isGenerating} className="w-full md:w-auto">
                    {isGenerating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Generate with AI
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="slug">Slug (URL Path)</Label>
                    <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g., my-awesome-post" />
                    <p className="text-xs text-muted-foreground mt-1">If blank, will be auto-generated from title on save.</p>
                </div>
                <div>
                    <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
                    <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
                </div>
                <div>
                    {/* This is a basic content field. For rich text, a dedicated editor (e.g., Tiptap, TinyMCE) would be integrated. */}
                    <Label htmlFor="content">Content (HTML allowed)</Label>
                    <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={15} 
                    placeholder="Write your post content here. You can use HTML tags for formatting."/>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={(value) => setCategory(value)}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {allCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., tech, ai, news" />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={status} onValueChange={(value: 'draft' | 'published') => setStatus(value)}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row justify-end gap-2 pt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button type="button" variant="secondary" onClick={() => setIsPreviewOpen(true)}>
                    <Eye className="mr-2 h-4 w-4" /> Preview
                </Button>
                {!isNewPost && (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the post titled "{post.title}".
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(post.id)} className="bg-destructive hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> {isNewPost ? 'Create Post' : 'Save Changes'}
                </Button>
            </CardFooter>
        </Card>
      </form>
      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        post={currentPreviewPost} 
      />
    </div>
  );
}

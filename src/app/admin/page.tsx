'use client';

import { useState, useEffect } from 'react';
import { BlogAPI } from '@/lib/api-client';
import type { BlogPost, Category, SafetySetting, HarmCategory, SafetyThreshold } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Loader2, Settings, FolderPlus } from 'lucide-react';
import { DashboardStats } from '@/components/admin/dashboard-stats';
import { CategoryManager } from '@/components/admin/category-manager';
import { PostEditor } from '@/components/admin/post-editor';
import PostListSidebar from '@/components/admin/post-list-sidebar';
import AiConfigurationCard from '@/components/admin/ai-configuration';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

export default function AdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();

  // Dashboard metrics
  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
    draftPosts: posts.filter(p => p.status === 'draft').length,
    totalCategories: categories.length,
  };
  // AI configuration state
  const [sourceSites, setSourceSites] = useState<string[]>([]);
  const [safetySettings] = useState<SafetySetting[]>([
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  ]);

  const handleAddSourceSite = (site: string) => {
    setSourceSites(prev => [...prev, site]);
  };

  const handleRemoveSourceSite = (site: string) => {
    setSourceSites(prev => prev.filter(s => s !== site));
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {      try {
        const [postsData, categoriesData] = await Promise.all([
          BlogAPI.getPosts({}),
          BlogAPI.getCategories()
        ]);
        setPosts(postsData.posts);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleSelectPost = async (postId: string) => {
    try {
      const post = await BlogAPI.getPost(postId);
      setSelectedPost(post);
      setIsCreatingNew(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: 'Error',
        description: 'Failed to load post',
        variant: 'destructive',
      });
    }
  };
  const handleCreateNewPost = () => {
    setSelectedPost({
      _id: '', // Will be set by server
      title: '',
      excerpt: '',
      content: '',
      summary: '',
      author: { name: 'Admin' },
      publishDate: new Date().toISOString(),
      tags: [],
      category: categories[0]?.name || '',
      status: 'draft',
      slug: '',
      featured: false
    });
    setIsCreatingNew(true);
  };
  const handleSavePost = async (postData: BlogPost) => {
    setIsSaving(true);
    try {
      let savedPost;
      if (isCreatingNew) {
        savedPost = await BlogAPI.createPost(postData);
        toast({
          title: 'Success',
          description: 'Post created successfully',
        });
      } else {
        savedPost = await BlogAPI.updatePost(postData._id, postData);
        toast({
          title: 'Success',
          description: 'Post updated successfully',
        });
      }
      setPosts(prev => isCreatingNew ? [savedPost, ...prev] : prev.map(p => p._id === savedPost._id ? savedPost : p));
      setSelectedPost(savedPost);
      setIsCreatingNew(false);
    } catch (error) {
      console.error('Error saving post:', error);      toast({
        title: 'Error',
        description: 'Failed to save post',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateCategory = async (category: Omit<Category, '_id'>) => {
    try {
      const newCategory = await BlogAPI.createCategory(category);
      setCategories([...categories, newCategory]);
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCategory = async (id: string, category: Partial<Category>) => {
    try {
      const updatedCategory = await BlogAPI.updateCategory(id, category);
      setCategories(categories.map(c => c._id === id ? updatedCategory : c));
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await BlogAPI.deleteCategory(id);
      setCategories(categories.filter(c => c._id !== id));
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePost = async (id: string) => {
    setIsDeleting(true);
    try {
      await BlogAPI.deletePost(id);
      setPosts(prev => prev.filter(p => p._id !== id));
      setSelectedPost(null);
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [postsData, categoriesData] = await Promise.all([
        BlogAPI.getPosts({
          page: 1,
          limit: 50
        }),
        BlogAPI.getCategories()
      ]);
      setPosts(postsData.posts);
      setCategories(categoriesData);
      toast({
        title: 'Success',
        description: 'Data refreshed successfully',
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center space-x-4">
            <TabsList className="bg-card">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="posts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Posts
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Categories
              </TabsTrigger>
              <TabsTrigger value="ai-config" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                AI Settings
              </TabsTrigger>
            </TabsList>
            {activeTab === 'posts' && (
              <Button onClick={handleCreateNewPost}>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="dashboard" className="space-y-4">
          <DashboardStats
            totalPosts={stats.totalPosts}
            publishedPosts={stats.publishedPosts}
            draftPosts={stats.draftPosts}
            totalCategories={stats.totalCategories}
            isLoading={isLoading}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Latest updates from your blog</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {posts.slice(0, 10).map(post => (
                      <div key={post._id} className="flex items-start space-x-4 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                        {post.imageUrl && (
                          <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-1">
                          <h3 className="font-medium leading-none">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.publishDate).toLocaleDateString()}
                          </p>
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Content performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Published/Draft Ratio</span>
                      <span className="text-2xl font-bold">
                        {((stats.publishedPosts / (stats.totalPosts || 1)) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(stats.publishedPosts / (stats.totalPosts || 1)) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" onClick={handleCreateNewPost}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Post
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => setActiveTab('categories')}>
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Manage Categories
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => setActiveTab('ai-config')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Configure AI
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <Card className="p-4">
                <PostListSidebar
                  posts={posts}
                  selectedPostId={selectedPost?._id || null}
                  onSelectPost={handleSelectPost}
                  onCreateNew={handleCreateNewPost}
                />
              </Card>
            </div>
            <div className="col-span-3">
              {selectedPost ? (
                <PostEditor
                  post={selectedPost}
                  categories={categories.map(c => c.name)}
                  onSave={handleSavePost}
                  onDelete={handleDeletePost}
                  isNew={isCreatingNew}
                />
              ) : (
                <Card className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">Welcome to Post Management</h3>
                    <p className="text-muted-foreground">
                      Select a post from the sidebar to edit or create a new one.
                    </p>
                    <Button onClick={handleCreateNewPost}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Post
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager
            categories={categories}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </TabsContent>

        <TabsContent value="ai-config">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Configure AI settings and manage content generation sources
              </CardDescription>
            </CardHeader>
            <CardContent>              <AiConfigurationCard
                modelName="GPT-4"
                sourceSites={sourceSites}
                onAddSourceSite={handleAddSourceSite}
                onRemoveSourceSite={handleRemoveSourceSite}
                safetySettings={safetySettings}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <Card className="w-[300px]">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading dashboard...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


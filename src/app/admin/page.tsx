'use client';

import { useState, useEffect } from 'react';
import type { BlogPost } from '@/lib/types';
import { BLOG_POSTS as initialPosts, CATEGORIES, TAGS } from '@/lib/mock-data';
import PostListSidebar from '@/components/admin/post-list-sidebar';
import ContentEditor from '@/components/admin/content-editor';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper to generate a unique ID (for new posts)
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function AdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const { toast } = useToast();

  const handleSelectPost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    setSelectedPost(post || null);
    setIsCreatingNew(false);
  };

  const handleCreateNewPost = () => {
    setSelectedPost({
      id: generateId(), // Temporary ID for new post
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      author: { name: 'Admin User' }, // Default author
      publishDate: new Date().toISOString(),
      tags: [],
      category: CATEGORIES[0] || '',
      status: 'draft',
    });
    setIsCreatingNew(true);
  };
  
  const handleDeselectPost = () => {
    setSelectedPost(null);
    setIsCreatingNew(false);
  }

  const handleSavePost = (updatedPost: BlogPost) => {
    if (isCreatingNew) {
      // Add new post
      // Simple slug generation, replace with a robust library in production
      const slug = updatedPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      const newPostWithSlug = { ...updatedPost, slug: slug || `post-${updatedPost.id}` };
      setPosts(prevPosts => [newPostWithSlug, ...prevPosts]);
      setSelectedPost(newPostWithSlug);
      setIsCreatingNew(false);
      toast({ title: "Post Created", description: `"${updatedPost.title}" has been created as a draft.` });
    } else {
      // Update existing post
      setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
      setSelectedPost(updatedPost); // Keep the updated post selected
      toast({ title: "Post Updated", description: `"${updatedPost.title}" has been saved.` });
    }
  };

  const handleDeletePost = (postId: string) => {
    const postToDelete = posts.find(p => p.id === postId);
    if (!postToDelete) return;

    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    if (selectedPost?.id === postId) {
      setSelectedPost(null);
      setIsCreatingNew(false);
    }
    toast({ title: "Post Deleted", description: `"${postToDelete.title}" has been deleted.`, variant: "destructive" });
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-muted/30"> {/* Adjust height based on Navbar */}
      <PostListSidebar
        posts={posts}
        selectedPostId={selectedPost?.id || null}
        onSelectPost={handleSelectPost}
        onCreateNew={handleCreateNewPost}
      />
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedPost ? (
          <ContentEditor
            key={selectedPost.id} // Ensures re-render when post changes
            post={selectedPost}
            onSave={handleSavePost}
            onCancel={handleDeselectPost}
            onDelete={handleDeletePost}
            isNewPost={isCreatingNew}
            allCategories={CATEGORIES}
            allTags={TAGS}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg">
              <h2 className="text-2xl font-semibold text-muted-foreground mb-4">Welcome to the Admin Dashboard</h2>
              <p className="text-muted-foreground mb-6">Select a post from the sidebar to edit, or create a new one.</p>
              <Button onClick={handleCreateNewPost} size="lg">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Post
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

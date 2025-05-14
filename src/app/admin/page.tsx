
'use client';

import { useState, useEffect } from 'react';
import type { BlogPost } from '@/lib/types';
import { BLOG_POSTS as globalBlogPosts, CATEGORIES as globalCategories, TAGS as globalTags } from '@/lib/mock-data';
import PostListSidebar from '@/components/admin/post-list-sidebar';
import ContentEditor from '@/components/admin/content-editor';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper to generate a unique ID (for new posts)
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function AdminPage() {
  // Local state for admin page UI, initialized from global state
  // This state is used to drive the PostListSidebar and ensure it re-renders.
  const [postsForAdminView, setPostsForAdminView] = useState<BlogPost[]>([...globalBlogPosts]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const { toast } = useToast();

  // Function to refresh the admin page's view of posts from the global source
  const refreshAdminViewPosts = () => {
    setPostsForAdminView([...globalBlogPosts]);
  };

  const handleSelectPost = (postId: string) => {
    const post = globalBlogPosts.find(p => p.id === postId); // Read from global
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
      category: globalCategories[0] || '', // Default to first global category
      status: 'draft',
    });
    setIsCreatingNew(true);
  };
  
  const handleDeselectPost = () => {
    setSelectedPost(null);
    setIsCreatingNew(false);
  }

  const handleSavePost = (updatedPostData: BlogPost) => {
    let finalPost = { ...updatedPostData };

    // Simple slug generation, replace with a robust library in production if needed
    if (!finalPost.slug && finalPost.title) {
        finalPost.slug = finalPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    if (!finalPost.slug) { // Fallback slug if title is empty or only contains special chars
        finalPost.slug = `post-${finalPost.id}`;
    }


    if (isCreatingNew) {
      globalBlogPosts.unshift(finalPost); // Add to global array (top for visibility)
      toast({ title: "Post Created", description: `"${finalPost.title}" has been created.` });
    } else {
      const postIndex = globalBlogPosts.findIndex(p => p.id === finalPost.id);
      if (postIndex > -1) {
        globalBlogPosts[postIndex] = finalPost; // Update in global array
        toast({ title: "Post Updated", description: `"${finalPost.title}" has been saved.` });
      } else {
        // This case should ideally not happen if a post is selected for editing.
        // If it's a new post that wasn't properly added, treat as new.
        globalBlogPosts.unshift(finalPost);
        toast({ title: "Post Created", description: `"${finalPost.title}" was newly created as update failed.` });
      }
    }

    // Update global CATEGORIES and TAGS if new ones were added
    if (finalPost.category && !globalCategories.includes(finalPost.category)) {
      globalCategories.push(finalPost.category);
    }
    finalPost.tags.forEach(tag => {
      if (tag && !globalTags.includes(tag)) {
        globalTags.push(tag);
      }
    });
    
    // Sort global posts by publish date after modification
    globalBlogPosts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());


    refreshAdminViewPosts(); // Update the list in the admin sidebar
    setSelectedPost(finalPost); // Keep the saved post selected
    setIsCreatingNew(false);
  };

  const handleDeletePost = (postId: string) => {
    const postToDelete = globalBlogPosts.find(p => p.id === postId);
    if (!postToDelete) return;

    const postIndex = globalBlogPosts.findIndex(p => p.id === postId);
    if (postIndex > -1) {
      globalBlogPosts.splice(postIndex, 1); // Delete from global array
      toast({ title: "Post Deleted", description: `"${postToDelete.title}" has been deleted.`, variant: "destructive" });
    }

    refreshAdminViewPosts(); // Update the list in the admin sidebar
    if (selectedPost?.id === postId) {
      setSelectedPost(null);
      setIsCreatingNew(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-muted/30"> {/* Adjust height based on Navbar */}
      <PostListSidebar
        posts={postsForAdminView} // Use the local state that mirrors global for the sidebar view
        selectedPostId={selectedPost?.id || null}
        onSelectPost={handleSelectPost}
        onCreateNew={handleCreateNewPost}
      />
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedPost ? (
          <ContentEditor
            key={selectedPost.id + (isCreatingNew ? '-new' : '')} // Ensures re-render when post changes or mode changes
            post={selectedPost}
            onSave={handleSavePost}
            onCancel={handleDeselectPost}
            onDelete={handleDeletePost}
            isNewPost={isCreatingNew}
            allCategories={globalCategories} // Pass global, mutable categories
            allTags={globalTags} // Pass global, mutable tags
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

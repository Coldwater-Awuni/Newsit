// "use client";

// import { useState, useEffect } from 'react';
// import { BlogAPI } from '@/lib/api-client';
// import type { BlogPost } from '@/lib/types';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useToast } from '@/hooks/use-toast';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
// import { Loader2, Save, Trash2, Eye, X, Plus } from 'lucide-react';
// import PreviewModal from './preview-modal';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Badge } from '@/components/ui/badge';
// import Image from 'next/image';

// interface ContentEditorProps {
//   post: BlogPost;
//   onSave: (post: BlogPost) => void;
//   onCancel: () => void;
//   onDelete: (postId: string) => void;
//   isNewPost: boolean;
//   allCategories: string[];
//   allTags: string[];
// }

// export default function ContentEditor({
//   post,
//   onSave,
//   onCancel,
//   onDelete,
//   isNewPost,
//   allCategories,
//   allTags,
// }: ContentEditorProps) {
//   const [formData, setFormData] = useState(post);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [aiPrompt, setAiPrompt] = useState('');
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//   const [newTag, setNewTag] = useState('');
//   const { toast } = useToast();

//   useEffect(() => {
//     setFormData(post);
//   }, [post]);

//   const handleInputChange = (
//     field: keyof BlogPost,
//     value: string | string[] | { name: string; avatarUrl?: string }
//   ) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleGenerateContent = async () => {
//     if (!aiPrompt.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter a prompt or URL for content generation",
//         variant: "destructive"
//       });
//       return;
//     }

//     setIsGenerating(true);
//     try {
//       const result = await BlogAPI.generatePost({
//         keyword: aiPrompt,
//         category: formData.category,
//       });

//       setFormData(prev => ({
//         ...prev,
//         title: result.title,
//         content: result.content,
//         excerpt: result.excerpt || result.content.substring(0, 150) + '...',
//         tags: result.tags || [],
//       }));

//       toast({
//         title: "Success",
//         description: "Content generated successfully"
//       });
//     } catch (error) {
//       console.error('Error generating content:', error);
//       toast({
//         title: "Error",
//         description: "Failed to generate content",
//         variant: "destructive"
//       });
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>{isNewPost ? 'Create New Post' : 'Edit Post'}</CardTitle>
//           <CardDescription>
//             {isNewPost ? 'Create a new blog post' : `Editing: ${post.title}`}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* AI Generation Section */}
//           <div className="space-y-4">
//             <Label htmlFor="aiPrompt">AI Content Generation</Label>
//             <div className="flex gap-2">
//               <Textarea
//                 id="aiPrompt"
//                 placeholder="Enter a topic, keywords, or paste a URL to generate content..."
//                 value={aiPrompt}
//                 onChange={(e) => setAiPrompt(e.target.value)}
//                 className="flex-1"
//               />
//               <Button
//                 type="button"
//                 onClick={handleGenerateContent}
//                 disabled={isGenerating}
//                 variant="secondary"
//               >
//                 {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 Generate
//               </Button>
//             </div>
//           </div>

//           {/* Post Details */}
//           <div className="space-y-4">
//             {/* Title Input */}
//             <div>
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 value={formData.title}
//                 onChange={(e) => handleInputChange('title', e.target.value)}
//                 placeholder="Enter post title"
//                 required
//               />
//             </div>

//             {/* Excerpt Input */}
//             <div>
//               <Label htmlFor="excerpt">Excerpt</Label>
//               <Textarea
//                 id="excerpt"
//                 value={formData.excerpt}
//                 onChange={(e) => handleInputChange('excerpt', e.target.value)}
//                 placeholder="Brief description of the post"
//                 className="h-20"
//               />
//             </div>

//             {/* Main Content */}
//             <div>
//               <Label htmlFor="content">Content</Label>
//               <Textarea
//                 id="content"
//                 value={formData.content}
//                 onChange={(e) => handleInputChange('content', e.target.value)}
//                 placeholder="Write your post content here..."
//                 className="min-h-[300px]"
//               />
//             </div>

//             {/* Category Selection */}
//             <div>
//               <Label htmlFor="category">Category</Label>
//               <Select
//                 value={formData.category}
//                 onValueChange={(value) => handleInputChange('category', value)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {allCategories.map(category => (
//                     <SelectItem key={category} value={category}>
//                       {category}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Tags Input */}
//             <div>
//               <Label>Tags</Label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.tags.map(tag => (
//                   <Badge
//                     key={tag}
//                     variant="secondary"
//                     className="flex items-center gap-1"
//                   >
//                     {tag}
//                     <X
//                       className="h-3 w-3 cursor-pointer"
//                       onClick={() => handleInputChange('tags', formData.tags.filter(t => t !== tag))}
//                     />
//                   </Badge>
//                 ))}
//               </div>
//               <div className="flex gap-2">
//                 <Select
//                   value=""
//                   onValueChange={(value) => {
//                     if (!formData.tags.includes(value)) {
//                       handleInputChange('tags', [...formData.tags, value]);
//                     }
//                   }}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select existing tag" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {allTags
//                       .filter(tag => !formData.tags.includes(tag))
//                       .map(tag => (
//                         <SelectItem key={tag} value={tag}>
//                           {tag}
//                         </SelectItem>
//                       ))}
//                   </SelectContent>
//                 </Select>
//                 <div className="flex gap-2">
//                   <Input
//                     placeholder="Add new tag"
//                     value={newTag}
//                     onChange={(e) => setNewTag(e.target.value)}
//                     onKeyPress={(e) => {
//                       if (e.key === 'Enter' && newTag.trim()) {
//                         e.preventDefault();
//                         if (!formData.tags.includes(newTag.trim())) {
//                           handleInputChange('tags', [...formData.tags, newTag.trim()]);
//                         }
//                         setNewTag('');
//                       }
//                     }}
//                   />
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="icon"
//                     onClick={() => {
//                       if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
//                         handleInputChange('tags', [...formData.tags, newTag.trim()]);
//                         setNewTag('');
//                       }
//                     }}
//                   >
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* Image URL Input */}
//             <div>
//               <Label htmlFor="imageUrl">Featured Image URL</Label>
//               <Input
//                 id="imageUrl"
//                 value={formData.imageUrl || ''}
//                 onChange={(e) => handleInputChange('imageUrl', e.target.value)}
//                 placeholder="Enter image URL"
//               />
//               {formData.imageUrl && (
//                 <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden">
//                   <Image
//                     src={formData.imageUrl}
//                     alt="Preview"
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Post Status */}
//             <div>
//               <Label>Status</Label>
//               <RadioGroup
//                 value={formData.status}
//                 onValueChange={(value) => handleInputChange('status', value)}
//                 className="flex space-x-4"
//               >
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="draft" id="draft" />
//                   <Label htmlFor="draft">Draft</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="published" id="published" />
//                   <Label htmlFor="published">Published</Label>
//                 </div>
//               </RadioGroup>
//             </div>

//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <div className="flex gap-2">
//             <Button type="button" variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//             {!isNewPost && (
//               <Button
//                 type="button"
//                 variant="destructive"
//                 onClick={() => post._id && onDelete(post._id)}
//               >
//                 Delete
//               </Button>
//             )}
//           </div>
//           <div className="flex gap-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsPreviewOpen(true)}
//             >
//               Preview
//             </Button>
//             <Button type="submit">
//               {isNewPost ? 'Create' : 'Update'}
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>
//       <PreviewModal
//         isOpen={isPreviewOpen}
//         onClose={() => setIsPreviewOpen(false)}
//         post={formData}
//       />
//     </form>
//   );
// }

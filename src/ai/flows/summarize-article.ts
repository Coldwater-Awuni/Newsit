'use server';

/**
 * @fileOverview Summarizes content from a URL or text input into a draft blog post.
 *
 * - summarizeArticle - A function that handles the content summarization process.
 * - SummarizeArticleInput - The input type for the summarizeArticle function.
 * - SummarizeArticleOutput - The return type for the summarizeArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeArticleInputSchema = z.object({
  content: z.string().describe('The content to summarize, either a URL or text input.'),
});
export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

const SummarizeArticleOutputSchema = z.object({
  title: z.string().describe('The generated title for the blog post.'),
  body: z.string().describe('The summarized content of the blog post.'),
  tags: z.string().describe('Suggested tags for the blog post.'),
  category: z.string().describe('Suggested category for the blog post.'),
});
export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

export async function summarizeArticle(input: SummarizeArticleInput): Promise<SummarizeArticleOutput> {
  return summarizeArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeArticlePrompt',
  input: {schema: SummarizeArticleInputSchema},
  output: {schema: SummarizeArticleOutputSchema},
  prompt: `You are an expert blog post writer and content summarizer.

  You will be provided with content, and your job is to summarize it into a blog post.
  You will generate a title, a body, some tags, and a category for the blog post.

  Content: {{{content}}} `,
});

const summarizeArticleFlow = ai.defineFlow(
  {
    name: 'summarizeArticleFlow',
    inputSchema: SummarizeArticleInputSchema,
    outputSchema: SummarizeArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

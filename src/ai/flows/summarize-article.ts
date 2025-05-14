
'use server';

/**
 * @fileOverview Summarizes content from a URL or text input into a draft blog post,
 * with a focus on generating news-style articles.
 *
 * - summarizeArticle - A function that handles the content summarization process.
 * - SummarizeArticleInput - The input type for the summarizeArticle function.
 * - SummarizeArticleOutput - The return type for the summarizeArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeArticleInputSchema = z.object({
  content: z.string().describe('The content to summarize, either a URL to a news source or raw text.'),
});
export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

const SummarizeArticleOutputSchema = z.object({
  title: z.string().describe('The generated concise and informative title for the news article.'),
  body: z.string().describe('The summarized key facts and information in a news report style.'),
  tags: z.string().describe('Suggested tags relevant to the news topic (e.g., breaking, politics, tech-update).'),
  category: z.string().describe("The category for the post, which should be 'News'.").default('News'),
});
export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

export async function summarizeArticle(input: SummarizeArticleInput): Promise<SummarizeArticleOutput> {
  return summarizeArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNewsArticlePrompt', // Renamed for clarity
  input: {schema: SummarizeArticleInputSchema},
  output: {schema: SummarizeArticleOutputSchema},
  prompt: `You are an expert news editor tasked with generating draft news articles.
You will be provided with content, which could be a URL to a news source or raw text.
Your goal is to extract the key information and main news topic(s).
Based on this, generate a draft news post. The post must include:
1. A concise and informative title suitable for a news article.
2. A body summarizing the key facts and information in a news report style.
3. Suggested tags relevant to the news topic (e.g., breaking, politics, tech-update).
4. The category should be 'News'.

Prioritize factual reporting and clarity. If the content is a URL, summarize the linked page.

Content: {{{content}}}`,
});

const summarizeArticleFlow = ai.defineFlow(
  {
    name: 'summarizeNewsArticleFlow', // Renamed for clarity
    inputSchema: SummarizeArticleInputSchema,
    outputSchema: SummarizeArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure the category is 'News' if the model doesn't set it explicitly despite the prompt
    if (output && output.category !== 'News') {
      output.category = 'News';
    }
    return output!;
  }
);

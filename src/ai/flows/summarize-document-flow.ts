
'use server';
/**
 * @fileOverview A document summarization AI agent.
 *
 * - summarizeDocument - A function that handles document summarization.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentInputSchema = z.object({
  documentName: z.string().describe("The name or title of the document."),
  // In a real scenario, you might pass document content or a content hint.
  // For this example, we'll primarily use the name.
  // contentHint: z.string().optional().describe("A short hint about the document's content, if available."),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe("A concise 1-2 sentence summary of the document's likely purpose or content based on its name."),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: {schema: SummarizeDocumentInputSchema},
  output: {schema: SummarizeDocumentOutputSchema},
  prompt: `Given the document title "{{documentName}}", provide a very brief, plausible 1-2 sentence summary of what this document might be about. Please focus on common document types and their typical purposes.

For example:
- If the title is "Q3 Sales Report", a good summary would be "This document likely contains sales figures and performance analysis for the third quarter."
- If the title is "Employee NDA Phoenix Project", a summary could be "This is probably a non-disclosure agreement related to a confidential project codenamed Phoenix, intended for employees."
- If the title is "Handbook v3", the summary could be "This likely outlines company policies, procedures, and guidelines for employees, version 3."

Document Title: {{{documentName}}}
`,
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async (input) => {
    // In a real application, you might add more logic here,
    // e.g., fetch more context about the document if only an ID was passed.
    const {output} = await prompt(input);
    if (!output) {
        // Fallback or error handling if AI fails to generate output
        return { summary: "Could not generate summary for this document." };
    }
    return output;
  }
);

//Validate submission flow to validate that the input text area is not empty.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateSubmissionInputSchema = z.object({
  text: z.string().describe('The text to validate.'),
});
export type ValidateSubmissionInput = z.infer<typeof ValidateSubmissionInputSchema>;

const ValidateSubmissionOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the submission is valid or not.'),
});
export type ValidateSubmissionOutput = z.infer<typeof ValidateSubmissionOutputSchema>;

export async function validateSubmission(input: ValidateSubmissionInput): Promise<ValidateSubmissionOutput> {
  return validateSubmissionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateSubmissionPrompt',
  input: {schema: ValidateSubmissionInputSchema},
  output: {schema: ValidateSubmissionOutputSchema},
  prompt: `You are a submission validator.  Your job is to validate if the the following text submission is valid.

Text: {{{text}}}

Determine if the submission is valid. A submission is invalid if the text is empty or contains only whitespace. Return a JSON object with a single field \"isValid\" which is true if the submission is valid, and false otherwise.`,
});

const validateSubmissionFlow = ai.defineFlow(
  {
    name: 'validateSubmissionFlow',
    inputSchema: ValidateSubmissionInputSchema,
    outputSchema: ValidateSubmissionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

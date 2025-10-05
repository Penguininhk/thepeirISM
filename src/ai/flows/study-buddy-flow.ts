'use server';
/**
 * @fileOverview A study buddy AI agent.
 *
 * - askStudyBuddy - A function that handles a student's question.
 * - StudyBuddyInput - The input type for the askStudyBuddy function.
 * - StudyBuddyOutput - The return type for the askStudyBuddy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyBuddyInputSchema = z.object({
  courseName: z.string().describe('The name of the course the question is about.'),
  question: z.string().describe('The student\'s question about the course material.'),
});
export type StudyBuddyInput = z.infer<typeof StudyBuddyInputSchema>;

const StudyBuddyOutputSchema = z.string().describe('The helpful answer to the student\'s question.');
export type StudyBuddyOutput = z.infer<typeof StudyBuddyOutputSchema>;

export async function askStudyBuddy(input: StudyBuddyInput): Promise<StudyBuddyOutput> {
  const {output} = await studyBuddyFlow(input);
  return output!;
}

const studyBuddyPrompt = ai.definePrompt({
  name: 'studyBuddyPrompt',
  input: {schema: StudyBuddyInputSchema},
  output: {format: 'text'},
  prompt: `You are an expert AI Study Buddy for a high school student. Your personality is friendly, encouraging, and helpful.

A student is asking for help in their course: {{{courseName}}}

Their question is:
"{{{question}}}"

Your task is to provide a clear, concise, and easy-to-understand explanation that helps the student learn the concept. Break down complex ideas into smaller pieces. Use examples if it helps. Do not simply give the answer, but guide the student to understand it. Format your response in Markdown.`,
});

const studyBuddyFlow = ai.defineFlow(
  {
    name: 'studyBuddyFlow',
    inputSchema: StudyBuddyInputSchema,
    outputSchema: StudyBuddyOutputSchema,
  },
  async input => {
    const {output} = await studyBuddyPrompt(input);
    return output!;
  }
);

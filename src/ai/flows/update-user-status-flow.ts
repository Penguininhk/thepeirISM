'use server';
/**
 * @fileOverview A flow for updating a user's status and notifying them.
 *
 * - updateUserStatus - Updates a user's status in Firestore and sends a notification email.
 * - UpdateUserStatusInput - The input type for the updateUserStatus function.
 * - UpdateUserStatusOutput - The return type for the updateUserStatus function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const UpdateUserStatusInputSchema = z.object({
  userId: z.string().describe('The ID of the user to update.'),
  status: z.enum(['approved', 'rejected']).describe('The new status for the user.'),
  email: z.string().email().describe('The email of the user to notify.'),
});
export type UpdateUserStatusInput = z.infer<typeof UpdateUserStatusInputSchema>;

const UpdateUserStatusOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type UpdateUserStatusOutput = z.infer<typeof UpdateUserStatusOutputSchema>;

// Define a tool for sending emails. In a real app, this would integrate
// with an email service like SendGrid, Mailgun, or Firebase Extensions.
// For now, it just logs to the console.
const sendEmail = ai.defineTool(
  {
    name: 'sendEmail',
    description: 'Sends an email to a user.',
    inputSchema: z.object({
      to: z.string().describe("The recipient's email address."),
      subject: z.string().describe('The subject of the email.'),
      body: z.string().describe('The HTML body of the email.'),
    }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    console.log('--- Sending Email (Simulation) ---');
    console.log(`To: ${input.to}`);
    console.log(`Subject: ${input.subject}`);
    console.log(`Body: ${input.body}`);
    console.log('------------------------------------');
    // Simulate a successful email send.
    return { success: true };
  }
);


export async function updateUserStatus(input: UpdateUserStatusInput): Promise<UpdateUserStatusOutput> {
  return updateUserStatusFlow(input);
}


const prompt = ai.definePrompt({
  name: 'userStatusNotificationPrompt',
  input: {
    schema: z.object({
      status: z.string(),
      email: z.string(),
    })
  },
  output: {
    format: 'json',
    schema: z.object({
      subject: z.string(),
      body: z.string(),
    })
  },
  prompt: `Generate an email to notify a user about their account status change.
The status is '{{{status}}}'.
The email should be professional and informative.
If the status is 'approved', welcome them to The PIER and provide a login link.
If the status is 'rejected', inform them politely that their request could not be approved at this time.`,
  tools: [sendEmail],
});


const updateUserStatusFlow = ai.defineFlow(
  {
    name: 'updateUserStatusFlow',
    inputSchema: UpdateUserStatusInputSchema,
    outputSchema: UpdateUserStatusOutputSchema,
  },
  async (input) => {
    const { userId, status, email } = input;
    
    // NOTE: The direct Firestore update from the server-side flow is removed
    // to prevent the client/server boundary error. The client-side code
    // in the AdminDashboardPage already handles the Firestore update.
    // This flow is now only responsible for the notification.

    try {
      // Generate the notification email content
      const llmResponse = await prompt({
        status,
        email,
      });

      const emailContent = llmResponse.output;

      if (!emailContent) {
        return { success: false, message: 'Failed to generate email content.' };
      }
      
      // Use the sendEmail tool
      await ai.runTool('sendEmail', {
        to: email,
        subject: emailContent.subject,
        body: emailContent.body,
      });

      return { success: true, message: `Notification sent for user status update to ${status}.` };
    } catch (error) {
      console.error('Error in updateUserStatusFlow: ', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      return { success: false, message: errorMessage };
    }
  }
);

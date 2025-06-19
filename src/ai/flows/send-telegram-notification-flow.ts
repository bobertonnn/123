
'use server';
/**
 * @fileOverview A Genkit flow to send a notification message to Telegram.
 *
 * - sendTelegramNotification - A function that handles sending the message.
 * - SendTelegramNotificationInput - The input type for the function.
 * - SendTelegramNotificationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SendTelegramNotificationInputSchema = z.object({
  messageText: z.string().describe('The formatted text message to send to Telegram.'),
});
export type SendTelegramNotificationInput = z.infer<typeof SendTelegramNotificationInputSchema>;

const SendTelegramNotificationOutputSchema = z.object({
  success: z.boolean().describe('Whether the message was sent successfully.'),
  error: z.string().optional().describe('Error message if sending failed.'),
});
export type SendTelegramNotificationOutput = z.infer<typeof SendTelegramNotificationOutputSchema>;

export async function sendTelegramNotification(input: SendTelegramNotificationInput): Promise<SendTelegramNotificationOutput> {
  return sendTelegramNotificationFlow(input);
}

const sendTelegramNotificationFlow = ai.defineFlow(
  {
    name: 'sendTelegramNotificationFlow',
    inputSchema: SendTelegramNotificationInputSchema,
    outputSchema: SendTelegramNotificationOutputSchema,
  },
  async (input) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      const errorMessage = 'Telegram Bot Token or Chat ID is not configured. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.';
      console.error(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    console.log(`Using Telegram Bot Token: ${botToken ? botToken.substring(0,10) + '...' : 'Not Set'}`);
    console.log(`Using Telegram Chat ID: ${chatId || 'Not Set'}`);

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: input.messageText,
          parse_mode: 'Markdown', 
        }),
      });

      if (!response.ok) {
        let errorDescription = 'Unknown error';
        let rawErrorDataString = 'Could not retrieve raw error data.';
        try {
          const errorData = await response.json();
          rawErrorDataString = JSON.stringify(errorData); 
          errorDescription = errorData?.description || rawErrorDataString;
        } catch (jsonError: any) {
          console.error("Failed to parse Telegram API error response as JSON:", jsonError.message || String(jsonError));
          try {
            const errorText = await response.text();
            rawErrorDataString = errorText;
            errorDescription = `Non-JSON error response: ${errorText.substring(0, 150)}`;
          } catch (textError: any) {
            console.error("Failed to parse Telegram API error response as text:", textError.message || String(textError));
            errorDescription = `Telegram API returned ${response.status} but error details are unreadable.`;
            rawErrorDataString = `Status: ${response.status}, Response body unreadable.`;
          }
        }
        const errorMessage = `Telegram API error: ${response.status} - ${errorDescription}`;
        console.error(errorMessage);
        console.error("Raw Telegram error data string:", rawErrorDataString);
        return { success: false, error: errorMessage };
      }

      console.log('Telegram notification sent successfully.');
      return { success: true };
    } catch (error: any) {
      const errorMessage = `Failed to send Telegram notification: ${error.message || 'Unknown fetch error'}`;
      console.error(errorMessage);
      console.error("Full fetch error object details:", String(error), error.stack ? `\nStack: ${error.stack}` : ''); 
      return { success: false, error: errorMessage };
    }
  }
);



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
    const botToken = "8146761380:AAE6ssjEIWpY-ALcBl6dyGbWsfxm89TkRK4"; // Временно для теста
    const chatId = "-4673849808"; // Временно для теста

    if (!botToken || !chatId) {
      const errorMessage = 'Telegram Bot Token or Chat ID is not configured (expected in env vars or hardcoded for test).';
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
          // Пытаемся получить errorData как JSON
          const errorData = await response.json();
          // Преобразуем errorData в строку для безопасного логирования
          rawErrorDataString = JSON.stringify(errorData); 
          errorDescription = errorData?.description || rawErrorDataString;
        } catch (jsonError: any) {
          console.error("Failed to parse Telegram API error response as JSON:", jsonError.message || String(jsonError));
          // Если JSON не удался, пытаемся получить как текст
          try {
            const errorText = await response.text();
            rawErrorDataString = errorText; // Сохраняем текстовый ответ
            errorDescription = `Non-JSON error response: ${errorText.substring(0, 150)}`; // Ограничиваем длину для лога
          } catch (textError: any) {
            console.error("Failed to parse Telegram API error response as text:", textError.message || String(textError));
            errorDescription = `Telegram API returned ${response.status} but error details are unreadable.`;
            rawErrorDataString = `Status: ${response.status}, Response body unreadable.`;
          }
        }
        const errorMessage = `Telegram API error: ${response.status} - ${errorDescription}`;
        console.error(errorMessage); // Логируем основное сообщение
        console.error("Raw Telegram error data string:", rawErrorDataString); // Логируем строковое представление ответа
        return { success: false, error: errorMessage };
      }

      console.log('Telegram notification sent successfully.');
      return { success: true };
    } catch (error: any) {
      // Ошибка самого fetch запроса (сетевая и т.д.)
      const errorMessage = `Failed to send Telegram notification: ${error.message || 'Unknown fetch error'}`;
      console.error(errorMessage); // Логируем сообщение ошибки
      // Логируем объект ошибки как строку и его стек, если есть
      console.error("Full fetch error object details:", String(error), error.stack ? `\nStack: ${error.stack}` : ''); 
      return { success: false, error: errorMessage };
    }
  }
);


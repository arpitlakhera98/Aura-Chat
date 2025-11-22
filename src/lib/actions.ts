'use server';

import { summarizeChat } from '@/ai/flows/summarize-chat';
import type { Message } from '@/lib/data';

export async function summarizeConversation(
  messages: Message[]
): Promise<{ summary?: string; error?: string }> {
  try {
    const conversation = messages
      .map((m) => `${m.user.name}: ${m.content}`)
      .join('\n');

    if (conversation.trim().length === 0) {
      return { summary: 'There are no messages to summarize.' };
    }

    const result = await summarizeChat({ conversation });
    return result;
  } catch (error) {
    console.error('Summarization error:', error);
    return { error: 'Failed to summarize conversation. Please try again later.' };
  }
}

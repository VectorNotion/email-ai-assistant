import Email from '../../types/Email';
import Config from '../config';
import { emailFilteringInstructions } from '../config/chat-instructions';
import SummaryHelper from './summary-helper';

export default class OllaamaAPI {
  static async filterEmail(email: Email): Promise<boolean> {
    const summary = await SummaryHelper.getCurrentSummary();

    const emailPrompt = emailFilteringInstructions
      .replace('{preferences}', summary.summary)
      .replace(
        '{email}',
        `From: ${email.from}
        Subject: ${email.subject}
        Body: ${email.body}`,
      );

    const response = await fetch(Config.OLLAMA_INFERENCE_URL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        Stream: false,
        messages: [
          {
            content: emailPrompt,
            role: 'system',
          },
          {
            role: 'user',
            content:
              'based on the preferences and emails, give me the filtered emails',
          },
        ],
      }),
    });

    if (!response.body) {
      throw new Error('ReadableStream not supported in this environment.');
    }

    if (!response.body) {
      console.error('No response body');
      return false;
    }

    const responseData = await response.json();
    const filterResult = responseData.message.content;

    return filterResult;
  }
}

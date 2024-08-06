import { Message } from '../../types/Chat';
import { summaryGenerationInstructions } from '../config/chat-instructions';
import db from '../db';

export interface Summary {
  summary: string;
  processedMessageIndex: number;
}
export default class SummaryHelper {
  static async getCurrentSummary(): Promise<Summary> {
    const summary = await new Promise((resolve, reject) => {
      db.userdata.findOne({ type: 'summary' }, (err, doc) => {
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });

    if (!summary) {
      return {
        summary: `1. User is interested in: work emails, personal emails
2. User is not interested in: spam emails, promotional emails, social emails
3. User is neutral about: newsletters, updates, offers
        `,
        processedMessageIndex: -1,
      };
    }
    return summary as Summary;
  }

  static async generateSummary() {
    const [summary, messages]: [Summary, Message[]] = await Promise.all([
      SummaryHelper.getCurrentSummary(),
      new Promise<Message[]>((resolve, reject) => {
        db.messages
          .find({})
          .sort({ timestamp: 1 })
          .exec((err: Error | null, docs: Message[]) => {
            if (err) {
              reject(err);
            }
            resolve(docs);
          });
      }),
    ]);

    const inferenceURL = process.env.OLLAMA_INFERENCE_URL || '';

    const summaryMessage = summaryGenerationInstructions
      .replace('{summary}', summary.summary)
      .replace(
        '{messages}',
        messages.map((msg) => `${msg.role}-${msg.content}`).join('\n\n\n'),
      );

    const response = await fetch(inferenceURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        stream: false,
        messages: [
          {
            content: summaryMessage,
            role: 'system',
          },
          {
            role: 'user',
            content: 'based on the conversation, generate the summary',
          },
        ],
      }),
    });

    if (!response.body) {
      return {
        summary: '',
        processedMessageIndex: -1,
      };
    }

    const responseData = await response.json();

    const newSummary = responseData.message.content;

    // insert if not exists else update

    db.userdata.update(
      { type: 'summary' },
      {
        type: 'summary',
        summary: newSummary,
        processedMessageIndex: messages.length - 1,
      },
      { upsert: true },
    );

    return {
      summary: newSummary,
      processedMessageIndex: messages.length - 1,
    };
  }
}

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Message } from '../../types/Chat';
import Email from '../../types/Email';
import Config from '../config';
import { chatInstructions } from '../config/chat-instructions';
import db from '../db';
import SummaryHelper from './summary-helper';

export default class DBHelper {
  static async bootstrap() {
    ipcMain.handle('get-google-token', DBHelper.getGoogleToken);
    ipcMain.handle('send-message', DBHelper.processMessage);
    ipcMain.handle('get-important-emails', DBHelper.getImportantEmails);
    ipcMain.handle('get-all-emails', DBHelper.getAllEmails);
    ipcMain.handle('get-all-messages', DBHelper.getAllMessages);
  }

  static async getGoogleToken() {
    return new Promise((resolve, reject) => {
      db.userdata.findOne({ type: 'google-token' }, (err, doc) => {
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  }

  static async getImportantEmails() {
    return new Promise((resolve, reject) => {
      db.mail.find({ _important: '1' }, (err: Error | null, docs: Email[]) => {
        if (err) {
          reject(err);
        }
        resolve(docs);
      });
    });
  }

  static async getAllEmails() {
    return new Promise((resolve, reject) => {
      db.mail.find({}, (err: Error | null, docs: Email[]) => {
        if (err) {
          reject(err);
        }
        resolve(docs);
      });
    });
  }

  static async getAllMessages() {
    return new Promise((resolve, reject) => {
      db.messages
        .find({})
        .sort({ timestamp: '-1' })
        .exec((err: Error | null, docs: Message[]) => {
          if (err) {
            reject(err);
          }
          resolve(docs);
        });
    });
  }

  static async processMessage(event: IpcMainInvokeEvent, message: Message) {
    const [docs, summary] = await Promise.all([
      await new Promise<Message[]>((resolve, reject) => {
        db.messages.find({}, (err: Error | null, allDocs: Message[]) => {
          if (err) {
            return reject(err);
          }
          return resolve(allDocs);
        });
      }),
      SummaryHelper.getCurrentSummary(),
    ]);

    if (docs.length === 0) {
      docs.push({
        content: 'I am your EmailAIAssistant, how can I help you today?',
        role: 'assistant',
        timestamp: new Date().getTime(),
      });
    }

    message.timestamp = new Date().getTime();
    docs.push(message);

    const inferenceURL = Config.OLLAMA_INFERENCE_URL || '';

    const response = await fetch(inferenceURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        messages: [
          {
            content: chatInstructions.replace('{preferences}', summary.summary),
            role: 'system',
          },
          ...docs.map((msg) => {
            return {
              content: msg.content,
              role: msg.role,
            };
          }),
        ],
      }),
    });

    if (!response.body) {
      throw new Error('ReadableStream not supported in this environment.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    const result: Message = {
      content: '',
      role: 'assistant',
      id: new Date().getTime().toString(),
      timestamp: new Date().getTime(),
    };

    const readStream = async () => {
      const { done, value } = await reader.read();
      if (done) {
        docs.push(result);
        // db.messages.insert(result);
        // insert all documents into the database replacing everything that was there before
        await new Promise<void>((resolve, reject) => {
          db.messages.remove({}, { multi: true }, (err) => {
            if (err) {
              reject(err);
            }
            db.messages.insert(docs, (insertErr: Error | null) => {
              if (err) {
                reject(insertErr);
              }
              resolve();
            });
          });
        });

        await SummaryHelper.generateSummary();
        return;
      }
      const chunk = decoder.decode(value, { stream: true });
      const chunkJSON = JSON.parse(chunk);
      result.content += chunkJSON.message.content;
      event.sender.send('inference-update', chunk);
      await readStream();
    };

    await readStream();

    return docs;
  }
}

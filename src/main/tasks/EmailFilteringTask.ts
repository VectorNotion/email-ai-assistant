import { Notification } from 'electron';
import Email from '../../types/Email';
import db from '../db';
import OllaamaAPI from '../helpers/OllamaAPI';

export default class EmailFilteringTask {
  static async filterEmails(): Promise<void> {
    try {
      const emails = await new Promise<Email[]>((resolve, reject) => {
        db.mail.find(
          {
            _processed: false,
            _processing: false,
          },
          (err: Error | null, docs: Email[]) => {
            if (err) {
              reject(err);
            }
            resolve(docs);
          },
        );
      });

      console.log('Emails:', emails.length);

      emails.forEach(async (email) => {
        await new Promise<void>((resolve, reject) => {
          db.mail.update(
            { id: email.id },
            { $set: { _processing: true } },
            {},
            (err) => {
              if (err) {
                reject(err);
              }
              resolve();
            },
          );
        });

        // filter the email
        const filterResult = await OllaamaAPI.filterEmail(email);

        await new Promise<void>((resolve, reject) => {
          db.mail.update(
            { id: email.id },
            {
              $set: {
                _processed: true,
                _processing: false,
                _important: filterResult,
              },
            },
            {},
            (err) => {
              if (err) {
                reject(err);
              }
              resolve();
            },
          );
        });
        console.log('Filter result:', filterResult);
        if (filterResult) {
          new Notification({
            title: 'Important Email',
            body: email.subject,
          }).show();
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

if (require.main === module) {
  EmailFilteringTask.filterEmails();
}

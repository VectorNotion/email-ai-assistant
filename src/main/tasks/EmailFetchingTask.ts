import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { convert } from 'html-to-text';
import { Base64 } from 'js-base64';
import db from '../db';

export default class EmailFetchingTask {
  static async processEmails(): Promise<void> {
    try {
      const tokendata = await new Promise<{
        token: any;
      }>((resolve, reject) => {
        db.userdata.findOne(
          { type: 'google-token' },
          (err: Error | null, doc: any) => {
            if (err) {
              reject(err);
            }
            resolve(doc);
          },
        );
      });

      if (!tokendata || !tokendata.token) {
        throw new Error('Token data is undefined or empty');
      }

      const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECTION_URL,
      );

      oAuth2Client.setCredentials(tokendata.token);

      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

      const res = await gmail.users.messages.list({
        userId: 'me',
        q: `newer_than:3h`,
      });

      if (!res.data.messages || res.data.messages.length === 0) {
        return;
      }

      res.data.messages.forEach(async (email: any) => {
        const emailExists = await new Promise<boolean>((resolve, reject) => {
          db.mail.findOne({ id: email.id }, (err, doc) => {
            if (err) {
              reject(err);
            }
            resolve(!!doc);
          });
        });

        if (!emailExists) {
          console.log('Processing email:', email.id);
          const emailData = await gmail.users.messages.get({
            userId: 'me',
            id: email.id || '',
          });

          console.log('Email data:', emailData);

          const headers = emailData.data.payload?.headers || [];
          const subjectHeader = headers.find(
            (header: any) => header.name === 'Subject',
          );
          const subject = subjectHeader ? subjectHeader.value : '(No Subject)';

          const fromHeader = headers.find(
            (header: any) => header.name === 'From',
          );
          const from = fromHeader ? fromHeader.value : '(No From)';

          const parts = emailData.data.payload?.parts || [];
          let body = '';

          parts.forEach((part) => {
            if (part.mimeType === 'text/html') {
              body = part.body?.data ? Base64.decode(part.body.data) : '';
            } else if (part.mimeType === 'text/plain' && !body) {
              body = part.body?.data ? Base64.decode(part.body.data) : '';
            }
          });

          if (!body && emailData.data.payload?.body?.data) {
            body = Base64.decode(emailData.data.payload.body.data);
          }

          body = convert(body, {
            selectors: [
              { selector: 'a', format: 'skip' },
              { selector: 'img', format: 'skip' },
            ],
          });

          // insert the email into the database
          // db.mail.insert({ id: email.id, subject, body, _processed: false });

          await new Promise<void>((resolve, reject) => {
            db.mail.insert(
              {
                id: email.id,
                subject,
                body,
                _processed: false,
                from,
                _processing: false,
              },
              (err) => {
                if (err) {
                  reject(err);
                }
                resolve();
              },
            );
          });
        }
      });

      // // fetch all unprocessed emails
      // const emails = await new Promise<Email[]>((resolve, reject) => {
      //   db.mail.find({}, (err: Error | null, docs: Email[]) => {
      //     if (err) {
      //       reject(err);
      //     }
      //     resolve(docs);
      //   });
      // });
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

if (require.main === module) {
  EmailFetchingTask.processEmails();
}

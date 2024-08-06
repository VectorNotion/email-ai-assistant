import { app } from 'electron';
import Datastore from 'nedb';
import path from 'path';
// Define the path to your database file
const userPath = path.resolve(app.getPath('userData'), 'user.jsonl');
const mailPath = path.resolve(app.getPath('userData'), 'mail.jsonl');
const messagesPath = path.resolve(app.getPath('userData'), 'messages.jsonl');

console.log('userPath', userPath);
// Initialize the NeDB database with the file path
export default {
  userdata: new Datastore({ filename: userPath, autoload: true }),
  mail: new Datastore({ filename: mailPath, autoload: true }),
  messages: new Datastore({ filename: messagesPath, autoload: true }),
};

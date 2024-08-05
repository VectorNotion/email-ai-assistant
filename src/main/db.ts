import Datastore from 'nedb';
import path from 'path';
// Define the path to your database file
const userPath = path.resolve(__dirname, '../../data/user.jsonl');
const mailPath = path.resolve(__dirname, '../../data/mail.jsonl');
const messagesPath = path.resolve(__dirname, '../../data/messages.jsonl');

// Initialize the NeDB database with the file path
export default {
  userdata: new Datastore({ filename: userPath, autoload: true }),
  mail: new Datastore({ filename: mailPath, autoload: true }),
  messages: new Datastore({ filename: messagesPath, autoload: true }),
};

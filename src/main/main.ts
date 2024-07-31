/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import dotenv from 'dotenv';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import cron from 'node-cron';
import path from 'path';
import db from './db';
import DBHelper from './helpers/db-helpers';
import GoogleAuth from './helpers/google-auth';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

ipcMain.on('oauth-google', async (event, arg) => {
  if (arg === 'start') {
    try {
      const token = await GoogleAuth.login();
      db.userdata.insert({ token, type: 'google-token' });
      mainWindow?.webContents.send('google-auth', 'success');
    } catch (e) {
      mainWindow?.webContents.send('google-auth', 'error');
    }
  }
});

DBHelper.bootstrap();

// Define the task you want to run every minute
const task = async () => {
  try {
    console.log('Task is running every minute again and again');
    // Add your task logic here
    const tokendata = await new Promise<{
      token: any;
    }>((resolve, reject) => {
      db.userdata.findOne({ type: 'google-token' }, (err, doc) => {
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
    console.log('Token:', tokendata);

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECTION_URL,
    );

    oAuth2Client.setCredentials(tokendata.token);

    console.log('token aquired');

    // list emails received in the last 1 hour
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const res = await gmail.users.messages.list({
      userId: 'me',
      q: `newer_than:3h`,
    });

    console.log('Emails:', res.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Schedule the task to run every minute
cron.schedule('* * * * *', task);

import axios from 'axios';
import { BrowserWindow } from 'electron';
import queryString from 'node:querystring';

export default class GoogleAuth {
  static login(): Promise<string> {
    return new Promise((resolve, reject) => {
      const authWindow = new BrowserWindow({
        width: 500,
        height: 600,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
      });

      const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECTION_URL}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.compose`;

      authWindow.loadURL(authUrl);

      authWindow.webContents.on(
        'will-redirect',
        async (details: any, url: string) => {
          console.log('will-redirect', details, url);
          const parsedUrl = new URL(url);
          const code = parsedUrl.searchParams.get('code');

          if (code) {
            console.log('code', code);
            try {
              const tokenUrl = 'https://oauth2.googleapis.com/token';
              const tokenData = queryString.stringify({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECTION_URL,
                grant_type: 'authorization_code',
              });

              const tokenResponse = await axios.post(tokenUrl, tokenData, {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              });
              console.log('Token:', tokenResponse.data);
              resolve(tokenResponse.data);
            } catch (error) {
              console.error('Error:', error);
              reject(error);
            }
            authWindow.close();
          }
        },
      );
    });
  }
}
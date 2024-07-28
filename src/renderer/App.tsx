import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';
import icon from '../../assets/icon.svg';
import './App.css';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, data: any) => void;
        on: (channel: string, func: (...args: any[]) => void) => void;
        once: (channel: string, func: (...args: any[]) => void) => void;
      };
    };
  }
}

function Hello() {
  const handleLogin = () => {
    window.electron.ipcRenderer.once(
      'oauth-google-reply',
      async (event, arg) => {
        const tokenUrl = 'https://oauth2.googleapis.com/token';
        const tokenData = queryString.stringify({
          code: arg,
          client_id: 'YOUR_CLIENT_ID',
          client_secret: 'YOUR_CLIENT_SECRET',
          redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
          grant_type: 'authorization_code',
        });

        const tokenResponse = await axios.post(tokenUrl, tokenData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        console.log('Access Token:', tokenResponse.data.access_token);
      },
    );

    window.electron.ipcRenderer.send('oauth-google', 'start');
  };
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <button type="button" onClick={handleLogin}>
          <span role="img" aria-label="books">
            📚
          </span>
          Connect Google Auth
        </button>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}

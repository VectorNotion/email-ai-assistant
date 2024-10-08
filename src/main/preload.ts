import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import Config from './config';

const electronHandler = {
  ipcRenderer: {
    send: (channel: string, data: any) => {
      ipcRenderer.send(channel, data);
    },
    invoke: (channel: string, ...args: any[]) => {
      return ipcRenderer.invoke(channel, ...args);
    },
    on: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.on(channel, (event: IpcRendererEvent, ...args: any[]) =>
        func(...args),
      );
    },
    once: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.once(channel, (event: IpcRendererEvent, ...args: any[]) =>
        func(...args),
      );
    },
    removeListener: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.removeListener(channel, func);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

const env = {
  ollama_model_list_url: Config.OLLAMA_MODEL_LIST_URL,
};

export type Env = typeof env;

contextBridge.exposeInMainWorld('env', env);

export type ElectronHandler = typeof electronHandler;

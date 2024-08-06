import Email from '@/types/Email';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface EmailContextType {
  emails: Email[];
  importantEmails: Email[];
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export default function EmailContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [importantEmails, setImportantEmails] = useState<Email[]>([]);
  const fetchEmails = async () => {
    const [allEmails, allImportantEmails] = await Promise.all([
      window.electron.ipcRenderer.invoke('get-all-emails'),
      window.electron.ipcRenderer.invoke('get-important-emails'),
    ]);
    setEmails(allEmails);
    setImportantEmails(allImportantEmails);
  };
  useEffect(() => {
    fetchEmails();
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('email-fetched', fetchEmails);
    return () => {
      window.electron.ipcRenderer.removeListener('email-fetched', fetchEmails);
    };
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('email-filtered', fetchEmails);
    return () => {
      window.electron.ipcRenderer.removeListener('email-filtered', fetchEmails);
    };
  }, []);

  return useMemo(
    () => (
      <EmailContext.Provider value={{ emails, importantEmails }}>
        {children}
      </EmailContext.Provider>
    ),
    [emails, importantEmails, children],
  );
}

export const useEmailContext = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmailContext must be used within an EmailProvider');
  }
  return context;
};

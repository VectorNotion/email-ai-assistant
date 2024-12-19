import { ChakraProvider } from '@chakra-ui/react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import EmailDetails from './components/EmailDetails';
import Dashboard from './screens/Dashboard';
import Chats from './screens/Dashboard/Chat';
import Emails from './screens/Dashboard/Emails';
import Important from './screens/Dashboard/Important';
import Home from './screens/Home';
import theme from './theme';

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route index element={<Important />} />
            <Route path="all-emails" element={<Emails />} />
            <Route path="chat" element={<Chats />} />
            <Route path="emails/:id" element={<EmailDetails />} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

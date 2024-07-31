import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './screens/Home';
import Dashboard from './screens/Dashboard';
import theme from './theme';
import Important from './screens/Dashboard/Important';
import Emails from './screens/Dashboard/Emails';
import Chats from './screens/Dashboard/Chat';

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
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

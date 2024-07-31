import { Box, Button, Image } from '@chakra-ui/react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import icon from '../../../assets/magic-icon.svg';
import Header from '../components/layout/Header';
import { ChatIcon, InboxIcon } from '../icon/Icons';

export default function Home() {
  const { pathname } = useLocation();
  return (
    <Box>
      <Header />
      <Box
        w="100%"
        h="100dvh"
        bgGradient="linear(to-b, #e9e8f5, #ffffff)"
        color="white"
        p={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={4}
      >
        <Box w="100%" py={4} display="flex">
          <Box
            borderBottom={pathname.match(/\/dashboard\/?$/) ? '2px' : 0}
            borderColor="gray.800"
          >
            <Link to="/dashboard/">
              <Button
                leftIcon={<Image src={icon} alt="logo" boxSize={4} />}
                colorScheme={pathname === '/dashboard' ? 'gray' : 'blackAlpha'}
                variant="ghost"
                size="lg"
              >
                Important
              </Button>
            </Link>
          </Box>
          <Box
            borderBottom={pathname === '/dashboard/all-emails' ? '2px' : 0}
            borderColor="gray.800"
          >
            <Link to="/dashboard/all-emails">
              <Button
                leftIcon={<InboxIcon />}
                colorScheme={
                  pathname === '/dashboard/all-emails' ? 'gray' : 'blackAlpha'
                }
                variant="ghost"
                size="lg"
              >
                All Emails
              </Button>
            </Link>
          </Box>
          <Box
            borderBottom={pathname === '/dashboard/chat' ? '2px' : 0}
            borderColor="gray.800"
          >
            <Link to="/dashboard/chat">
              <Button
                leftIcon={<ChatIcon />}
                colorScheme={
                  pathname === '/dashboard/chat' ? 'gray' : 'blackAlpha'
                }
                variant="ghost"
                size="lg"
              >
                Assistant
              </Button>
            </Link>
          </Box>
        </Box>
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          w="100%"
          overflow="auto"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

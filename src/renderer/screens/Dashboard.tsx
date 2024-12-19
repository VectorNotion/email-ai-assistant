import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { RiCloseFill } from 'react-icons/ri';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import icon from '../../../assets/magic-icon.svg';
import Header from '../components/layout/Header';
import EmailContextProvider, { useEmailContext } from '../context/EmailContext';
import { ChatIcon, InboxIcon } from '../icon/Icons';

function AllEmailsButton() {
  const { pathname } = useLocation();
  const { emails } = useEmailContext();
  const buttonColor = useColorModeValue('blackAlpha', 'whiteAlpha');

  return (
    <Button
      leftIcon={<InboxIcon />}
      colorScheme={pathname === '/dashboard/all-emails' ? 'gray' : buttonColor}
      variant="ghost"
      size="lg"
    >
      <Flex alignItems="center" justifyContent="center">
        <Box>All Emails</Box>
        <Badge
          ml="1"
          fontSize="xs"
          colorScheme={
            pathname === '/dashboard/all-emails' ? 'gray' : buttonColor
          }
          p={0.5}
        >
          {emails.length}
        </Badge>
      </Flex>
    </Button>
  );
}

function ImportantEmailsButton() {
  const { pathname } = useLocation();
  const { importantEmails } = useEmailContext();
  const buttonColor = useColorModeValue('blackAlpha', 'whiteAlpha');
  return (
    <Button
      leftIcon={
        <Image
          src={icon}
          alt="logo"
          boxSize={4}
          opacity={
            pathname === '/dashboard' || pathname === '/dashboard/' ? 1 : 0.25
          }
        />
      }
      colorScheme={
        pathname === '/dashboard' || pathname === '/dashboard/'
          ? 'gray'
          : buttonColor
      }
      variant="ghost"
      size="lg"
    >
      <Flex alignItems="center" justifyContent="center">
        <Box>Important</Box>
        <Badge
          ml="1"
          fontSize="xs"
          colorScheme={
            pathname === '/dashboard' || pathname === '/dashboard/'
              ? 'gray'
              : buttonColor
          }
          p={0.5}
        >
          {importantEmails.length}
        </Badge>
      </Flex>
    </Button>
  );
}

function DashboardNavigation() {
  const { pathname } = useLocation();
  const borderValue = useColorModeValue('gray.800', 'gray.300');
  const buttonColor = useColorModeValue('blackAlpha', 'whiteAlpha');
  const { activeEmail } = useEmailContext();
  const navigate = useNavigate();

  return (
    <Box w="100%" py={4} display="flex">
      {activeEmail ? (
        <Flex alignItems="center" gap={4}>
          <IconButton
            onClick={() => navigate(-1)}
            size="lg"
            icon={<RiCloseFill size="36" />}
            aria-label="Close"
            borderRadius="full"
          />
          <Text color="gray.600" fontWeight="bold">
            {activeEmail.subject}
          </Text>
        </Flex>
      ) : (
        <>
          <Box
            borderBottom={pathname.match(/\/dashboard\/?$/) ? '2px' : 0}
            borderColor={borderValue}
          >
            <Link to="/dashboard/">
              <ImportantEmailsButton />
            </Link>
          </Box>
          <Box
            borderBottom={pathname === '/dashboard/all-emails' ? '2px' : 0}
            borderColor={borderValue}
          >
            <Link to="/dashboard/all-emails">
              <AllEmailsButton />
            </Link>
          </Box>
          <Box
            borderBottom={pathname === '/dashboard/chat' ? '2px' : 0}
            borderColor={borderValue}
          >
            <Link to="/dashboard/chat">
              <Button
                leftIcon={<ChatIcon />}
                colorScheme={
                  pathname === '/dashboard/chat' ? 'gray' : buttonColor
                }
                variant="ghost"
                size="lg"
              >
                Assistant
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Box>
  );
}

export default function Home() {
  const value = useColorModeValue(
    'linear(to-b, #e9e8f5, #ffffff)',
    'linear(to-b, #171923, #262626)',
  );

  return (
    <Box>
      <EmailContextProvider>
        <Header />
        <Box
          w="100%"
          h="100dvh"
          bgGradient={value}
          color="white"
          p={4}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap={4}
        >
          <DashboardNavigation />
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
      </EmailContextProvider>
    </Box>
  );
}

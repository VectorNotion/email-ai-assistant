import {
  Avatar,
  AvatarBadge,
  Box,
  ButtonGroup,
  IconButton,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AutomaticModeIcon,
  DarkModeIcon,
  GithubIcon,
  LightModeIcon,
  LogoutIcon,
  OllamaIcon,
} from '../../icon/Icons';

function OllamaStatus() {
  const [status, setStatus] = useState<'online' | 'offline'>('online');

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const resp = await fetch(window.env.ollama_model_list_url);

        if (!resp.ok) {
          setStatus('offline');
        }

        const data = await resp.json();
        if (
          data.models.length > 0 &&
          data.models[0].name.startsWith('llama3')
        ) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (e) {
        setStatus('offline');
      }
    }, 5000);

    return () => clearInterval(interval as any);
  });
  return (
    <Stack direction="row" spacing={4}>
      <Avatar
        bg="gray.50"
        icon={<OllamaIcon boxSize={8} />}
        size="sm"
        color="gray.900"
      >
        <AvatarBadge
          boxSize="1.25em"
          bg={status === 'online' ? 'green.500' : 'red.500'}
        />
      </Avatar>
    </Stack>
  );
}

export default function Header() {
  const { setColorMode, colorMode } = useColorMode();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const getGoogleToken = async () => {
      const token =
        await window.electron.ipcRenderer.invoke('get-google-token');
      if (token) {
        // Token is received, navigate to dashboard
        setIsLoggedIn(true);
      } else {
        // Token not found, update loading state
        setIsLoggedIn(false);
      }
    };
    getGoogleToken();
  }, [navigate]);
  return (
    <Box
      position="fixed"
      top="0"
      right="0"
      color="gray.900"
      p={8}
      display="flex"
      gap={4}
      alignItems="center"
    >
      <Box mr={16}>
        <ButtonGroup size="sm" isAttached variant="solid">
          <IconButton
            aria-label="Light Mode"
            size="sm"
            colorScheme={colorMode === 'light' ? 'brand' : 'gray'}
            variant="solid"
            icon={<LightModeIcon boxSize={4} />}
            onClick={() => {
              setColorMode('light');
            }}
          />
          <IconButton
            aria-label="Dark Mode"
            size="sm"
            icon={<DarkModeIcon boxSize={3} />}
            colorScheme={colorMode === 'dark' ? 'brand' : 'gray'}
            onClick={() => {
              setColorMode('dark');
            }}
          />
          <IconButton
            aria-label="Dark Mode"
            size="sm"
            icon={<AutomaticModeIcon boxSize={3} />}
            onClick={() => {
              setColorMode('system');
            }}
          />
        </ButtonGroup>
      </Box>

      <Box display="flex" alignItems="center" gap="4">
        <OllamaStatus />

        <IconButton
          aria-label="Ollama"
          size="lg"
          borderRadius="full"
          icon={<GithubIcon boxSize={8} />}
        />
        {isLoggedIn && (
          <IconButton
            aria-label="Ollama"
            size="lg"
            borderRadius="full"
            icon={<LogoutIcon boxSize={6} />}
            onClick={async () => {
              await window.electron.ipcRenderer.invoke('logout');
              navigate('/');
            }}
          />
        )}
      </Box>
    </Box>
  );
}

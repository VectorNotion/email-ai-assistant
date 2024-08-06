import { Box, Button, Image, Text, useToast } from '@chakra-ui/react';
import { Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import icon from '../../../assets/icon.svg';
import Header from '../components/layout/Header';
import { GmailLogoIcon } from '../icon/Icons';
import Loading from './Loading'; // Assuming Loading component is in the same directory

export default function Home() {
  const [loading, setLoading] = useState(true); // Initial state is true to show loading
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const getGoogleToken = async () => {
      const token =
        await window.electron.ipcRenderer.invoke('get-google-token');
      if (token) {
        // Token is received, navigate to dashboard
        navigate('/dashboard');
      } else {
        // Token not found, update loading state
        setLoading(false);
      }
    };
    getGoogleToken();
  }, [navigate]);

  const handleLogin = () => {
    setLoading(true);
    window.electron.ipcRenderer.once('google-auth', (arg: string) => {
      if (arg === 'success') {
        setLoading(false);
        navigate('/dashboard');
      } else {
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to authenticate with Google',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    });

    window.electron.ipcRenderer.send('oauth-google', 'start');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
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
          <Box
            flexGrow={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              m={8}
              bgGradient="linear(to-b, #7928CA, #FF0080)"
              borderRadius="full"
              p={12}
            >
              <Image src={icon} alt="logo" boxSize={48} />
            </Box>
            <Text
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
              fontSize="6xl"
              fontWeight="extrabold"
            >
              Your AI Email Assistant
            </Text>
            <Button
              type="button"
              gap={2}
              colorScheme="red"
              onClick={handleLogin}
              isLoading={loading}
            >
              <span role="img" aria-label="books">
                <GmailLogoIcon boxSize={6} />
              </span>
              Connect Gmail Account
            </Button>
          </Box>
        </Box>
      </Box>
    </Suspense>
  );
}

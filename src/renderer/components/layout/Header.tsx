import {
  Avatar,
  AvatarBadge,
  Box,
  ButtonGroup,
  IconButton,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import {
  AutomaticModeIcon,
  DarkModeIcon,
  GithubIcon,
  LightModeIcon,
  OllamaIcon,
} from '../../icon/Icons';

export default function Header() {
  const { setColorMode, colorMode } = useColorMode();

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
      <Box display="flex" alignItems="center" gap="4">
        <Stack direction="row" spacing={4}>
          <Avatar
            bg="gray.50"
            icon={<OllamaIcon boxSize={8} />}
            size="sm"
            color="gray.900"
          >
            <AvatarBadge boxSize="1.25em" bg="green.500" />
          </Avatar>
        </Stack>

        <IconButton
          aria-label="Ollama"
          size="lg"
          borderRadius="full"
          icon={<GithubIcon boxSize={8} />}
        />
      </Box>
      <Box ml={16}>
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
    </Box>
  );
}

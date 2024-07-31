import { Box, Spinner } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box
      w="100%"
      h="100dvh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner size="xl" />
    </Box>
  );
}

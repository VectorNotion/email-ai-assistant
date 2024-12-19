import Email from '@/types/Email';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export default function EmailListing({ emails }: { emails: Email[] }) {
  return (
    <Card w="100%">
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {emails.map((email) => (
            <NavLink to={`/dashboard/emails/${email.id}`} key={email.id}>
              <Box key={email.id}>
                <Heading size="xs" textTransform="uppercase">
                  {email.subject}
                </Heading>
                <Text pt="2" fontSize="sm">
                  {email.from}
                </Text>
              </Box>
            </NavLink>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

import EmailListing from '@/renderer/components/EmailListing';
import { useEmailContext } from '@/renderer/context/EmailContext';
import { Image, Text } from '@chakra-ui/react';
import sleepingIcon from '../../../../assets/sleeping.svg';

export default function Important() {
  const { importantEmails: emails } = useEmailContext();

  return emails.length > 0 ? (
    <EmailListing emails={emails} />
  ) : (
    <>
      <Image src={sleepingIcon} alt="logo" boxSize={24} />
      <Text fontSize="2xl" fontWeight="extrabold" color="gray.300">
        Emails caught up!
      </Text>
    </>
  );
}

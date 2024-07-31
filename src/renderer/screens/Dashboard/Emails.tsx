import { Image, Text } from '@chakra-ui/react';
import sleepingIcon from '../../../../assets/sleeping.svg';

export default function Emails() {
  return (
    <>
      <Image src={sleepingIcon} alt="logo" boxSize={24} />
      <Text fontSize="2xl" fontWeight="extrabold" color="gray.300">
        Emails caught up!
      </Text>
    </>
  );
}

import { Image, Text } from '@chakra-ui/react';
import sleepingIcon from '../../../../assets/sleeping.svg';

export default function Important() {
  return (
    <>
      <Image src={sleepingIcon} alt="logo" boxSize={24} userSelect="none" />
      <Text
        fontSize="2xl"
        fontWeight="extrabold"
        color="gray.300"
        userSelect="none"
      >
        All caught up!
      </Text>
    </>
  );
}

import {
  Box,
  Divider,
  Flex,
  FormControl,
  IconButton,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import Markdown from 'markdown-to-jsx';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Message } from '../../../types/Chat';
import { SendIcon } from '../../icon/Icons';

export default function Chats() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [streaming, setStreaming] = useState<boolean>(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const value = useColorModeValue(
    'gray.600', // light mode
    'gray.300', // dark mode
  );

  const textAreaColor = useColorModeValue(
    'gray.600', // light mode
    'gray.300', // dark mode
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      content: 'I am your EmailAIAssistant, how can I help you today?',
      role: 'assistant',
      id: '1',
      timestamp: new Date().getTime(),
    },
  ]);
  const messagesRef = useRef<Message[]>(messages);

  useEffect(() => {
    const fetchMessages = async () => {
      const previousMessages =
        await window.electron.ipcRenderer.invoke('get-all-messages');
      setMessages(previousMessages);
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessage = async () => {
    if (message === '' || loading) {
      return;
    }
    setLoading(true);
    const newMessage: Message = {
      content: message,
      role: 'user',
      id: new Date().getTime().toString(),
      timestamp: new Date().getTime(),
    };
    // Send the message
    window.electron.ipcRenderer.invoke('send-message', newMessage);

    setMessages([...messagesRef.current, newMessage]);
    setMessage('');
  };

  const handleInferenceUpdate = (chunk: any) => {
    const chunkJSON = JSON.parse(chunk);
    if (!chunkJSON.done) {
      setStreaming(true);
      // check if the last message is from the assistant
      const lastMessage = messagesRef.current[messagesRef.current.length - 1];
      if (lastMessage.role === 'assistant') {
        lastMessage.content += chunkJSON.message.content;
        setMessages([...messagesRef.current]);
      } else {
        const newMessage: Message = {
          content: chunkJSON.message.content,
          role: 'assistant',
          id: new Date().getTime().toString(),
          timestamp: new Date().getTime(),
        };
        setMessages([...messagesRef.current, newMessage]);
      }
    } else {
      setLoading(false);
      setStreaming(false);
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('inference-update', handleInferenceUpdate);

    // Cleanup
    return () => {
      window.electron.ipcRenderer.removeListener(
        'inference-update',
        handleInferenceUpdate,
      );
    };
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Box
        ref={boxRef}
        w="100%"
        color={value}
        flexGrow={1}
        overflowY="scroll"
        overflowX="hidden"
      >
        {messages.map((msg) => (
          <Box key={msg.id}>
            <Box w="100%" m={4} p={4}>
              <Text fontSize="xs" textTransform="capitalize">
                {msg.role}
              </Text>
              <Text>
                <Markdown>{msg.content}</Markdown>
              </Text>
            </Box>
            {messages.indexOf(msg) !== messages.length - 1 && <Divider />}
          </Box>
        ))}
        {!streaming && loading && (
          <Box w="100%" m={4} p={4}>
            <Text fontSize="xs" textTransform="capitalize">
              Assistant
            </Text>
            <Text>Processing...</Text>
          </Box>
        )}
      </Box>
      <Flex
        as="form"
        gap={4}
        alignItems="center"
        justifyContent="center"
        onSubmit={sendMessage}
        w="100%"
      >
        <FormControl>
          <Textarea
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            color={textAreaColor}
          />
        </FormControl>
        <IconButton
          aria-label="Send"
          icon={<SendIcon />}
          isDisabled={message === ''}
          type="submit"
          borderRadius="full"
          colorScheme="brand"
        />
      </Flex>
    </>
  );
}

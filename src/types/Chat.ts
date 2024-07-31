export interface Message {
  id?: string;
  content: string;
  timestamp?: number;
  role: 'assistant' | 'user';
}

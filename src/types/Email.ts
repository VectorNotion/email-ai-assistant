export default interface Email {
  id: string;
  body: string;
  rawBody: string;
  subject: string;
  from: string;
  _processed: boolean;
  _processing: boolean;
}

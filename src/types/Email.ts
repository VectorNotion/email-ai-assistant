export default interface Email {
  id: string;
  body: string;
  subject: string;
  from: string;
  _processed: boolean;
  _processing: boolean;
}

// The representation for a message as extracted from the database
export type MessageRepresentation = {
  id: number;
  sentTime: Date;
  text: string;
  senderId: number;
  receiverId: number;
  conversationId?: number;
}
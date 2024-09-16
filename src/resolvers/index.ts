import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { Message } from "./Message";
import { Conversation } from "./Conversation";


const resolvers = {
  ...Query,
  ...Mutation,
  ...Conversation,
  ...Message
};

export default resolvers;

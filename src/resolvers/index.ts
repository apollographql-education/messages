import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { Message } from "./Message";
import { Conversation } from "./Conversation";
import { Subscription } from "./Subscription";


const resolvers = {
  ...Query,
  ...Mutation,
  ...Subscription,
  ...Conversation,
  ...Message
};

export default resolvers;

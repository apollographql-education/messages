import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { Message } from "./Message";
import { Conversation } from "./Conversation";
import { Subscription } from "./Subscription";
import { User } from "./User";



const resolvers = {
  ...Query,
  ...Mutation,
  ...Subscription,
  ...Conversation,
  ...Message,
  ...User,
};

export default resolvers;

import { Resolvers } from "../__generated__/resolvers-types";

export const Message: Resolvers = {
  Message: {
    sentFrom: (message) => ({
      id: message.senderId.toString()
    }),
    sentTo: ({ receiverId }) => ({
      id: receiverId.toString()
    })
  }
}
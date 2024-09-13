// A collection of Prisma-focused operations, extracted to keep our resolvers thin!

import { PrismaClient, Prisma } from "@prisma/client";
import { AuthenticationError, NotFoundError } from "../../utils/errors"



export class PrismaDbClient {

  prisma = new PrismaClient();

  findUserConversationWithRecipient = async ({ recipientId, userId }: { recipientId: number, userId: number }) => {
    if (!userId) throw AuthenticationError();
    if (userId === recipientId) throw Error("Please provide a recipient ID different from your own")

    try {
      // Grab user's conversations
      const { conversation: conversationsArray } = await this.prisma.user.findUnique({
        where: {
          id: userId
        },
        include: {
          conversation: {
            include: {
              conversation: {
                include: {
                  participants: true
                }
              }
            }
          }
        }
      })

      // find conversation that has recipient as participant
      const matchedConversationArray = conversationsArray.filter(({ conversation }) => {
        // Only return the conversation that contains the recipient's ID
        return conversation.participants.find(participant => participant.participantId === recipientId)
      })
  

      if (!matchedConversationArray.length) {
        throw NotFoundError();
      }

      const [{ conversation: matchedConversation}] = matchedConversationArray;

  
      // Now fetch additional details about this conversation using the ID we found
      const { id: conversationId, openedTime, ...conversationAttributes } = await this.prisma.conversation.findUnique({
        where: {
          id: matchedConversation.id 
        },
      })
    
    return {
      // Schema expects ID to be a string
      id: conversationId.toString(),
      createdAt: openedTime.toString(),
      ...conversationAttributes
    }
    
    } catch (e) {
      // If conversation lookup fails, throw error
      console.log(e)
      throw Error(e.message)
    }
  }
  
  findUserConversations = async (userId: number) => {
    if (!userId) throw AuthenticationError();
    
    try {
      // Find conversations where user is a participant
      const conversations = await this.prisma.conversationParticipant.findMany({
        where: {
          participantId: userId
        },
        include: {
          conversation: true
        }
      })

      // If there are conversations, map through and return their properties
      return conversations.length ? conversations.map(({ conversation: { id, openedTime, ...conversationAttributes } }) => {
        return {
          id: id.toString(),
          createdAt: openedTime.toString(),
          ...conversationAttributes
        }
      }) : []

    } catch (e) {
      console.log(e)
      throw Error(e.message)
    }
  }

  createNewConversation = async ({ recipientId, userId }: { recipientId: number, userId: number }) => {
    if (!userId) throw AuthenticationError();
    if (userId === recipientId) throw Error("You can't start a conversation with yourself! Maybe try talking to the mirror instead?")

      try {
        // Grab user's conversations
        const user = await this.prisma.user.findUnique({
          where: {
            id: userId
          },
          include: {
            conversation: {
              include: {
                conversation: {
                  include: {
                    participants: true
                  }
                }
              }
            }
          }
        })

        // User could not be found
        if (!user) {
          throw NotFoundError()
        }

        const { conversation: conversationsArray } = user;

        // see if a conversation exists with recipient
        const matchedConversation = conversationsArray.filter(({ conversation }) => {
          // Only return the conversation that contains the recipient's ID
          return conversation.participants.find(participant => participant.participantId === recipientId)
        })
    

        if (matchedConversation.length) {
          throw Error("A conversation already exists between you and the recipient")
        }


        const createdConversation = await this.prisma.conversation.create({
          data: {
            participants: {
            create: [
              {
                participant: {
                  connect: {
                    id: userId
                  }
                }
              },
              {
                participant: {
                  connect: {
                    id: recipientId
                  }
                }
              }
            ]
            }
          }
        })

        const { id: conversationId, openedTime, ...conversationAttributes } = createdConversation;
    
      
        return {
          // Schema expects ID to be a string
          id: conversationId.toString(),
          createdAt: openedTime.toString(),
          ...conversationAttributes
        }
      
      } catch (e) {
        // If conversation creation fails, throw error
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          console.log(e)
          throw Error("The operation failed because one or more records could not be found")
        }
        throw Error(e.message)
      }
  }

}
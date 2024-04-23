import db from '../utils/db';

export async function fetchMessages(conversationId: string, limit: number, offset: number){
  return await db.conversation.findUnique({
    where: {
      id: conversationId
    },
    include: {
      messages: {
        take: limit,
        skip: (offset * limit) - limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: {
              imageUrl: true
            }
          }
        }
      },
      participants: true,
    },
  })
}

export async function getConversation(conversationId: string) {
  return await db.conversation.findUnique({
    where: {
      id: conversationId
    }
  })
}

export async function createConversation(senderId: string, receiverId: string) {
  return await db.conversation.create({
    data: {
      participants: {
        create: [
          {
            user: {
              connect: {
                id: senderId
              }
            }
          },
          {
            user: {
              connect: {
                id: receiverId
              }
            }
          }
        ]
      },
    },
  });

}

interface Message {
  text: string   
  senderId: string    
  conversationId: string  
}

export async function sendMessage(data: Message) {
  return await db.message.create({
    data: {
      text: data.text,
      authorId: data.senderId,
      conversationId:  data.conversationId,
    },
  })
}
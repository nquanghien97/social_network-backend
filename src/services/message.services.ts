import db from '../utils/db';

export async function fetchMessages(conversationId: string, limit: number, offset: number){
  return await db.conversation.findMany({
    where: {
      id: conversationId
    },
    include: {
      messages: {
        take: limit,
        skip: (offset * limit) - limit,
        orderBy: {
          createdAt: 'desc',
        }
      }
    }
  })
}

export async function getConversation(conversationId: string) {
  return await db.conversation.findUnique({
    where: {
      id: conversationId
    }
  })
}

export async function createConversation(senderId: number, receiverId: number) {
  return await db.conversation.create({
    data: {
      participants: {
        connect: [{ id: senderId }, { id: receiverId }],
      },
    },
  });

}

interface Message {
  text: string   
  senderId: number    
  receiverId: number
  conversationId: string  
}

export async function sendMessage(data: Message) {
  return await db.message.create({
    data: {
      text: data.text,
      senderId: data.senderId,
      receiverId: data.receiverId,
      conversation: {
        connect: {
          id: data.conversationId
        }
      },
    },
  })
}
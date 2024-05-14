interface Message {
  text: string   
  senderId: string    
  conversationId: string  
}
import db from '../utils/db';

export async function getMessages(conversationId: string, limit: number, offset: number){
  return await db.conversation.findUnique({
    where: {
      id: conversationId
    },
    include: {
      messages: {
        take: await calculateLimit(conversationId, limit, offset),
        skip: await calculateSkip(conversationId, limit, offset),
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          author: {
            select: {
              imageUrl: true,
              fullName: true,
            }
          },
        }
      },
      participants: true,
    },
  })
}
async function calculateSkip(conversationId: string, limit: number, offset: number) {
  const totalMessages = await db.message.count({
    where: {
      conversationId,
    },
  });
  
  let skip = totalMessages - (offset * limit);
  
  if (skip < 0) {
    skip = 0;
  }

  return skip;
}
async function calculateLimit(conversationId: string, limit: number, offset: number) {
  let limitData = limit
  const totalMessages = await db.message.count({
    where: {
      conversationId,
    },
  });
  
  // Tính toán skip
  if ((totalMessages - ((offset - 1) * limit) < limit)) {
    limitData = totalMessages - (offset - 1) * limit
  }

  return limitData;
}

export async function getConversation(conversationId: string) {
  return await db.conversation.findUnique({
    where: {
      id: conversationId
    },
    select: {
      participants: {
        select: {
          userId: true
        }
      }
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


export async function sendMessage(data: Message) {
  return await db.message.create({
    data: {
      text: data.text,
      authorId: data.senderId,
      conversationId:  data.conversationId,
    },
    include: {
      author: {
        select: {
          id: true,
          imageUrl: true,
          fullName: true,
        }
      },
    }
  })
}
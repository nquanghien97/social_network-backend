import db from '../utils/db.js';
interface Message {
  text: string   
  senderId: string    
  conversationId: string  
}

export async function getMessages(conversationId: string, limit: number, offset: number){
  return await db.conversation.findUnique({
    where: {
      id: conversationId
    },
    include: {
      messages: {
        // take: await calculateLimit(conversationId, limit, offset),
        // skip: await calculateSkip(conversationId, limit, offset),
        take: limit,
        skip: (offset * limit) - limit,
        orderBy: {
          createdAt: 'desc'
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
          user: {
            select: {
              id: true,
              fullName: true,
              imageUrl: true
            }
          }
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

export async function getListConversationsByUserId(userId: string) {
  return await db.conversationUser.findMany({
    where: {
      userId
    },
    select: {
      conversationId: true,
    }
  })
}
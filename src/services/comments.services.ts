import db from '../utils/db';

export async function addComments(userId: number, postId: string, content?: string, parentId?: string) {
  return await db.comments.create({
    data: {
      userId,
      postId,
      content,
      parentId
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      postId: true,
      children: true
    },
  })
}

export async function getComments(postId: string) {
  return await db.comments.findMany({
    where: {
      postId
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        }
      },
      children: {
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              imageUrl: true,
            }
          },
          children: {
            include: {
              author: {
                select: {
                  id: true,
                  fullName: true,
                  imageUrl: true,
                }
              },
              children: {
                include: {
                  author: {
                    select: {
                      id: true,
                      fullName: true,
                      imageUrl: true,
                    }
                  },
                  children: true
                }
              }
            }
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })
}
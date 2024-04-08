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
    orderBy: {
      createdAt: 'desc',
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
            },
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
          createdAt: 'desc',
        },
      },
    },
  })
}

export async function findCommentById(commentId: string) {
  return await db.comments.findUnique({
    where: {
      id: commentId,
    },
  })
}

export async function deleteComment(commentId: string) {
  const childComments = await db.comments.findMany({
    where: {
      parentId: commentId
    }
  })
  for (const childComment of childComments) {
    await deleteComment(childComment.id);
  }
  await db.comments.delete({
    where: {
      id: commentId
    }
  })
};

export async function editComment(commentId: string, content: string) {
  
};

import { createPostDTO } from '../dto/post.dto';
import cloudinary from '../utils/cloudinary';
import db from '../utils/db';

export async function createPost(newPost: createPostDTO) {
  return await db.post.create({
    data: newPost
  })
}

export async function getAllPost(userId: number) {
  return await db.post.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      title: true,
      text: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          fullName: true,
          job: true,
          imageUrl: true,
        }
      },
      like: true,
      comments: {
        take: 1,
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              imageUrl: true,
            }
          },

        },
        orderBy: {
          updatedAt: 'desc'
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    },
  })
}

export async function getNewFeed(userIds: number[], offset: number, limit: number) {
  return await db.post.findMany({
    // take: limit,
    // skip: (offset * limit) - limit,
    where: {
      userId: {
        in: userIds
      },
    },
    select: {
      id: true,
      title: true,
      text: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          fullName: true,
          job: true,
          imageUrl: true,
        }
      },
      like: true,
      comments: {
        take: 1,
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              imageUrl: true,
            }
          },

        },
        orderBy: {
          updatedAt: 'desc'
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    },
  })
};

export async function deletePost(postId: string, userId: number) {
  return await db.post.delete({
    where: {
      id: postId,
      userId
    }
  })
}

export async function getPostById(postId: string) {
  return await db.post.findUnique({
    where: {
      id: postId
    },
    include: {
      author: true,
      like: true,
      comments: {
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
              createdAt: 'desc',
            },
          },
        }
      }
    },
  })
}
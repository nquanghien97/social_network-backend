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
    },
    orderBy: {
      updatedAt: 'desc'
    },
  })
}

export async function getNewFeed(userIds: number[]) {
  return await db.post.findMany({
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
    },
    orderBy: {
      updatedAt: 'desc'
    },
  })
}

export async function deletePost(postId: string, userId: number) {
  return await db.post.delete({
    where: {
      id: postId,
      userId
    }
  })
}
import { createPostDTO } from '../dto/post.dto';
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
    }
  })
}
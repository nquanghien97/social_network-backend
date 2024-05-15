import db from "../utils/db.js";

export async function likePost(userId: string, postId: string) {
  return await db.like.create({
    data: {
      userId,
      postId
    }
  }) 
}

export async function deleteLikePost(userId: string, postId: string) {
  return await db.like.deleteMany({
    where: {
      userId,
      postId
    }
  }) 
}

export async function getLikePost(userId: string, postId: string) {
  return await db.like.findFirst({
    where: {
      userId,
      postId
    }
  })
}
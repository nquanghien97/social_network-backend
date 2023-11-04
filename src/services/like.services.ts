import db from "../utils/db";

export async function likePost(userId: number, postId: string) {
  return await db.like.create({
    data: {
      userId,
      postId
    }
  }) 
}

export async function deleteLikePost(userId: number, postId: string) {
  return await db.like.deleteMany({
    where: {
      userId,
      postId
    }
  }) 
}

export async function getLikePost(userId: number, postId: string) {
  return await db.like.findFirst({
    where: {
      userId,
      postId
    }
  })
}
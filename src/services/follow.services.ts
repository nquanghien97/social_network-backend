import { FollowDTO } from '../dto/follow.dto.js';
import db from '../utils/db.js';

export async function followUser(data: FollowDTO) {
  return await db.follows.create({
    data
  })
}

export async function findFollowById({ followerId, followingId }: {followerId: string, followingId: string}) {
  return await db.follows.findFirst({
    where: {
      followerId,
      followingId
    },
    include: {
      follower: true,
    }
  })
}

export async function deleteFollowById({ followerId, followingId }: {followerId: string, followingId: string}) {
  return await db.follows.deleteMany({
    where: {
      followerId,
      followingId
    },
  })
}

export async function getFollowerById(userId: string) {
  return await db.follows.findMany({
    where: {
      followerId: userId
    },
    select: {
      following: {
        select: {
          id: true,
          fullName: true,
          email: true,
          imageUrl: true,
        }
      }
    }
  })
}

export async function getFollowingById(userId: string) {
  return await db.follows.findMany({
    where: {
      followingId: userId
    },
    select: {
      follower: {
        select: {
          id: true,
          fullName: true,
          email: true,
          imageUrl: true,
        }
      }
    }
  })
}
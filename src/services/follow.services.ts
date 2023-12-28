import { FollowDTO } from '../dto/follow.dto';
import db from '../utils/db';

export async function followUser(data: FollowDTO) {
  return await db.follows.create({
    data
  })
}

export async function findFollowById({ followerId, followingId }: {followerId: number, followingId: number}) {
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

export async function deleteFollowById({ followerId, followingId }: {followerId: number, followingId: number}) {
  return await db.follows.deleteMany({
    where: {
      followerId,
      followingId
    },
  })
}

export async function getFollowerById(userId: number) {
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

export async function getFollowingById(userId: number) {
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
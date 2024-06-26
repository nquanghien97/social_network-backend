import { AddNewFriendDTO } from "../dto/friend.dto.js";
import db from "../utils/db.js";


export async function getAllFriends(userId: string) {
  return await db.friends.findMany({
    where: {
      userId
    },
    select: {
      friend: {
        select: {
          id: true,
          fullName: true,
          email: true,
          imageUrl: true,
          job: true,
        },
      },
    },
  })
}

export async function getFriendsOfuser(friendId: string) {
  return await db.friends.findMany({
    where: {
      friendId
    },
    select: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          imageUrl: true,
          job: true,
        },
      },
    },
  })
}

export async function addNewFriend(data: AddNewFriendDTO) {
  return await db.friends.create({
    data: data
  })
}

export async function findFriendById({ friendId, userId }: {friendId: string, userId: string}) {
  return await db.friends.findFirst({
    where: {
      friendId,
      userId
    }
  })
}

export async function deleteFriendById({ friendId, userId }: {friendId: string, userId: string}) {
  return await db.friends.deleteMany({
    where: {
      friendId,
      userId
    }
  })
}
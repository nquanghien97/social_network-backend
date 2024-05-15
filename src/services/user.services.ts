import { createUserDTO, updateAvatarDTO, updateUserDTO } from "../dto/user.dto.js";
import UserEntity from "../entities/user.entity.js";

import bcrypt from 'bcrypt';
import db from '../utils/db.js';
import { getAllFriends } from "./friend.services.js";

const findUserByEmail = async function (email: string): Promise<UserEntity | null> {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}

async function createUserByEmailAndPassword(user: createUserDTO) {
  user.password = bcrypt.hashSync(user.password, 12);
  return await db.user.create({
    data: user,
  });
}

async function findUserById(id: string) {
  return await db.user.findUnique({
    where: {
      id,
    },
    include: {
      friends: true,
      followers: true,
      following: true,
    }
  });
}

const updateUserById = async (id: string, data: updateUserDTO) => {
  const updateUser = await db.user.update({
    where: {
      id,
    },
    data: data
  })
  return updateUser;
}

function updatePassword(userId: string, password: string) {
  return db.user.update({
    where: {
      id: userId,
    },
    data: {
      password
    }
  })
}

const updateAvatarUser = async (id: string, data: updateAvatarDTO) => {
  return await db.user.update({
    where: {
      id,
    },
    data
  })
}

async function getUser(id: string) {
  return await db.user.findMany({
    where: {
      id,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      imageUrl: true,
      job: true,
    },
  });
}

async function getSuggestionUser(userId: string, offset: number, limit: number) {
  const data = await getAllFriends(userId);
  const listFriends = data.map(({friend}: { friend: any }) => friend.id);
  return await db.user.findMany({
    take: limit,
    skip: (offset * limit) - limit,
    where: {
      id: {
        notIn: [...listFriends, userId]
      },
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      location: true,
      job: true,
      imageUrl: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
});
}

//search users
async function searchUsers(searchText: string) {
  const usersResult = await db.user.findMany({
    where: {
      OR: [
        {
          fullName: {
            contains: searchText,
            mode: 'insensitive',
          },
        }
      ]
    },
  })
  return usersResult;
};

export {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword,
  updateUserById,
  updateAvatarUser,
  getUser,
  getSuggestionUser,
  searchUsers,
  updatePassword
};
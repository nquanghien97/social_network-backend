import { createUserDTO, updateAvatarDTO, updateUserDTO } from "../dto/user.dto";
import UserEntity from "../entities/user.entity";

import bcrypt from 'bcrypt';
import db from '../utils/db';
import { getAllFriends } from "./friend.services";

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

async function findUserById(id: number) {
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

const updateUserById = async (id: number, data: updateUserDTO) => {
  const updateUser = await db.user.update({
    where: {
      id,
    },
    data: data
  })
  return updateUser;
}

function updatePassword(userId: number, password: string) {
  return db.user.update({
    where: {
      id: userId,
    },
    data: {
      password
    }
  })
}

const updateAvatarUser = async (id: number, data: updateAvatarDTO) => {
  return await db.user.update({
    where: {
      id,
    },
    data
  })
}

async function getUser(id: number) {
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

async function getSuggestionUser(userId: number, offset: number, limit: number) {
  const data = await getAllFriends(userId);
  const listFriends = data.map(({friend}) => friend.id);
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
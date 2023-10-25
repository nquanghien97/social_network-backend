import { createUserDTO, updateUserDTO } from "../dto/user.dto";
import UserEntity from "../entities/user.entity";

import bcrypt from 'bcrypt';
import db from '../utils/db';

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

export {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword,
  updateUserById
};
import { createUserDTO } from "../dto/user.dto";
import UserEntity from "../entities/user.entity";

import bcrypt from 'bcrypt';
import db from '../utils/db';

const findUserByEmail = async function(email: string): Promise<UserEntity | null> {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}

function createUserByEmailAndPassword(user: createUserDTO) {
  user.password = bcrypt.hashSync(user.password, 12);
  return db.user.create({
    data: user,
  });
}

function findUserById(id: number) {
  return db.user.findUnique({
    where: {
      id,
    },
  });
}

export {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword
};
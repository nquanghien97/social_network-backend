import db from '../utils/db';
import { hashToken } from '../utils/hashToken';

// used when we create a refresh token.
function addRefreshTokenToWhitelist({ jti, refreshToken, userId }: { jti: string, refreshToken: string, userId: number }) {
  return db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId
    },
  });
}

// used to check if the token sent by the client is in the database.
function findRefreshTokenById(id: string) {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

// soft delete tokens after usage.
function deleteRefreshToken(id: string) {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true
    }
  });
}

function revokeTokens(userId: number) {
  return db.refreshToken.updateMany({
    where: {
      userId
    },
    data: {
      revoked: true
    }
  });
}

function createEmailToken({ userId, token, jti } : {userId: number, token: string, jti: string}) {
  return db.token.create({
    data: {
      id: jti,
      userId,
      token,
    }
  })
};
function findEmailToken(userId: number, token?: string) {
  return db.token.findFirst({
    where: {
      userId,
      token
    }
  })
}

function deleteEmailToken(userId: number, token: string) {
  return db.token.deleteMany({
    where: {
      userId,
      token
    }
  })
}

export {
  addRefreshTokenToWhitelist,
  findRefreshTokenById,
  deleteRefreshToken,
  revokeTokens,
  createEmailToken,
  findEmailToken,
  deleteEmailToken
};
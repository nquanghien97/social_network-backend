import jwt from 'jsonwebtoken';
import UserEntity from "../entities/user.entity";

function generateAccessToken(user: UserEntity) {
  return jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_PRIVATE_KEY as string, {
    expiresIn: '30m',
  });
}
function generateRefreshToken(user: UserEntity, jwtId: string) {
  return jwt.sign({
    userId: user.id,
    jwtId
  }, process.env.REFRESH_TOKEN_PRIVATE_KEY as string, {
    expiresIn: '3 days',
  });
}

function generateTokens(user: UserEntity, jwtId: string) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jwtId);

  return {
    accessToken,
    refreshToken,
  };
}

export {
  generateAccessToken,
  generateRefreshToken,
  generateTokens
};
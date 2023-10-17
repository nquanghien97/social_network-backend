import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { generateTokens } from '../utils/jwt';
import { addRefreshTokenToWhitelist, deleteRefreshToken, findRefreshTokenById } from '../services/auth.services';
import {
  findUserByEmail,
  createUserByEmailAndPassword,
  findUserById,
} from '../services/user.services';
import { hashToken } from '../utils/hashToken';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'You must provide an email and a password.'
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Tài khoản đã tồn tại'
      });
    }

    const user = await createUserByEmailAndPassword({ email, password });
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

    res.status(200).json({
      success: true,
      message: "Register successfully",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: user
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password }: {email: string, password: string} = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản không tồn tại",
      })
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      res.status(403).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác",
      })
    }

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id });

    res.status(200).json({
      succcess: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
        user: existingUser
      }
    });
  } catch (err) {
    next(err);
  }
});


// refresh token
interface payloadJwt extends JwtPayload {
  jti: string;
}

router.post('/refreshToken', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error('Missing refresh token.');
    }
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY as string) as payloadJwt;
    const savedRefreshToken = await findRefreshTokenById(payload.jwtId);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    next(err);
  }
});

export default router;
import { Router, Response, NextFunction, Request } from 'express';
import { findUserById } from '../services/user.services';
import verifyToken from '../middleware/auth';

const router = Router();

router.post('/user',verifyToken, async (req: any, res: Response, next: NextFunction) => {
  const userId = req.userId;
  if(!userId) return res.status(401).json({
    success: false,
    message: "Unauthorized"
  })
  try {
    const user = await findUserById(userId);
    if(!user) return res.status(401).json({
      success: false,
      message: "Unauthorized"
    })
    res.status(200).json({
      success: true,
      message: "Get User Success",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        location: user.location,
        avatar: user.avatar,
        description: user.description,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "User does not exist",
      error: err.message,
    })
  }
})

export default router
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
    res.status(400).json({
      success: true,
      message: "Get User Success",
      user: user
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
import { Router, Response, NextFunction, Request } from 'express';
import { findUserById, updateUserById } from '../services/user.services';
import verifyToken from '../middleware/auth';

const router = Router();

router.get('/user',verifyToken, async (req: any, res: Response) => {
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
        job: user.job,
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

router.post('/update-user', verifyToken, async (req: any, res: Response) => {
  const userId = req.userId;
  const { fullName, location, description, job } = req.body;
  if(!userId) return res.status(401).json({
    success: false,
    message: "Unauthorized"
  })
  try {
    const updateUser = await updateUserById(userId, { fullName, location, description, job })
    return res.status(200).json({
      success: true,
      message: 'Update User Successfully',
      user: updateUser
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Update User Error",
      error: err.message,
    })
  }
})
                      
export default router
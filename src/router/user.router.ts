import { Router, Response } from 'express';
import { findUserById, updateUserById } from '../services/user.services';
import verifyToken from '../middleware/auth';
import multer from '../utils/multer';
import cloudinary from '../utils/cloudinary';

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
      message: "user not found"
    })
    res.status(200).json({
      success: true,
      message: "Get User Success",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        location: user.location,
        imageUrl: user.imageUrl,
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

router.post('/update-user', multer.single('image'), verifyToken, async (req: any, res: Response) => {
  const userId = req.userId;
  const { fullName, location, description, job } = req.body;
  if(!userId) return res.status(401).json({
    success: false,
    message: "Unauthorized"
  })
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "social-network/user",
      use_filename: true,
    });
  
    const updateUser = await updateUserById(
      userId,
      {
        fullName,
        location,
        description,
        job,
        imageUrl: result.secure_url,
        cloudinary_id: result.public_id
      })
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

router.post('/find-user', verifyToken, async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await findUserById(userId);
    if(!user) return res.status(401).json({
      success: false,
      message: "user not found",
    })
    res.status(200).json({
      success: true,
      message: "Get User Success",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        location: user.location,
        imageUrl: user.imageUrl,
        description: user.description,
        job: user.job,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Get User Error",
      error: err.message,
  })
  }
});
                      
export default router
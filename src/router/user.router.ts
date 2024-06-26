import { Router, Response } from 'express';
import { findUserById, getSuggestionUser, searchUsers, updateAvatarUser, updatePassword, updateUserById } from '../services/user.services.js';
import verifyToken from '../middleware/auth.js';
import multer from '../utils/multer.js';
import cloudinary from '../utils/cloudinary.js';

const router = Router();

router.get('/current-user', verifyToken, async (req: any, res: Response) => {
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
        friendQuantity: user.friends.length,
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

router.post('/update-avatar', multer.single('image'), verifyToken, async (req: any, res: Response) => {
  const userId = req.userId;
  let result;
  try {
    const user = await findUserById(userId);
    if(!user?.imageUrl && req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "social-network/user",
        use_filename: true,
      });
    }
    if(!req.file) {
      return res.status(500).json({
        success: false,
        message: "Update Avatar Error",
      })
    }
    if(req.file && user?.imageUrl) {
      await cloudinary.v2.uploader.destroy(user.cloudinary_id as string);
      result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "social-network/user",
        use_filename: true,
      });
    }
  
    const updateUser = await updateAvatarUser(
      userId,
      {
        imageUrl: result?.secure_url || user?.imageUrl as string,
        cloudinary_id: result?.public_id || user?.cloudinary_id as string
      })
    return res.status(200).json({
      success: true,
      message: 'Update Avatar User Successfully',
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

router.post('/update-user', verifyToken, async (req: any, res: Response) => {
  const userId = req.userId;
  const { fullName, location, description, job } = req.body;
  if(!userId) return res.status(401).json({
    success: false,
    message: "Unauthorized"
  })
  try {  
    const updateUser = await updateUserById(
      userId,
      {
        fullName,
        location,
        description,
        job,
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

router.post('/user', verifyToken, async (req, res) => {
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
        ...user,
        friendQuantity: user.friends.length,
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

router.post('/suggestions-user', verifyToken, async (req: any, res) => {
  const userId = req.userId;
  const { offset, limit } = req.body
  try {
    const suggesttionsUser = await getSuggestionUser(userId, offset, limit)
    return res.status(200).json({
      success: true,
      message: "Get Suggestions User successfully",
      total: suggesttionsUser.length,
      suggesttionsUser
    })
  } catch(err: any) {
    res.status(500).json({
      success: false,
      message: "Get Suggestion User Error",
      error: err.message,
  })
  }
});

router.post('/search-users', verifyToken, async (req: any, res) => {
  const { searchText } = req.body
  try {
    const usersResult = await searchUsers(searchText);
    return res.status(200).json({
      success: true,
      message: "Get Suggestions User successfully",
      users: usersResult
    })
  } catch(err: any) {
    res.status(500).json({
      success: false,
      message: "Get Suggestion User Error",
      error: err.message,
  })
  }
});
           
export default router
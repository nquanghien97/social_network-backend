import { Router, Response } from 'express';
import verifyToken from '../middleware/auth';
import { deleteLikePost, getLikePost, likePost } from '../services/like.services';

const router = Router();

router.post('/like', verifyToken, async (req: any, res) => {
  const userId = req.userId;
  const { postId } = req.body;
  try {
    if(!userId) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized"
      })
    }
    const likedPost = await getLikePost(userId, postId)
    if(likedPost) {
      await deleteLikePost(userId, postId)
      return res.status(200).json({
        success: true,
        message: "unlike post successfully"
      })
    }
    await likePost(userId, postId)
    return res.status(200).json({
      success: true,
      message: "like post successfully"
    })
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "Like failed"
    })
  }
})


export default router;
import { Router, Response } from 'express';
import verifyToken from '../middleware/auth';
import { createPost, getAllPost } from '../services/post.services';

const router = Router();

router.post('/post', verifyToken, async (req: any, res: Response) => {
  const userId = req.userId;
  const { title, text, imageUrl } = req.body;
  console.log(imageUrl)
  if (!userId) return res.status(401).json({
    success: false,
    message: "Unauthorized"
  })
  try {
    const newPost = await createPost({ userId, title, text, imageUrl })
    return res.status(200).json({
      success: true,
      message: "Post created successfully",
      post: newPost
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Create post failed",
      error: err.message,
    })
  }
})

router.get('/post', verifyToken, async (req: any, res: Response) => {
  const userId = req.userId;
  if(!userId) return res.status(401).json({
    success: false,
    message: "Unauthorized"
  })
  try {
    const data = await getAllPost(userId)
    return res.status(200).json({
      success: true,
      message: "Get post successfully",
      post: data
    })
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: "Get Post Failed",
      error: err.message
    })
  }
});

export default router;




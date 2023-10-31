import { Router, Response } from 'express';
import verifyToken from '../middleware/auth';
import { createPost, deletePost, getAllPost, getNewFeed } from '../services/post.services';
import cloudinary from '../utils/cloudinary';
import { createPostDTO } from '../dto/post.dto';
import multer from '../utils/multer';

const router = Router();

router.post('/post', multer.single('image'), verifyToken, async (req: any, res: Response) => {

  const result = await cloudinary.v2.uploader.upload(req.file.path, {
    folder: "social-network/post",
    use_filename: true,
  });

  const userId = req.userId;
  const { title, text } = req.body;
  if (!userId) return res.status(401).json({
    success: false,
    message: "Unauthorized"
  })
  const postData: createPostDTO = {
    title: title,
    text: text,
    imageUrl: result.secure_url,
    cloudinary_id: result.public_id,
    userId
  }
  try {
    const newPost = await createPost(postData);
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
    const data = await getAllPost(userId);
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

router.post('/feed', verifyToken, async (req: any, res: Response) =>{
  const userId = req.userId
  const { listFriendsId } = req.body
  try {
    const data = await getNewFeed([...listFriendsId, userId]);
    return res.status(200).json({
      success: true,
      message: "Get post successfully",
      posts: data
    })
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: "Get Post Failed",
      error: err.message
    })
  }
});

router.delete('/post', verifyToken, async (req: any, res: Response) => {
  const userId = req.userId;
  const { postId } = req.body;
  try {
    await deletePost(postId, userId);
    return res.status(200).json({
      success: true,
      message: "Delete post successfully",
    })
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: "Delete post failed",
      error: err.message
    })
  }
})

export default router;




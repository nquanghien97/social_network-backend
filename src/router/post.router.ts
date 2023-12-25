import { Router, Response } from 'express';
import verifyToken from '../middleware/auth';
import { createPost, deletePost, getAllPost, getNewFeed, getPostById } from '../services/post.services';
import cloudinary from '../utils/cloudinary';
import { createPostDTO } from '../dto/post.dto';
import multer from '../utils/multer';

const router = Router();

router.post('/post', multer.single('image'), verifyToken, async (req: any, res: Response) => {
  const userId = req.userId;
  const { title, text } = req.body;

  try {
    if(!req.file) {
      const postData: createPostDTO = {
        title: title,
        text: text,
        userId
      }
      const newPost = await createPost(postData);
      return res.status(200).json({
        success: true,
        message: "Post created successfully",
        post: newPost
      })
    }
    
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "social-network/post",
      use_filename: true,
    });
    
    const postData: createPostDTO = {
      title: title,
      text: text,
      imageUrl: result.secure_url,
      cloudinary_id: result.public_id,
      userId
    }
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

//get post
router.post('/posts', verifyToken, async (req: any, res: Response) => {
  const { userId } = req.body
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

//get single post
router.get('/post/:postId', verifyToken, async (req: any, res) => {
  const { postId } = req.params;
  try {
    const postById = await getPostById(postId)
    return res.status(200).json({
      success: true,
      message: "Get post successfully",
      post: {
        ...postById,
        likeCount: postById?.like.length
      }
    })
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: "Get Post Failed",
      error: err.message
    })
  }
})

//get new feed
router.post('/feed', verifyToken, async (req: any, res: Response) =>{
  const userId = req.userId
  const { listFriendsId, offset, limit } = req.body
  try {
    const data = await getNewFeed([...listFriendsId, userId], offset, limit);
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
    const post = await getPostById(postId);
    await deletePost(postId, userId);
    if (post) {
      await cloudinary.v2.uploader.destroy(post.cloudinary_id as string);
    }
    return res.status(200).json({
      success: true,
      message: "Delete post successfully",
      post
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




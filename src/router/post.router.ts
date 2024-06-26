import { Router, Response } from 'express';
import verifyToken from '../middleware/auth.js';
import { createPost, deletePost, getAllPost, getImagesOfPost, getNewFeed, getPostById, updatePost } from '../services/post.services.js';
import cloudinary from '../utils/cloudinary.js';
import { createPostDTO } from '../dto/post.dto.js';
import multer from '../utils/multer.js';

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
  const userId = req.userId;
  const { limit, offset } = req.body;
  if(!userId) return res.status(401).json({
    success: false,
    message: "Unauthorized"
  })
  try {
    const data = await getAllPost(userId, limit, offset);
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
    if(!postById) return res.status(400).json({
      success: false,
      message: "Post not found"
    })
    return res.status(200).json({
      success: true,
      message: "Get post successfully",
      post: postById
    })
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: "Get Post Failed",
      error: err.message
    })
  }
});

router.post('/update-post/:postId', multer.single('image'), verifyToken, async (req: any, res) => {
  const { postId } = req.params;
  const { title, text } = req.body;
  let result;
  try {
    const postById = await getPostById(postId)
    if(!postById) return res.status(400).json({
      success: false,
      message: "Post not found"
    });
    if(!req.file) {
      const postUpdated = await updatePost(postId, { title, text });
      return res.status(200).json({
        success: true,
        message: "Update post successfully",
        post: postUpdated
      })
    }
    if(req.file && postById.imageUrl) {
      await cloudinary.v2.uploader.destroy(postById.cloudinary_id as string);
      result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "social-network/post",
        use_filename: true,
      })
    }
    if(req.file && !postById.imageUrl) {
      result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "social-network/post",
        use_filename: true,
      })
      console.log(result)
    }
    const newPost = await updatePost(postId, {
      title,
      text,
      imageUrl: result?.secure_url || postById.imageUrl as string,
      cloudinary_id: result?.public_id || postById.cloudinary_id as string,
    })
    return res.status(200).json({
      success: true,
      message: "Update post successfully",
      post: newPost
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
      message: "Get feed successfully",
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

//delete post
router.delete('/post', verifyToken, async (req: any, res: Response) => {
  const userId = req.userId;
  const { postId } = req.body;
  try {
    const post = await getPostById(postId);
    await deletePost(postId, userId);
    if (post?.cloudinary_id) {
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

router.post('/photos',verifyToken, async (req: any, res) => {
  const { userId } = req.body;
  try {
    const imagesUser = await getImagesOfPost(userId);
    return res.status(200).json({
      success: true,
      message: "Get Images User Successfully",
      imagesUser
    })
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: "get Images Failed",
      error: err.message,
    })
  }
});

export default router;




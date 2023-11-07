import { Router } from 'express';
import verifyToken from '../middleware/auth';
import { addComments, deleteComment, getComments } from '../services/comments.services';
import CommentEntity from '../entities/comment.entity';

const router = Router();

router.post('/comments', verifyToken, async (req: any, res) => {
  const userId = req.userId;
  if(!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    })
  }
  const { postId, content, parentId } = req.body;
  try {
    const comments = await addComments(userId, postId, content, parentId);
    return res.status(200).json({
      success: true,
      message: "create comment successfully",
      comments
    })
  } catch(err: any) {
    res.status(400).json({
      success: false,
      message: "create comment failed",
      error: err.message
    })
  }
})

router.post('/get-comments', verifyToken, async (req: any, res) => {
  const userId = req.userId;
  const { postId } = req.body;
  if(!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    })
  }
  try {
    const comments = await getComments(postId);
    
    const result = comments.filter((comment) => {
      return comment.parentId === null
    })
    return res.status(200).json({
      success: true,
      message: "get comments successfully",
      comments: result
    })
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: "get comments failed",
      error: err.message
    })
  }
});

router.delete('/comments', verifyToken, async (req: any, res) => {
  const { commentId } = req.body;
  try {
    await deleteComment(commentId)
    return res.status(200).json({
      success: true,
      message: "Delete comment successfully"
    })
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: "Delete comments failed",
      error: err.message
    })
  }
})

export default router;

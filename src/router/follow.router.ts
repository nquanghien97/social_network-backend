import { Router } from 'express';
import verifyToken from '../middleware/auth.js';
import { deleteFollowById, findFollowById, followUser, getFollowerById, getFollowingById } from '../services/follow.services.js';

const router = Router();

router.post('/follow', verifyToken, async (req: any, res) => {
  const followerId = req.userId;
  const { followingId } = req.body
  try {
    const existingFollow = await findFollowById({ followerId, followingId })
    if(existingFollow) {
      await deleteFollowById({ followerId, followingId })
      return res.status(200).json({
        success: true,
        message: "Unfollow User successfully",
      })
    }
    await followUser({ followerId, followingId })
    return res.status(200).json({
      success: true,
      message: "Follow User successfully",
    })
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
    })
  }
})

router.post('/get-follower', verifyToken, async (req: any, res) => {
  const userId = req.userId;
  try {
    const response = await getFollowingById(userId)
    const following = response.map(({follower}: { follower: any}) => follower)
    return res.status(200).json({
      following,
      success: true,
      message: "get Follow successfully",
    })
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "something went wrong",
    })
  }
})

router.post('/get-following', verifyToken, async (req: any, res) => {
  const userId = req.userId;
  try {
    const response = await getFollowerById(userId)
    const follower = response.map(({following} : { following: any}) => following)
    return res.status(200).json({
      follower,
      success: true,
      message: "get Follow successfully",
    })
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "something went wrong",
    })
  }
})

export default router;
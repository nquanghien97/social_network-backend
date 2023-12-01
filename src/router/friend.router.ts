import { Router } from "express";
import verifyToken from "../middleware/auth";
import { addNewFriend, deleteFriendById, findFriendById, getAllFriends } from "../services/friend.services";

const router = Router();

router.post('/add-friend', verifyToken, async (req: any, res) => {
  const userId = req.userId;
  const { friendId } = req.body;
  if(!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    })
  }
  try {
    const existingFriend = await findFriendById({friendId, userId})
    if(existingFriend) {
      return res.status(401).json({
        success: false,
        message: "Friend already exists"
      })
    }
    const data = await addNewFriend({userId, friendId})
    return res.status(200).json({
      success: true,
      message: "Add Friend successfully",
    })
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: "Failed to add friend",
      error: err.message
    })
  }
})

router.post('/friend', verifyToken, async (req: any, res) => {
  const { userId } = req.body;
  
  try {
    const data = await getAllFriends(userId);
    const listFriends = data.map(({friend}) => friend);

    return res.status(200).json({
      success: true,
      message: "get Friends successfully",
      listFriends
    })
  } catch (err: any){
    res.status(400).json({
      success: false,
      message: "Failed to get friend",
      error: err.message
    })
  }
})

router.post('/find-friend', verifyToken, async (req: any, res) =>{
  const userId = req.userId;
  const { friendId } = req.body
  if(!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    })
  }
  try{
    const friend = await findFriendById({friendId, userId})
    if(!friend) {
      return res.status(400).json({
        success: false,
        message: "Friend not found",
      })
    }
    return res.status(200).json({
      success: true,
      message: "get Friends successfully",
      friend
    })
  } catch(err: any) {
    res.status(400).json({
      success: false,
      message: "Failed to get friend",
      error: err.message
    })
  }
});

router.delete('/friend', verifyToken, async (req: any, res) => {
  const userId = req.userId;
  const { friendId } = req.body;
  try {
    const existingFriend = await findFriendById({friendId, userId});
    if(!existingFriend){
      return res.status(404).json({
        success: false,
        message: "Friend not found",
      })
    }
    await deleteFriendById({friendId, userId});
    return res.status(200).json({
      success: true,
      message: "Friend deleted successfully",
    })
  } catch(err: any) {
    res.status(400).json({
      success: false,
      message: "Delete friend failed",
      error: err.message
    })
  }
});

router.get('/id-friend', verifyToken, async (req: any, res) => {
  const userId = req.userId;
  if(!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    })
  }
  try {
    const data = await getAllFriends(userId);
    const listFriendsId = data.map(({friend}) => friend.id);

    return res.status(200).json({
      success: true,
      message: "get Friends successfully",
      listFriendsId
    })
  } catch (err: any){
    res.status(400).json({
      success: false,
      message: "Failed to get friend",
      error: err.message
    })
  }
})


export default router;

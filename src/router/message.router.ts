import { Router } from 'express';
import { createConversation, getConversation, getMessages, sendMessage } from '../services/message.services';
import verifyToken from '../middleware/auth';
import db from '../utils/db';

const router = Router();

router.post('/conversation', verifyToken, async (req: any, res) => {
  const senderId = req.userId;
  const { receiverId } = req.body;
  try {
    const participants = [senderId, receiverId]
    const query = {
      AND: participants.map((participantId) => ({
        participants: {
          some: {
            userId: participantId,
          },
        },
      })),
    };
    const exisConversation = await db.conversation.findMany({
      where: query,
    })
    if(exisConversation.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Get Conversation Successfully",
        conversation: exisConversation[0]
      })
    }
    const newConversation = await createConversation(senderId, receiverId)
    return res.status(200).json({
      success: true,
      message: "Get Conversation Successfully",
      conversation: newConversation
    })
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      message: err.message
    })
  }
})

//get messages
router.post('/messages', verifyToken, async (req: any, res) => {
  const { limit, offset, conversationId } = req.body;
  if(!conversationId) return res.status(404).json({
    sucess: false,
    message: "Không tìm thấy cuộc hội thoại"
  })
  try {
    const message = await getMessages(conversationId, limit, offset);
    return res.status(200).json({
      success: true,
      message,
    })
  }catch (err: any) {
    return res.status(404).json({
      success: false,
      message: err.message,
    })
  }
});

router.post('/messages-userId', verifyToken, async (req: any, res) => {
  const userId = req.userId
  const { conversationId } = req.body;
  const conversation = await getConversation(conversationId);
  const listUserIdOfConversation = conversation?.participants.filter((user) => user.userId !== userId)
  return res.status(200).json(listUserIdOfConversation)
});

router.post('/send-messages', verifyToken, async (req: any, res) => {
  const senderId = req.userId;
  const { conversationId, text } = req.body;
  try {
    // Kiểm tra xem cuộc trò chuyện có tồn tại không
    const conversation = await getConversation(conversationId);

    if (!conversation) {
      throw new Error(`Conversation with id ${conversationId} not found.`);
    }

    // Tạo tin nhắn mới và liên kết nó với cuộc trò chuyện
    const message = await sendMessage({text, senderId, conversationId})

    return res.status(200).json(message);
  } catch (error: any) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
})

export default router;

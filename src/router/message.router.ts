import { Router } from 'express';
import { createConversation, fetchMessages, getConversation, sendMessage } from '../services/message.services';
import verifyToken from '../middleware/auth';

const router = Router();

router.post('/create-conversation', verifyToken, async (req: any, res) => {
  const senderId = req.userId;
  const { receiverId } = req.body;
  try {
    const conversation = await createConversation(senderId, receiverId)
    return res.status(200).json({
      success: true,
      message: "Conversation created",
      conversation
    })
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      message: err.message
    })
  }
})

router.post('/messages', verifyToken, async (req: any, res) => {
  const { limit, offset, conversationId } = req.body;
  if(!conversationId) return res.status(404).json({
    sucess: false,
    message: "Không tìm thấy cuộc hội thoại"
  })
  try {
    const message = await fetchMessages(conversationId, limit, offset);
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
})

router.post('/send-messages', verifyToken, async (req: any, res) => {
  const senderId = req.userId;
  const { receiverId, conversationId, text } = req.body;
  try {
    // Kiểm tra xem cuộc trò chuyện có tồn tại không
    const conversation = await getConversation(conversationId);

    if (!conversation) {
      throw new Error(`Conversation with id ${conversationId} not found.`);
    }

    // Tạo tin nhắn mới và liên kết nó với cuộc trò chuyện
    const message = await sendMessage({text, senderId, receiverId, conversationId})

    return res.status(200).json(message);
  } catch (error: any) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
})

export default router;
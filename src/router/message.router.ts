import { Router } from 'express';
import { fetchMessages, getConversation, sendMessage } from '../services/message.services';
import verifyToken from '../middleware/auth';
import { findUserById } from '../services/user.services';

const router = Router();

router.post('/messages', async (req: any, res) => {
  const conversationId = req.params.conversationId;
  const { limit, offset } = req.body;
  if(!conversationId) return res.status(404).json({
    sucess: false,
    message: "Không tìm thấy cuộc hội thoại"
  })
  try {
    const message = await fetchMessages(conversationId, limit, offset);
    return res.status(200).json({
      success: true,
      message
    })
  }catch (err: any) {
    return res.status(404).json({
      success: false,
      message: err.message
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

    // Kiểm tra xem cả người gửi và người nhận có tồn tại không
    const sender = await findUserById(senderId);
    const receiver = await findUserById(receiverId);

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found.');
    }

    // Tạo tin nhắn mới và liên kết nó với cuộc trò chuyện
    const message = await sendMessage({text, senderId, receiverId, conversationId})

    return message;
  } catch (error: any) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
})

export default router;

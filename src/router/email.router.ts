import { Router } from "express";
import { findUserByEmail, findUserById, updatePassword } from "../services/user.services";
import { createEmailToken, deleteEmailToken, findEmailToken } from "../services/auth.services";
import { v4 as uuidv4 } from 'uuid';
import sendEmail from "../utils/email";
import bcrypt from 'bcrypt';

const router = Router();

router.post('/reset-password', async (req: any, res) => {
  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email không chính xác",
      })
    }
    let token = await findEmailToken(user.id);
    if (!token) {
      token = await createEmailToken({
        userId: user.id,
        token: uuidv4(),
        jti: uuidv4()
      });
    }
    const link = `${process.env.BASE_URL}/password-reset/${user.id}/${token.token}`;
    await sendEmail({
      email: user.email,
      subject: "Password reset",
      text: link,
    });
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email account"
    })
  } catch(err: any) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: err.message
    })
  }
});

router.post('/:id/:token', async (req: any, res) => {
  const { password } = req.body;
  const userId = Number(req.params.id)
  const emailToken = req.params.token
  try {
    const user = await findUserById(userId);
    if (!user) return res.status(400).json({
      success: false,
      message: "invalid link or expired"
    });
    const token = await findEmailToken(user.id, emailToken);
    if (!token) return res.status(400).json({
      success: false,
      message: "Invalid link or link expired"
    });
    const hashPassword = bcrypt.hashSync(password, 12);
    await updatePassword(userId, hashPassword);
    await deleteEmailToken(userId, emailToken);
    return res.status(200).json({
      success: true,
      message: "Password reset successfully"
    })
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: err.message
    })
  }
});

export default router;

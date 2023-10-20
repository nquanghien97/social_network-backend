import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthJwt extends JwtPayload {
  userId: number;
}

export default function verifyToken(req: any, res: Response, next: NextFunction) {
	const authHeader = req.header('Authorization');
	if(!authHeader) {
		res.json(401).json({
			success: false,
			message: 'UnAuthorized'
		})
	}
	const token = authHeader && authHeader.split(' ')[1]

	if (!token)
		return res
      .status(401)
			.json({ success: false, message: 'Access token not found' })

	try {
		const payload = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY as string) as AuthJwt

		req.userId = payload.userId
		next()
	} catch (error) {
		console.log(error)
		return res
			.status(401)
			.json({ success: false, message: 'Invalid token' })
	}
}
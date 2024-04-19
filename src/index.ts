import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import { createServer } from 'http';
import { Server } from 'socket.io';

import authRouter from './router/auth.router';
import userRouter from './router/user.router';
import postRouter from './router/post.router';
import friendRouter from './router/friend.router';
import likeRouter from './router/like.router';
import followRouter from './router/follow.router';
import commentsRouter from './router/comments.router';
import passwordRouter from './router/password.router';
import messageRouter from './router/message.router';

const port = 5000;
const app = express();
const httpServer = createServer(app);

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);

app.use('/api', userRouter);
app.use('/api/', postRouter);
app.use('/api/', friendRouter);
app.use('/api/', likeRouter);
app.use('/api/', followRouter);
app.use('/api/', commentsRouter);
app.use('/api/', passwordRouter);
app.use('/api/', messageRouter)

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Social-network Project!!',
  });
});

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`)
})



httpServer.listen(port, function () {
    console.log(`App Listening on port ${port}`);
});

export default app;

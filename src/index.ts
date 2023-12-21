import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import authRouter from './router/auth.router';
import userRouter from './router/user.router';
import postRouter from './router/post.router';
import friendRouter from './router/friend.router';
import likeRouter from './router/like.router';
import commentsRouter from './router/comments.router';

const port = 5000;
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);

app.use('/api', userRouter);
app.use('/api/', postRouter);
app.use('/api/', friendRouter);
app.use('/api/', likeRouter);
app.use('/api/', commentsRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Project!!',
  });
});

app.listen(port, function () {
    console.log(`App Listening on port ${port}`);
});
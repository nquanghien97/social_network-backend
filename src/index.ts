import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import { createServer } from 'http';

import authRouter from './router/auth.router';
import userRouter from './router/user.router';
import postRouter from './router/post.router';
import friendRouter from './router/friend.router';
import likeRouter from './router/like.router';
import followRouter from './router/follow.router';
import commentsRouter from './router/comments.router';
import passwordRouter from './router/password.router';

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
app.use('/api/', followRouter);
app.use('/api/', commentsRouter);
app.use('/api/', passwordRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Social-network Project!!',
  });
});

//socket.io
const httpServer = createServer(app);
import { Server } from 'socket.io';

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log("connection")
  socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
    io.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
})



httpServer.listen(port, function () {
    console.log(`App Listening on port ${port}`);
});

export default app;

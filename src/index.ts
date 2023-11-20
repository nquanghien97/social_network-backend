import express from 'express';
import mysql from 'mysql';
import * as dotenv from 'dotenv';
import cors from 'cors';

import authRouter from './router/auth.router';
import userRouter from './router/user.router';
import postRouter from './router/post.router';
import friendRouter from './router/friend.router';
import likeRouter from './router/like.router';
import commentsRouter from './router/comments.router';
import { Router } from 'express-serve-static-core';

const port = 5000;
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowCors = (fn: any) => async (req: Request, res: any) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
  }

app.use('/api/auth', allowCors(authRouter))

app.use('/api', userRouter);
app.use('/api/', postRouter);
app.use('/api/', friendRouter);
app.use('/api/', likeRouter);
app.use('/api/', commentsRouter);

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.listen(port, function () {
    console.log(`App Listening on port ${port}`);
});
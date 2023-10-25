import express from 'express';
import mysql from 'mysql';
import * as dotenv from 'dotenv';
import cors from 'cors';

import authRouter from './router/auth.router';
import userRouter from './router/user.router';
import postRouter from './router/post.router'

const port = 5000;
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter)

app.use('/api', userRouter);
app.use('/api/', postRouter);

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Quanghien119',
    database: 'social',
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.listen(port, function () {
    console.log(`App Listening on port ${port}`);
});
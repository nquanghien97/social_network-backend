import { Request, Response } from 'express';
import express from 'express';
import  mysql from 'mysql';
import * as dotenv from 'dotenv';
import cors from 'cors';

import authRouter from './router/auth.router';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter)

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Quanghien119',
    database: 'social',
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.listen(3000, function(){
    console.log('App Listening on port 3000');
});
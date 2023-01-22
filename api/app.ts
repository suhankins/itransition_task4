import cookieParser from 'cookie-parser';
import express, { json } from 'express';
import { cors } from './cors';
import { usersRouter } from './routes/usersRouter';

export let app = express();

app.use(json());
app.use(cookieParser());
app.use(cors);

app.use(express.static('dist'))
app.use('/api/users', usersRouter);

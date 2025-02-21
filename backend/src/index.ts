import express from 'express';
import cors from 'cors';

import userRouter from './routes/users.route.js';
import authRouter from './routes/auth.route.js';
import bodyParser from 'body-parser';
import errorHandler from './middleware/error.middleware.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

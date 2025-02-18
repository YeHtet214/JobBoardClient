import express from 'express';
import cors from 'cors';

import userRouter from './routes/users.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", userRouter);


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

import express from 'express';
import cors from 'cors'
import authRouter from './routes/auth.route.js';
import profileRouter from './routes/profile.route.js';

const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', authRouter)
app.use('/api/user', profileRouter)

export default app;
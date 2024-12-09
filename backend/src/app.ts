import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import formRoutes from './routes/formRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', formRoutes);

export default app;

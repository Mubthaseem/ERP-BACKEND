import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler } from './common/errors/errorHandler.js';
import { notFound } from './common/errors/notFound.js';

const app: Application = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static uploads serving
app.use('/uploads', express.static('uploads'));

// Base Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Saudi Arabia ERP API Gateway',
    version: '1.0.0',
    description: 'Enterprise ERP System Backend with MongoDB, Express & TypeScript',
    market: 'KSA (Saudi Arabia)',
    currency: 'SAR',
    vatRate: '15%',
    docs: '/api/health',
  });
});

// API Routes
app.use('/api', routes);

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;

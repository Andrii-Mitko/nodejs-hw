import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import { errors } from 'celebrate';
import authRoutes from './routes/authRoutes.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT;

// Глобальні middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use(notesRoutes);

app.use(authRoutes);

app.use(userRoutes);

// 404 — якщо маршрут не знайдено
app.use(notFoundHandler);

// обробка помилок від celebrate (валідація)
app.use(errors());

// Error — якщо під час запиту виникла помилка
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Порядок важливий

// 1. Logger першим → логуються всі вхідні запити.
// 2. JSON і CORS далі → кожен запит обробляється перед передачею в маршрути.
// 3. Маршрути → відповідають на конкретні запити.
// 4. 404 handler → якщо маршрут не знайдено.
// 5. Error handler → якщо трапилась помилка на будь-якому етапі.

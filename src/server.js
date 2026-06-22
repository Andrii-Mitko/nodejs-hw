import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Глобальні middleware
app.use(logger); // 1. Логер першим — бачить усі запити
app.use(express.json()); // 2. Парсинг JSON-тіла
app.use(cors()); // 3. Дозвіл для запитів з інших доменів

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
});

app.use(notesRoutes);

// 404 — якщо маршрут не знайдено
app.use(notFoundHandler);

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

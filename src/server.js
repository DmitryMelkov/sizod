import express from 'express';
import { connectToDb } from './config/db.js';
import { apiRoutes } from './routes/api.js';
import { readData } from './services/modbusService.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Указываем папку для статических файлов
app.use(express.static(join(__dirname, '../public')));

app.get('/', (req, res) => {
  const indexPath = join(__dirname, '../public', 'index.html');
  res.sendFile(indexPath);
});

const startServer = async () => {
  const collection = await connectToDb();
  app.use('/api', apiRoutes(collection));
  readData(collection);

  app.listen(3002, () => {
    console.log(`Server is running on http://localhost:3002)`);
  });
};

startServer();

import express from 'express';
import { connectToDb } from './config/db.js';
import { apiRoutes } from './routes/api.js';
import { devicesConfig } from './services/devicesConfig.js';
import { ModbusClient } from './services/modbusClient.js';
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

// Создаем карту Modbus-клиентов для каждого порта
const modbusClients = {};

devicesConfig.forEach((device) => {
  if (!modbusClients[device.port]) {
    modbusClients[device.port] = new ModbusClient(device.port);
    modbusClients[device.port].connect().catch(err => console.error(`Ошибка при подключении к порту ${device.port}:`, err));
  }
});

// Функция для запуска опроса данных
const startDataRetrieval = (collection) => {
  devicesConfig.forEach((device) => {
    import(device.serviceModule).then((module) => {
      const readDataFunction = module[device.readDataFunction];
      const modbusClient = modbusClients[device.port];

      // Интервал опроса данных
      setInterval(async () => {
        try {
          await readDataFunction(modbusClient, device.deviceID, device.name, collection);
        } catch (err) {
          console.error(`Ошибка при опросе данных для ${device.name}:`, err);
        }
      }, 10000); // Настройте интервал опроса по необходимости
    });
  });
};

const startServer = async () => {
  // Подключение к базе данных
  const collection = await connectToDb();
  app.use('/api', apiRoutes(collection));

  // Запуск опроса данных для всех устройств
  startDataRetrieval(collection);

  app.listen(3002, () => {
    console.log(`Server is running on http://localhost:3002`);
  });
};

startServer();

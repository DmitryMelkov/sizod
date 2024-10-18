import express from 'express';
import { MongoClient } from 'mongodb';
import ModbusRTU from 'modbus-serial';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Создаем клиент ModbusRTU
const modbusClient = new ModbusRTU();

// Создаем клиент MongoDB
const mongoClient = new MongoClient('mongodb://localhost:27017/');

const dbName = 'test-termodat';
const collectionName = 'temperature_data';
const db = mongoClient.db(dbName);
const collection = db.collection(collectionName);

// Подключение к устройству ModbusRTU
const port = 'COM4';
const baudRate = 9600;

async function readData() {
  try {
    await modbusClient.connectRTUBuffered(port, { baudRate: baudRate });
    modbusClient.setID(0x03);
    console.log('Подключено к устройству с адресом 0x03');

    // Устанавливаем интервал опроса
    setInterval(async () => {
      try {
        // Чтение данных (например, 1 регистр с адресом 0x0000)
        const data = await modbusClient.readHoldingRegisters(0x0000, 1);
        // Преобразование данных из int16 в int32, еслинеобходимо
        const int32Value = data.data[0]; // Пример преобразования
        const modifiedValue = int32Value * 0.1; // Умножаем на 0.1
        console.log('Значение температуры:', modifiedValue);

        // Запись данных в базу данных
        const doc = {
          timestamp: new Date(),
          value: modifiedValue,
        };
        await collection.insertOne(doc);
      } catch (err) {
        console.error('Ошибка при чтении данных:', err);
      }
    }, 10000);
  } catch (err) {
    console.error('Ошибка при подключении:', err);
  }
}

// Создаем endpoint для получения последних данных из базы данных
app.get('/api/mongo-value', async (req, res) => {
  try {
    const data = await collection.find().sort({ timestamp: -1 }).limit(1).toArray();
    res.json({ value: data[0].value });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка получения данных');
  }
});


app.get('/', (req, res) => {
  const indexPath = join(__dirname, '../public', 'index.html');
  res.sendFile(indexPath);
});

// Запуск сервера
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});

// Вызов функции для чтения данных
readData();

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

const dbName = 'sizod';
const collectionName = 'DOT-EKO';
const db = mongoClient.db(dbName);
const collection = db.collection(collectionName);

// Подключение к устройству ModbusRTU
const port = 'COM6';
const baudRate = 57600;

async function readData() {
  try {
    await modbusClient.connectRTUBuffered(port, { baudRate: baudRate });
    modbusClient.setID(0x01);
    console.log('Подключено к устройству с адресом 0x01');

    // Устанавливаем интервал опроса
    setInterval(async () => {
      try {
        const rightSkiData = await modbusClient.readHoldingRegisters(0x0002, 1);
        const leftSkiData = await modbusClient.readHoldingRegisters(0x0004, 1);
        const defectData = await modbusClient.readHoldingRegisters(0x0000, 1);
        const defectReportData = await modbusClient.readHoldingRegisters(0x0006, 1);
        const rightSkiReportData = await modbusClient.readHoldingRegisters(0x0008, 1);
        const leftSkiReportData = await modbusClient.readHoldingRegisters(0x000A, 1);

        // Читаем 2 регистра для shiftTime и workTime
        const shiftTimeData = await modbusClient.readHoldingRegisters(0x000E, 2);
        const workTimeData = await modbusClient.readHoldingRegisters(0x0012, 2);

        const rightSkiValue = rightSkiData.data[0];
        const leftSkiValue = leftSkiData.data[0];
        const defectValue = defectData.data[0];
        const defectReportValue = defectReportData.data[0];
        const rightSkiReportValue = rightSkiReportData.data[0];
        const leftSkiReportValue = leftSkiReportData.data[0];

        // Преобразование float из двух регистров с учетом порядка байтов
        const shiftTimeBuffer = Buffer.alloc(4);
        shiftTimeBuffer.writeUInt16LE(shiftTimeData.data[0], 0);
        shiftTimeBuffer.writeUInt16LE(shiftTimeData.data[1], 2);
        const shiftTimeValue = shiftTimeBuffer.readFloatLE(0); // Изменено на readFloatLE
        const workTimeBuffer = Buffer.alloc(4);
        workTimeBuffer.writeUInt16LE(workTimeData.data[0], 0);
        workTimeBuffer.writeUInt16LE(workTimeData.data[1], 2);
        const workTimeValue = workTimeBuffer.readFloatLE(0); // Изменено на readFloatLE

        // Округление до сотых
        const roundedShiftTime = parseFloat(shiftTimeValue.toFixed(2));
        const roundedWorkTime = parseFloat(workTimeValue.toFixed(2));

        // Запись данных в MongoDB
        const doc = {
          timestamp: new Date(),
          rightSki: rightSkiValue,
          leftSki: leftSkiValue,
          defect: defectValue,
          defectReport: defectReportValue,
          rightSkiReport: rightSkiReportValue,
          leftSkiReport: leftSkiReportValue,
          shiftTime: roundedShiftTime,
          workTime: roundedWorkTime,
        };

        await collection.insertOne(doc);

        // console.log('Данные:', doc);
      } catch (err) {
        console.error('Ошибка при чтении данных:', err);
      }
    }, 5000);
  } catch (err) {
    console.error('Ошибка при подключении:', err);
  }
}

// Создаем endpoint для получения последних данных из базы данных
app.get('/api/mongo-value', async (req, res) => {
  try {
    const data = await collection.find().sort({ timestamp: -1 }).limit(1).toArray();
    if (data.length > 0) {
      res.json({
        rightSki: data[0].rightSki,
        leftSki: data[0].leftSki,
        defect: data[0].defect,
        rightSkiReport: data[0].rightSkiReport,
        leftSkiReport: data[0].leftSkiReport,
        defectReport: data[0].defectReport,
        shiftTime: data[0].shiftTime,
        workTime: data[0].workTime,
      });
    } else {
      res.json({ message: 'Нет данных' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка получения данных');
  }
});

// Указываем папку для статических файлов
app.use(express.static(join(__dirname, '../public')));

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

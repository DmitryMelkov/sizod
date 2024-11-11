// routes/api.js
import { Router } from 'express';
import { dotEkoReportHour, dotEkoReportMonth } from '../services/reportDotEkoServices.js';

const router = Router();

export const apiRoutes = (collection) => {
  router.get('/mongo-value', async (req, res) => {
    try {
      const data = await collection.find().sort({ timestamp: -1 }).limit(1).toArray();
      if (data.length > 0) {
        const lastUpdated = data[0].lastUpdated
          ? new Date(data[0].lastUpdated).toLocaleString('ru-RU', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          : 'Нет данных';

        const responseData = {
          rightSki: data[0].rightSki,
          leftSki: data[0].leftSki,
          defect: data[0].defect,
          rightSkiReport: data[0].rightSkiReport,
          leftSkiReport: data[0].leftSkiReport,
          defectReport: data[0].defectReport,
          shiftTime: data[0].shiftTime,
          workTime: data[0].workTime,
          totalSki: data[0].totalSki,
          totalSkiReport: data[0].totalSkiReport,
          lineStatusValue: data[0].lineStatusValue,
          lastUpdated: lastUpdated,
        };

        // Выводим данные в консоль перед отправкой клиенту
        // console.log('Данные, отправленные клиенту:', responseData);

        res.json(responseData);
      } else {
        console.log('Нет данных для отправки клиенту');
        res.json({ message: 'Нет данных' });
      }
    } catch (err) {
      console.error('Ошибка при получении данных:', err);
      res.status(500).send('Ошибка получения данных');
    }
  });

  // Новый маршрут для получения часового отчета
  router.get('/hourly-report', async (req, res) => {
    try {
      const report = await dotEkoReportHour(collection);
      res.json(report);
    } catch (err) {
      console.error('Ошибка получения часового отчета:', err);
      res.status(500).send('Ошибка получения часового отчета');
    }
  });

  // Новый маршрут для получения месячного отчета
  router.get('/monthly-report', async (req, res) => {
    try {
      const report = await dotEkoReportMonth(collection);
      res.json(report);
    } catch (err) {
      console.error('Ошибка получения месячного отчета:', err);
      res.status(500).send('Ошибка получения месячного отчета');
    }
  });

  return router;
};

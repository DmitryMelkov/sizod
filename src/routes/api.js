import { Router } from 'express';
import moment from 'moment';

const router = Router();

// Функция для получения часового отчета
const getHourlyReport = async (collection) => {
  const startDate = moment().startOf('day').toDate(); // Начало текущего дня (00:00)
  const endDate = moment().toDate(); // Текущая дата и время
  const data = await collection
    .find({
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    })
    .toArray();

  const hourlyData = {};

  data.forEach((entry) => {
    const hour = moment(entry.timestamp).format('YYYY-MM-DD HH:00');
    if (!hourlyData[hour]) {
      hourlyData[hour] = {
        rightSkiReport: [],
        leftSkiReport: [],
        defectReport: [], // Массив для брака
        workTime: [], // Массив для workTime
      };
    }
    hourlyData[hour].rightSkiReport.push(entry.rightSkiReport);
    hourlyData[hour].leftSkiReport.push(entry.leftSkiReport);
    hourlyData[hour].defectReport.push(entry.defect); // Сохраняем данные о браке
    hourlyData[hour].workTime.push(entry.workTime); // Сохраняем данные о workTime
  });

  const result = {};
  for (const hour in hourlyData) {
    const rightSkiValues = hourlyData[hour].rightSkiReport;
    const leftSkiValues = hourlyData[hour].leftSkiReport;
    const defectValues = hourlyData[hour].defectReport;
    const workTimeValues = hourlyData[hour].workTime; // Получаем данные о workTime
    const maxRightSki = Math.max(...rightSkiValues);
    const minRightSki = Math.min(...rightSkiValues);
    const maxLeftSki = Math.max(...leftSkiValues);
    const minLeftSki = Math.min(...leftSkiValues);
    const maxDefect = Math.max(...defectValues);
    const minDefect = Math.min(...defectValues);
    const totalDefects = maxDefect - minDefect; // Брак как разница между максимальным и минимальным

    // Вычисляем workTime как разницу между максимальным и минимальным значением
    const maxWorkTime = Math.max(...workTimeValues);
    const minWorkTime = Math.min(...workTimeValues);
    const totalWorkTime = maxWorkTime - minWorkTime;

    result[hour] = {
      rightSki: maxRightSki - minRightSki,
      leftSki: maxLeftSki - minLeftSki,
      totalSki: maxRightSki - minRightSki + (maxLeftSki - minLeftSki),
      defect: totalDefects, // Добавляем количество брака
      workTime: totalWorkTime, // Добавляем workTime
    };
  }

  return result;
};

export const apiRoutes = (collection) => {
  router.get('/mongo-value', async (req, res) => {
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
          totalSki: data[0].totalSki,
          totalSkiReport: data[0].totalSkiReport,
          lineStatusValue: data[0].lineStatusValue,
          lastUpdated: new Date(data[0].lastUpdated).toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        });
      } else {
        res.json({ message: 'Нет данных' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Ошибка получения данных');
    }
  });

  // Новый маршрут для получения часового отчета
  router.get('/hourly-report', async (req, res) => {
    try {
      const report = await getHourlyReport(collection);
      res.json(report);
    } catch (err) {
      console.error(err);
      res.status(500).send('Ошибка получения часового отчета');
    }
  });

  return router;
};

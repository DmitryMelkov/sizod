import { Router } from 'express';

const router = Router();

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

  return router;
};

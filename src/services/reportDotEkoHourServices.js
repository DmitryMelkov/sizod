import moment from 'moment';


// Функция для получения часового отчета
export const dotEkoReportHour = async (collection) => {
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
        defectReport: [],
        workTime: [],
      };
    }
    hourlyData[hour].rightSkiReport.push(entry.rightSkiReport);
    hourlyData[hour].leftSkiReport.push(entry.leftSkiReport);
    hourlyData[hour].defectReport.push(entry.defect);
    hourlyData[hour].workTime.push(entry.workTime);
  });

  const result = {};
  for (const hour in hourlyData) {
    const rightSkiValues = hourlyData[hour].rightSkiReport;
    const leftSkiValues = hourlyData[hour].leftSkiReport;
    const defectValues = hourlyData[hour].defectReport;
    const workTimeValues = hourlyData[hour].workTime;
    const maxRightSki = Math.max(...rightSkiValues);
    const minRightSki = Math.min(...rightSkiValues);
    const maxLeftSki = Math.max(...leftSkiValues);
    const minLeftSki = Math.min(...leftSkiValues);
    const maxDefect = Math.max(...defectValues);
    const minDefect = Math.min(...defectValues);
    const totalDefects = maxDefect - minDefect;

    // Вычисляем workTime как разницу между максимальным и минимальным значением
    const maxWorkTime = Math.max(...workTimeValues);
    const minWorkTime = Math.min(...workTimeValues);
    const totalWorkTime = maxWorkTime - minWorkTime;

    result[hour] = {
      rightSki: maxRightSki - minRightSki,
      leftSki: maxLeftSki - minLeftSki,
      totalSki: maxRightSki - minRightSki + (maxLeftSki - minLeftSki),
      defect: totalDefects,
      workTime: totalWorkTime,
    };
  }

  return result;
};
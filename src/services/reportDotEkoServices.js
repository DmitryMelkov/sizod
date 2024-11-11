import moment from 'moment';

// Проверка на допустимый диапазон значений
function isWithinThreshold(max, min, threshold) {
  return max - min < threshold;
}

// Функция для получения суточного отчета с порогом выбросов в 1000
export const dotEkoReportHour = async (collection) => {
  const MAX_DIFFERENCE_THRESHOLD = 1000; // Порог для суточного отчета
  const PRODUCTION_RATE_PER_CONVEYOR = 250; // Производительность конвейера (штук в час)
  const startDate = moment().startOf('day').toDate();
  const endDate = moment().toDate();

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
    const adjustedHour = moment(entry.timestamp).add(1, 'hours').format('YYYY-MM-DD HH:00');
    if (!hourlyData[adjustedHour]) {
      hourlyData[adjustedHour] = {
        rightSkiReport: [],
        leftSkiReport: [],
        defectReport: [],
        workTime: [],
      };
    }
    hourlyData[adjustedHour].rightSkiReport.push(entry.rightSkiReport);
    hourlyData[adjustedHour].leftSkiReport.push(entry.leftSkiReport);
    hourlyData[adjustedHour].defectReport.push(entry.defect);
    hourlyData[adjustedHour].workTime.push(entry.workTime);
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

    let totalDefects = isWithinThreshold(maxDefect, minDefect, MAX_DIFFERENCE_THRESHOLD) ? maxDefect - minDefect : 0;
    let totalRightSki = isWithinThreshold(maxRightSki, minRightSki, MAX_DIFFERENCE_THRESHOLD) ? maxRightSki - minRightSki : 0;
    let totalLeftSki = isWithinThreshold(maxLeftSki, minLeftSki, MAX_DIFFERENCE_THRESHOLD) ? maxLeftSki - minLeftSki : 0;

    const maxWorkTime = Math.max(...workTimeValues);
    const minWorkTime = Math.min(...workTimeValues);
    const totalWorkTime = maxWorkTime - minWorkTime;

    // Если количество изделий равно нулю, но время работы больше нуля, рассчитываем по времени работы
    if (totalRightSki === 0 && totalWorkTime > 0) {
      totalRightSki = totalWorkTime * PRODUCTION_RATE_PER_CONVEYOR;
    }
    if (totalLeftSki === 0 && totalWorkTime > 0) {
      totalLeftSki = totalWorkTime * PRODUCTION_RATE_PER_CONVEYOR;
    }

    result[hour] = {
      rightSki: Math.round(totalRightSki),
      leftSki: Math.round(totalLeftSki),
      totalSki: Math.round(totalRightSki + totalLeftSki),
      defect: totalDefects,
      workTime: totalWorkTime,
    };
  }

  return result;
};

// Функция для получения месячного отчета с порогом выбросов в 15000
export const dotEkoReportMonth = async (collection) => {
  const MAX_DIFFERENCE_THRESHOLD = 15000; // Порог для месячного отчета
  const PRODUCTION_RATE_PER_CONVEYOR = 250; // Производительность конвейера (штук в час)
  const startDate = moment().startOf('month').toDate();
  const endDate = moment().toDate();

  const data = await collection
    .find({
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    })
    .toArray();

  const dailyData = {};

  data.forEach((entry) => {
    const day = moment(entry.timestamp).format('YYYY-MM-DD');
    if (!dailyData[day]) {
      dailyData[day] = {
        rightSkiReport: [],
        leftSkiReport: [],
        defectReport: [],
        workTime: [],
      };
    }
    dailyData[day].rightSkiReport.push(entry.rightSkiReport);
    dailyData[day].leftSkiReport.push(entry.leftSkiReport);
    dailyData[day].defectReport.push(entry.defect);
    dailyData[day].workTime.push(entry.workTime);
  });

  const result = {};
  for (const day in dailyData) {
    const rightSkiValues = dailyData[day].rightSkiReport;
    const leftSkiValues = dailyData[day].leftSkiReport;
    const defectValues = dailyData[day].defectReport;
    const workTimeValues = dailyData[day].workTime;

    const maxRightSki = Math.max(...rightSkiValues);
    const minRightSki = Math.min(...rightSkiValues);
    const maxLeftSki = Math.max(...leftSkiValues);
    const minLeftSki = Math.min(...leftSkiValues);
    const maxDefect = Math.max(...defectValues);
    const minDefect = Math.min(...defectValues);

    let totalDefects = isWithinThreshold(maxDefect, minDefect, MAX_DIFFERENCE_THRESHOLD) ? maxDefect - minDefect : 0;
    let totalRightSki = isWithinThreshold(maxRightSki, minRightSki, MAX_DIFFERENCE_THRESHOLD) ? maxRightSki - minRightSki : 0;
    let totalLeftSki = isWithinThreshold(maxLeftSki, minLeftSki, MAX_DIFFERENCE_THRESHOLD) ? maxLeftSki - minLeftSki : 0;

    const maxWorkTime = Math.max(...workTimeValues);
    const minWorkTime = Math.min(...workTimeValues);
    const totalWorkTime = maxWorkTime - minWorkTime;

    // Если количество изделий равно нулю, но время работы больше нуля, рассчитываем по времени работы
    if (totalRightSki === 0 && totalWorkTime > 0) {
      totalRightSki = totalWorkTime * PRODUCTION_RATE_PER_CONVEYOR;
    }
    if (totalLeftSki === 0 && totalWorkTime > 0) {
      totalLeftSki = totalWorkTime * PRODUCTION_RATE_PER_CONVEYOR;
    }

    result[day] = {
      rightSki: Math.round(totalRightSki),
      leftSki: Math.round(totalLeftSki),
      totalSki: Math.round(totalRightSki + totalLeftSki),
      defect: totalDefects,
      workTime: totalWorkTime,
    };
  }

  return result;
};

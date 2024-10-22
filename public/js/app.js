async function fetchData() {
  try {
    const response = await fetch('/api/mongo-value');
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    const data = await response.json();

    // Создаем переменные для элементов
    const leftSkiDotEKO = document.getElementById('left-ski-dot-eko');
    const rightSkiDotEKO = document.getElementById('right-ski-dot-eko');
    const totalSkiDotEKO = document.getElementById('total-ski-dot-eko');
    const defectDotEKO = document.getElementById('defect-dot-eko');
    const shiftTimeDotEKO = document.getElementById('shift-time-dot-eko');
    const modeDotEKO = document.getElementById('mode-dot-eko');
    const leftSkireportDotEKO = document.getElementById('left-ski-report-dot-eko');
    const rightSkireportDotEKO = document.getElementById('right-ski-report-dot-eko');
    const totalSkiReportDotEKO = document.getElementById('total-ski-report-dot-eko');
    const defectReportDotEKO = document.getElementById('defect-report-dot-eko');
    const workTimeDotEKO = document.getElementById('work-time-dot-eko');




    const lastUpdatedDotEKO = document.getElementById('last-updated-dot-eko');

    // Обновляем содержимое элементов
    leftSkiDotEKO.textContent = data.leftSki !== undefined ? data.leftSki : 'Нет данных';
    rightSkiDotEKO.textContent = data.rightSki !== undefined ? data.rightSki : 'Нет данных';
    defectDotEKO.textContent = data.defect !== undefined ? data.defect : 'Нет данных';
    shiftTimeDotEKO.textContent = data.shiftTime !== undefined ? data.shiftTime : 'Нет данных';
    totalSkiDotEKO.textContent = data.totalSki !== undefined ? data.totalSki : 'Нет данных';
    leftSkireportDotEKO.textContent = data.leftSkiReport !== undefined ? data.leftSkiReport : 'Нет данных';
    rightSkireportDotEKO.textContent = data.rightSkiReport !== undefined ? data.rightSkiReport : 'Нет данных';
    totalSkiReportDotEKO.textContent = data.totalSkiReport !== undefined ? data.totalSkiReport : 'Нет данных';
    defectReportDotEKO.textContent = data.defectReport !== undefined ? data.defectReport : 'Нет данных';
    workTimeDotEKO.textContent = data.workTime !== undefined ? data.workTime : 'Нет данных';







    // Обработка статуса работы линии
    if (data.lineStatusValue !== undefined) {
      modeDotEKO.textContent = data.lineStatusValue === 1 ? 'работает' : 'стоит';
    } else {
      modeDotEKO.textContent = 'Нет данных';
    }

    lastUpdatedDotEKO.textContent = data.lastUpdated !== undefined ? data.lastUpdated : 'Нет данных';
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
}

// Обновление данных каждые 5 секунд
setInterval(fetchData, 5000);
// Первоначальный вызов для получения данных сразу при загрузке страницы
fetchData();

// Функция для обновления текущей даты и времени
const updateDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  document.getElementById('current-date').textContent = date;
  document.getElementById('current-time').textContent = time;
}

// Обновление времени каждые 1 секунду
setInterval(updateDateTime, 1000);
// Первоначальный вызов для получения текущей даты и времени сразу при загрузке страницы
updateDateTime();
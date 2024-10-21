async function fetchData() {
  try {
    const response = await fetch('/api/mongo-value');
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    const data = await response.json();

    // Создаем переменные для элементов
    const leftSkiElement = document.getElementById('left-ski');
    const rightSkiElement = document.getElementById('right-ski');
    const defectElement = document.getElementById('defect');
    const shiftTimeElement = document.getElementById('shift-time');
    const totalSkiElement = document.getElementById('total-ski');
    const modeElement = document.getElementById('mode');
    const lastUpdated = document.getElementById('last-updated');


    // Обновляем содержимое элементов
    leftSkiElement.textContent = data.leftSki !== undefined ? data.leftSki : 'Нет данных';
    rightSkiElement.textContent = data.rightSki !== undefined ? data.rightSki : 'Нет данных';
    defectElement.textContent = data.defect !== undefined ? data.defect : 'Нет данных';
    shiftTimeElement.textContent = data.shiftTime !== undefined ? data.shiftTime : 'Нет данных';
    totalSkiElement.textContent = data.totalSki !== undefined ? data.totalSki : 'Нет данных';
    modeElement.textContent = data.mode !== undefined ? data.mode : 'Нет данных';
    lastUpdated.textContent = data.lastUpdated !== undefined ? data.lastUpdated : 'Нет данных';

  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
}

// Обновление данных каждые 5 секунд
setInterval(fetchData, 5000);
// Первоначальный вызов для получения данных сразу при загрузке страницы
fetchData();

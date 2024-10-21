async function fetchData() {
  try {
    const response = await fetch('/api/mongo-value');
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    const data = await response.json();
    document.getElementById('left-ski').textContent = data.leftSki !== undefined ? data.leftSki : 'Нет данных';
    document.getElementById('right-ski').textContent = data.rightSki !== undefined ? data.rightSki : 'Нет данных';
    document.getElementById('defect').textContent = data.defect !== undefined ? data.defect : 'Нет данных';
    document.getElementById('shift-time').textContent = data.shiftTime !== undefined ? data.shiftTime : 'Нет данных';
    document.getElementById('total-ski').textContent = data.totalSki !== undefined ? data.totalSki : 'Нет данных';

  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
}

// Обновление данных каждые 5 секунд
setInterval(fetchData, 5000);
// Первоначальный вызов для получения данных сразу при загрузке страницы
fetchData();

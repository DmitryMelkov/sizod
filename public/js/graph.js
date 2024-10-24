import { renderMonthlyGraph } from './dotEkograph.js';
import { openModal } from './modal.js';

export const fetchMonthlyGraph = async () => {
  const overlay = document.querySelector('.overlay-month-graph');
  const modalGraph = document.querySelector('#modal-graph-content-month');

  try {
    overlay.classList.add('active');
    modalGraph.style.visibility = 'hidden';

    const response = await fetch(`/api/monthly-report`); // Запрос данных с сервера
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }

    const report = await response.json();
    const labels = [];
    const values = [];

    // Преобразуем данные для графика
    for (const day in report) {
      // Преобразуем дату в формат "21 окт"
      const dateObj = new Date(day);
      const formattedDate = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      labels.push(formattedDate); // Добавляем день и месяц в метки
      values.push(report[day].totalSki); // Добавляем значение произведенной продукции
    }

    setTimeout(() => {
      overlay.classList.remove('active');
      modalGraph.style.visibility = 'visible';

      // Отрисовываем график
      renderMonthlyGraph(labels, values);
      openModal('dot-eko-month-graph'); // Открываем модалку с графиком
    }, 1000);
  } catch (error) {
    overlay.classList.remove('active');
    console.error('Ошибка при получении месячного графика:', error);
  }
};
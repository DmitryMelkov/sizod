import { dotEkoReportHour } from './dotEkoReportHour.js';
import { openModal } from './modal.js';

export const fetchHourlyReport = async () => {
  const overlay = document.querySelector('.overlay');
  const modalReport = document.querySelector('.mnemo__modal-report');

  try {

    overlay.classList.add('active');

    modalReport.style.visibility = 'hidden';

    const response = await fetch(`/api/hourly-report`);
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }

    const report = await response.json();

    setTimeout(() => {
      overlay.classList.remove('active');
      modalReport.style.visibility = 'visible';
      dotEkoReportHour(report);
      openModal('dot-eko-hour-report');
    }, 1000);
  } catch (error) {
    overlay.classList.remove('active');
    console.error('Ошибка при получении часового отчета:', error);
  }
};

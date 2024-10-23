import { dotEkoReportHour } from './dotEkoReportHour.js';
import { openModal } from './modal.js';



export const fetchHourlyReport = async () => {
  try {
    const response = await fetch(`/api/hourly-report`);
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    const report = await response.json();
    dotEkoReportHour(report);
    openModal('doc-modal');
  } catch (error) {
    console.error('Ошибка при получении часового отчета:', error);
  }
};

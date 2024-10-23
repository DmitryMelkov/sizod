// report.js

import { openModal } from "./modal.js";

export const displayHourlyReport = (report) => {
  const reportDiv = document.getElementById('modal-report-content');
  reportDiv.innerHTML = '';
  for (const hour in report) {
    const entry = report[hour];
    reportDiv.innerHTML += `<p>${hour}: Правый лыжный: ${entry.rightSki}, Левый лыжный: ${entry.leftSki}, Всего лыж: ${entry.totalSki}</p>`;
  }
};

export const fetchHourlyReport = async () => {
  try {
    const response = await fetch(`/api/hourly-report`);
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    const report = await response.json();
    displayHourlyReport(report);
    openModal('doc-modal');
  } catch (error) {
    console.error('Ошибка при получении часового отчета:', error);
  }
};

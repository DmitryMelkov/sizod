// report.js

import { openModal } from './modal.js';

export const displayHourlyReport = (report) => {
  const reportDiv = document.getElementById('modal-report-content');
  reportDiv.innerHTML = ''; // Очищаем содержимое

  // Создаем таблицу с классом mnemo__modal-report-table
  const table = document.createElement('table'); // Объявляем переменную table
  table.className = 'mnemo__modal-report-table'; // Задаем класс
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.marginTop = '10px';

  // Добавляем заголовок таблицы
  const header = table.createTHead();
  const headerRow = header.insertRow(0);
  const headers = ['Время', 'Конвейер правый (штук)', 'Конвейер левый (штук)', 'Сумма изделий', 'Брак'];

  headers.forEach((text, index) => {
    const cell = headerRow.insertCell(index);
    cell.textContent = text;
    cell.className = 'mnemo__modal-report-header'; // Задаем класс для заголовка
  });

  // Добавляем строки с данными
  const body = table.createTBody();
  for (const hour in report) {
    const entry = report[hour];
    const row = body.insertRow();

    const time = new Date(hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const cellTime = row.insertCell(0);
    cellTime.textContent = time; // Устанавливаем только время

    const cellRight = row.insertCell(1);
    cellRight.textContent = entry.rightSki;

    const cellLeft = row.insertCell(2);
    cellLeft.textContent = entry.leftSki;

    const cellTotal = row.insertCell(3);
    cellTotal.textContent = entry.totalSki;

    const cellDefect = row.insertCell(4);
    cellDefect.textContent = entry.defect;
  }

  // Добавляем таблицу в контейнер
  reportDiv.appendChild(table);
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

// report.js

import { openModal } from './modal.js';

export const displayHourlyReport = (report) => {
  const reportDiv = document.getElementById('modal-report-content');
  reportDiv.innerHTML = '';

  // Создаем таблицу с классом mnemo__modal-report-table
  const table = document.createElement('table');
  table.className = 'mnemo__modal-report-table';
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';

  // Добавляем заголовок таблицы
  const header = table.createTHead();
  const headerRow = header.insertRow(0);
  const headers = [
    'Время',
    'Конвейер правый (штук)',
    'Конвейер левый (штук)',
    'Сумма (штук)',
    'Время работы (ч)',
    'Брак (штук)',
  ];

  headers.forEach((text) => {
    const cell = document.createElement('th'); // Создаем элемент <th>
    cell.textContent = text;
    cell.className = 'mnemo__modal-report-header';
    headerRow.appendChild(cell); // Добавляем <th> в строку заголовка
  });

  // Добавляем строки с данными
  const body = table.createTBody();
  for (const hour in report) {
    const entry = report[hour];
    const row = body.insertRow();

    const time = new Date(hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const cellTime = row.insertCell(0);
    cellTime.textContent = time; // Устанавливаем только время
    cellTime.className = 'mnemo__modal-report-cell'; // Класс для стилизации
    const cellRight = row.insertCell(1);
    cellRight.textContent = entry.rightSki;
    cellRight.className = 'mnemo__modal-report-cell'; // Класс для стилизации
    const cellLeft = row.insertCell(2);
    cellLeft.textContent = entry.leftSki;
    cellLeft.className = 'mnemo__modal-report-cell'; // Класс для стилизации
    const cellTotal = row.insertCell(3);
    cellTotal.textContent = entry.totalSki;
    cellTotal.className = 'mnemo__modal-report-cell'; // Класс для стилизации
    cellTotal.style.backgroundColor = '#f0f0f0'; // Цвет фона для суммы
    const cellWorkTime = row.insertCell(4);
    cellWorkTime.textContent = entry.workTime.toFixed(2);
    cellWorkTime.className = 'mnemo__modal-report-cell'; // Класс для стилизации

    const cellDefect = row.insertCell(5);
    cellDefect.textContent = entry.defect;
    cellDefect.className = 'mnemo__modal-report-cell'; // Класс для стилизации
    if (entry.defect > 0) {
      cellDefect.style.backgroundColor = '#ffcccc'; // Менее яркий цвет для брака
    }
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

export const renderMonthlyGraph = (labels, values) => {
  const ctx = document.getElementById('monthly-graph-canvas').getContext('2d');

  // Удаляем предыдущий график, если он был нарисован
  if (window.monthlyChart) {
    window.monthlyChart.destroy();
  }

  // Создаем новый график
  window.monthlyChart = new Chart(ctx, {
    type: 'bar', // Столбчатый график
    data: {
      labels: labels, // Дни месяца
      datasets: [{
        label: 'Произведено за день (шт.)',
        data: values, // Значения для каждого дня
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Цвет столбцов
        borderColor: 'rgba(75, 192, 192, 1)', // Цвет рамки
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true // Начало оси Y с нуля
        }
      }
    }
  });
}





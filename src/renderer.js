// Konfigurasi dasar untuk semua grafik agar tampilannya seragam dan clean
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false } 
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#8b949e', font: { size: 10 } }
    },
    y: {
      grid: { color: '#1f2631' },
      ticks: { color: '#8b949e', font: { size: 10 } }
    }
  },
  elements: {
    point: { radius: 3, hoverRadius: 5 },
    line: { tension: 0.3, borderWidth: 2 } 
  }
};

const labels = ['11/07', '12/07', '13/07', '14/07', '15/07', '16/07', '17/07'];

// 1. Chart Berat Badan
new Chart(document.getElementById('weightChart'), {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      data: [75.2, 74.5, 74.0, 73.5, 72.9, 72.6, 72.4],
      borderColor: '#388bfd',
      backgroundColor: 'rgba(56, 139, 253, 0.1)',
      fill: true
    }]
  },
  options: commonOptions
});

// 2. Chart Kadar Lemak
new Chart(document.getElementById('fatChart'), {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      data: [19.8, 19.5, 19.2, 18.9, 18.5, 18.0, 18.7],
      borderColor: '#f0883e',
      backgroundColor: 'rgba(240, 136, 62, 0.1)',
      fill: true
    }]
  },
  options: commonOptions
});

// 3. Chart Skor Kesehatan
new Chart(document.getElementById('healthChart'), {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      data: [60, 65, 62, 70, 68, 72, 85],
      borderColor: '#3fb950',
      backgroundColor: 'rgba(63, 185, 80, 0.1)',
      fill: true
    }]
  },
  options: commonOptions
});

// 4. Chart Keberhasilan Diet
new Chart(document.getElementById('progressChart'), {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      data: [45, 50, 52, 58, 65, 70, 78],
      borderColor: '#8957e5',
      backgroundColor: 'rgba(137, 87, 229, 0.1)',
      fill: true
    }]
  },
  options: commonOptions
});
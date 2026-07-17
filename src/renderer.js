// Opsi konfigurasi dasar global untuk grafik Chart.js
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
      ticks: { color: '#8b949e', font: { size: 10 } },
      min: 0,
      max: 100
    }
  },
  elements: {
    point: { radius: 4, hoverRadius: 6 },
    line: { tension: 0.3, borderWidth: 2 }
  }
};

const labels = ['11/07', '12/07', '13/07', '14/07', '15/07', '16/07', '17/07'];

// Inisialisasi awal semua grafik bernilai 0
const weightChart = new Chart(document.getElementById('weightChart'), {
  type: 'line',
  data: { labels: labels, datasets: [{ data: [0, 0, 0, 0, 0, 0, 0], borderColor: '#388bfd', backgroundColor: 'rgba(56, 139, 253, 0.05)', fill: true }] },
  options: commonOptions
});

const fatChart = new Chart(document.getElementById('fatChart'), {
  type: 'line',
  data: { labels: labels, datasets: [{ data: [0, 0, 0, 0, 0, 0, 0], borderColor: '#f0883e', backgroundColor: 'rgba(240, 136, 62, 0.05)', fill: true }] },
  options: commonOptions
});

const healthChart = new Chart(document.getElementById('healthChart'), {
  type: 'line',
  data: { labels: labels, datasets: [{ data: [0, 0, 0, 0, 0, 0, 0], borderColor: '#3fb950', backgroundColor: 'rgba(63, 185, 80, 0.05)', fill: true }] },
  options: commonOptions
});

const progressChart = new Chart(document.getElementById('progressChart'), {
  type: 'line',
  data: { labels: labels, datasets: [{ data: [0, 0, 0, 0, 0, 0, 0], borderColor: '#8957e5', backgroundColor: 'rgba(137, 87, 229, 0.05)', fill: true }] },
  options: commonOptions
});

// LOGIKA MODAL POP-UP PROFIL
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const saveModalBtn = document.getElementById('saveModalBtn');

// Elemen DOM untuk Diupdate
const displayProfileName = document.getElementById('displayProfileName');
const cardWeight = document.getElementById('cardWeight');

// Input DOM
const inputName = document.getElementById('inputName');
const inputWeight = document.getElementById('inputWeight');

// Buka Modal saat profil diklik
profileBtn.addEventListener('click', () => {
  profileModal.classList.add('active');
});

// Tutup Modal Batal
closeModalBtn.addEventListener('click', () => {
  profileModal.classList.remove('active');
});

// Simpan Data
saveModalBtn.addEventListener('click', () => {
  const nameValue = inputName.value.trim();
  const weightValue = parseFloat(inputWeight.value) || 0;

  if (nameValue) {
    displayProfileName.textContent = nameValue;
  }
  
  // Update Nilai Angka di dalam Card Berat Badan
  cardWeight.textContent = weightValue;

  // Update Titik Terakhir Grafik Berat Badan (Simulasi Input Awal Hari Ini)
  if (weightValue > 0) {
    weightChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, weightValue];
    weightChart.options.scales.y.max = Math.ceil(weightValue + 10); // Menyesuaikan batas atas skala grafik dinamis
    weightChart.update();
  }

  // Tutup Modal
  profileModal.classList.remove('active');
});
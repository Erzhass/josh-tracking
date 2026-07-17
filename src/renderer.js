// --- KONFIGURASI DAN INITIALISASI CHART (MULAI DARI O) ---
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

// Nilai Awal Semua Data Set Adalah 0
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


// --- LOGIKA SPA NAVIGASI MENU ---
const navItems = document.querySelectorAll('.nav-item');
const pageSections = document.querySelectorAll('.page-section');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');

const pageMetaData = {
  dashboard: { title: 'Dashboard', subtitle: 'Ringkasan perkembangan diet Anda' },
  form: { title: 'Form Harian', subtitle: 'Catat konsumsi dan aktivitas harian Anda' },
  kesimpulan: { title: 'Kesimpulan', subtitle: 'Analisis dan capaian berkala Anda' },
  generic: { title: 'Fitur Aplikasi', subtitle: 'Modul ini dalam tahap pengembangan' }
};

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');

    const targetPage = item.getAttribute('data-page');
    pageSections.forEach(section => section.classList.remove('active'));
    
    const activeSection = document.getElementById(`page-${targetPage}`);
    if (activeSection) activeSection.classList.add('active');

    const meta = pageMetaData[targetPage] || pageMetaData['generic'];
    pageTitle.textContent = meta.title;
    pageSubtitle.textContent = meta.subtitle;
  });
});


// --- LOGIKA MODAL INPUT DATA PROFIL ---
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const saveModalBtn = document.getElementById('saveModalBtn');

const displayProfileName = document.getElementById('displayProfileName');
const cardWeight = document.getElementById('cardWeight');
const inputName = document.getElementById('inputName');
const inputWeight = document.getElementById('inputWeight');

profileBtn.addEventListener('click', () => profileModal.classList.add('active'));
closeModalBtn.addEventListener('click', () => profileModal.classList.remove('active'));

saveModalBtn.addEventListener('click', () => {
  const nameValue = inputName.value.trim();
  const weightValue = parseFloat(inputWeight.value) || 0;

  if (nameValue) displayProfileName.textContent = nameValue;
  cardWeight.textContent = weightValue;

  if (weightValue > 0) {
    // Jalankan simulasi data masuk pada titik hari terakhir
    weightChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, weightValue];
    weightChart.options.scales.y.max = Math.ceil(weightValue + 10);
    weightChart.update();
  }
  profileModal.classList.remove('active');
});


// --- FUNGSIONALITAS TOMBOL HEADER & WINDOWS ---
document.getElementById('btn-period').addEventListener('click', () => {
  alert('Fitur filter rentang waktu (7 hari, 30 hari, dll.) akan terhubung dengan database.');
});

document.getElementById('btn-noti').addEventListener('click', () => {
  alert('Tidak ada notifikasi baru saat ini.');
});

document.getElementById('btn-minimize').addEventListener('click', () => console.log('Minimize window'));
document.getElementById('btn-maximize').addEventListener('click', () => console.log('Maximize window'));
document.getElementById('btn-close-app').addEventListener('click', () => {
  if (confirm('Apakah Anda yakin ingin keluar dari aplikasi JOSH?')) console.log('App closed');
});

document.getElementById('profileStar').addEventListener('click', function(e) {
  e.stopPropagation(); // Mencegah modal ikut terbuka saat ikon bintang diklik
  this.classList.toggle('fa-regular');
  this.classList.toggle('fa-solid');
  this.style.color = this.classList.contains('fa-solid') ? '#f1e05a' : '#8b949e';
});
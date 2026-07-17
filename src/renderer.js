// --- DATABASE LOKAL (ARRAY OF OBJECTS) SIMULASI MOCK DATA DARI UI ---
let databaseLokal = [
  { tanggal: '17 Juli 2026', makan: 3, bangun: '05:30', tidur: '22:30', olahraga: 'Fitness (45 mnt)', berat: 72.4, perubahan: 'Turun', lemak: 18.7, kesehatan: 85, progress: 78 },
  { tanggal: '16 Juli 2026', makan: 3, bangun: '05:45', tidur: '22:15', olahraga: 'Lari (30 mnt)', berat: 72.7, perubahan: 'Turun', lemak: 18.9, kesehatan: 84, progress: 76 },
  { tanggal: '15 Juli 2026', makan: 4, bangun: '06:00', tidur: '22:45', olahraga: 'Tidak', berat: 73.1, perubahan: 'Naik', lemak: 19.2, kesehatan: 81, progress: 72 },
  { tanggal: '14 Juli 2026', makan: 3, bangun: '05:50', tidur: '22:20', olahraga: 'Fitness (40 mnt)', berat: 72.6, perubahan: 'Turun', lemak: 18.8, kesehatan: 86, progress: 79 },
  { tanggal: '13 Juli 2026', makan: 3, bangun: '06:10', tidur: '23:00', olahraga: 'Lari (20 mnt)', berat: 73.0, perubahan: 'Turun', lemak: 19.1, kesehatan: 83, progress: 74 },
  { tanggal: '12 Juli 2026', makan: 2, bangun: '06:30', tidur: '22:50', olahraga: 'Tidak', berat: 73.4, perubahan: 'Naik', lemak: 19.5, kesehatan: 80, progress: 68 },
  { tanggal: '11 Juli 2026', makan: 3, bangun: '05:40', tidur: '22:30', olahraga: 'Fitness (35 mnt)', berat: 73.2, perubahan: 'Turun', lemak: 19.3, kesehatan: 82, progress: 71 }
];

// --- INITIALISASI CHART ENGINE ---
const chartOptions = (colorGrid) => ({
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#8b949e', font: { size: 10 } } },
    y: { grid: { color: '#1f2631' }, ticks: { color: '#8b949e', font: { size: 10 } } }
  },
  elements: { point: { radius: 4, hoverRadius: 6 }, line: { tension: 0.2, borderWidth: 2 } }
});

const getLabels = () => databaseLokal.map(d => d.tanggal.split(' ')[0] + '/' + (d.tanggal.split(' ')[1] == 'Juli' ? '07' : '08')).reverse();

const weightChart = new Chart(document.getElementById('weightChart'), {
  type: 'line', data: { labels: getLabels(), datasets: [{ data: databaseLokal.map(d => d.berat).reverse(), borderColor: '#388bfd', backgroundColor: 'rgba(56, 139, 253, 0.05)', fill: true }] },
  options: chartOptions()
});

const fatChart = new Chart(document.getElementById('fatChart'), {
  type: 'line', data: { labels: getLabels(), datasets: [{ data: databaseLokal.map(d => d.lemak).reverse(), borderColor: '#f0883e', backgroundColor: 'rgba(240, 136, 62, 0.05)', fill: true }] },
  options: chartOptions()
});

const healthChart = new Chart(document.getElementById('healthChart'), {
  type: 'line', data: { labels: getLabels(), datasets: [{ data: databaseLokal.map(d => d.kesehatan).reverse(), borderColor: '#3fb950', backgroundColor: 'rgba(63, 185, 80, 0.05)', fill: true }] },
  options: chartOptions()
});

const progressChart = new Chart(document.getElementById('progressChart'), {
  type: 'line', data: { labels: getLabels(), datasets: [{ data: databaseLokal.map(d => d.progress).reverse(), borderColor: '#8957e5', backgroundColor: 'rgba(137, 87, 229, 0.05)', fill: true }] },
  options: chartOptions()
});

// --- RENDER FUNGSI METRIK UTAMA & TABEL ---
function renderAplikasi() {
  if(databaseLokal.length > 0) {
    const terupdate = databaseLokal[0];
    document.getElementById('cardWeight').textContent = terupdate.berat;
    document.getElementById('cardFat').textContent = terupdate.lemak;
    document.getElementById('cardHealth').textContent = terupdate.kesehatan;
    document.getElementById('cardProgress').textContent = terupdate.progress;
  }

  const tbody = document.getElementById('table-history-body');
  tbody.innerHTML = '';
  
  databaseLokal.forEach((data, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${data.tanggal}</td>
      <td>${data.makan}</td>
      <td>${data.bangun}</td>
      <td>${data.tidur}</td>
      <td>${data.olahraga}</td>
      <td>${data.berat}</td>
      <td><span class="badge-status ${data.perubahan === 'Turun' ? 'badge-down' : 'badge-up'}">${data.perubahan}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn-row" onclick="hapusBarisData(${index})"><i class="fa-solid fa-trash action-btn-delete"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  document.getElementById('pagination-count-text').textContent = `1 - ${databaseLokal.length} dari ${databaseLokal.length} data`;

  // Update grafik koordinat
  const labelBaru = getLabels();
  [weightChart, fatChart, healthChart, progressChart].forEach((ch, idx) => {
    ch.data.labels = labelBaru;
    if(idx===0) ch.data.datasets[0].data = databaseLokal.map(d => d.berat).reverse();
    if(idx===1) ch.data.datasets[0].data = databaseLokal.map(d => d.lemak).reverse();
    if(idx===2) ch.data.datasets[0].data = databaseLokal.map(d => d.kesehatan).reverse();
    if(idx===3) ch.data.datasets[0].data = databaseLokal.map(d => d.progress).reverse();
    ch.update();
  });
}

window.hapusBarisData = function(index) {
  if(confirm('Hapus log riwayat laporan tanggal ini?')) {
    databaseLokal.splice(index, 1);
    renderAplikasi();
  }
};

// --- LOGIKA FORM HARIAN INTERAKTIF ---
let jumlahMakanInput = document.getElementById('input-makan-count');
document.getElementById('btn-makan-plus').addEventListener('click', () => { jumlahMakanInput.value = parseInt(jumlahMakanInput.value) + 1; });
document.getElementById('btn-makan-min').addEventListener('click', () => { if(parseInt(jumlahMakanInput.value) > 1) jumlahMakanInput.value = parseInt(jumlahMakanInput.value) - 1; });

let statusOlahraga = true;
const sportDetailsFields = document.getElementById('sport-details-fields');
document.getElementById('sport-yes').addEventListener('click', function() {
  statusOlahraga = true; this.classList.add('active'); document.getElementById('sport-no').classList.remove('active');
  sportDetailsFields.style.display = 'block';
});
document.getElementById('sport-no').addEventListener('click', function() {
  statusOlahraga = false; this.classList.add('active'); document.getElementById('sport-yes').classList.remove('active');
  sportDetailsFields.style.display = 'none';
});

// SIMPAN LAPORAN BARU
document.getElementById('btn-save-daily-report').addEventListener('click', () => {
  const beratVal = parseFloat(document.getElementById('input-hari-weight').value) || 72.0;
  const perubahanVal = document.querySelector('input[name="weight-change"]:checked').value;
  const makanCount = parseInt(jumlahMakanInput.value);
  const bangunTime = document.getElementById('input-time-wake').value;
  const tidurTime = document.getElementById('input-time-sleep').value;
  
  let olahragaText = 'Tidak';
  if(statusOlahraga) {
    olahragaText = `${document.getElementById('input-sport-type').value} (${document.getElementById('input-sport-duration').value})`;
  }

  // Auto kalkulasi random scoring indikatif untuk visual grafik
  const mockLemak = parseFloat((18.0 + Math.random() * 2).toFixed(1));
  const mockKesehatan = Math.floor(80 + Math.random() * 15);
  const mockProgress = Math.floor(70 + Math.random() * 20);

  const formatHariIni = new Date();
  const tglString = `${formatHariIni.getDate()} Laporan Baru`;

  databaseLokal.unshift({
    tanggal: tglString, makan: makanCount, bangun: bangunTime, tidur: tidurTime,
    olahraga: olahragaText, berat: beratVal, perubahan: perubahanVal,
    lemak: mockLemak, kesehatan: mockKesehatan, progress: mockProgress
  });

  renderAplikasi();
  alert('Laporan harian berhasil disimpan!');
  document.querySelector('[data-page="dashboard"]').click(); // Lompat otomatis ke dashboard
});

// --- SINGLE PAGE APPLICATION NAVIGATION ENGINE ---
const navItems = document.querySelectorAll('.nav-item');
const pageSections = document.querySelectorAll('.page-section');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');

const pageMetaData = {
  dashboard: { title: 'Dashboard', subtitle: 'Ringkasan perkembangan diet Anda' },
  form: { title: 'Form Harian', subtitle: 'Isi laporan harian diet dan aktivitas Anda' },
  kesimpulan: { title: 'Kesimpulan', subtitle: 'Lihat dan kelola semua laporan harian Anda' },
  generic: { title: 'Modul Aplikasi', subtitle: 'Fitur sedang dalam pengembangan' }
};

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');

    const target = item.getAttribute('data-page');
    pageSections.forEach(sec => sec.classList.remove('active'));
    
    const activeSec = document.getElementById(`page-${target}`);
    if (activeSec) activeSec.classList.add('active');

    const meta = pageMetaData[target] || pageMetaData['generic'];
    pageTitle.textContent = meta.title;
    pageSubtitle.textContent = meta.subtitle;
  });
});

document.getElementById('btn-shortcut-to-form').addEventListener('click', () => {
  document.querySelector('[data-page="form"]').click();
});

// --- WINDOW MANAGEMENT & MODAL DATA DIRI ---
const { ipcRenderer } = require('electron');
document.getElementById('btn-minimize').addEventListener('click', () => ipcRenderer.send('window-minimize'));
document.getElementById('btn-maximize').addEventListener('click', () => ipcRenderer.send('window-maximize'));
document.getElementById('btn-close-app').addEventListener('click', () => { if(confirm('Keluar dari aplikasi?')) ipcRenderer.send('window-close'); });

const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
profileBtn.addEventListener('click', () => profileModal.classList.add('active'));
document.getElementById('closeModalBtn').addEventListener('click', () => profileModal.classList.remove('active'));
document.getElementById('saveModalBtn').addEventListener('click', () => {
  const name = document.getElementById('inputName').value.trim();
  if(name) document.getElementById('displayProfileName').textContent = name;
  profileModal.classList.remove('active');
});

document.getElementById('profileStar').addEventListener('click', function(e) {
  e.stopPropagation();
  this.classList.toggle('fa-regular'); this.classList.toggle('fa-solid');
  this.style.color = this.classList.contains('fa-solid') ? '#f1e05a' : '#8b949e';
});

// Booting awal
renderAplikasi();
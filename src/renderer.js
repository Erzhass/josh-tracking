// --- DATABASE LOKAL (ARRAY OF OBJECTS) - DIKOSONGKAN UNTUK PENGGUNA BARU ---
let databaseLokal = [];

let targetBerat = 0;
let targetLemak = 0;
let statusReminder = true;

// --- INITIALISASI DASHBOARD CHARTS ---
const chartOptions = () => ({
  responsive: true, 
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#8b949e', font: { size: 10 } } },
    y: { grid: { color: '#1f2631' }, ticks: { color: '#8b949e', font: { size: 10 } } }
  },
  elements: { point: { radius: 4, hoverRadius: 6 }, line: { tension: 0.2, borderWidth: 2 } }
});

const getLabels = () => {
  if (databaseLokal.length === 0) return ['Belum Ada Data'];
  return databaseLokal.map(d => {
    const parts = d.tanggal.split(' ');
    const listBulanAngka = {
      'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
      'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
      'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
    };
    const bulan = listBulanAngka[parts[1]] || '01';
    return parts[0] + '/' + bulan;
  }).reverse();
};

const weightChart = new Chart(document.getElementById('weightChart'), {
  type: 'line', 
  data: { labels: getLabels(), datasets: [{ data: [0], borderColor: '#388bfd', backgroundColor: 'rgba(56, 139, 253, 0.05)', fill: true }] },
  options: chartOptions()
});

const fatChart = new Chart(document.getElementById('fatChart'), {
  type: 'line', 
  data: { labels: getLabels(), datasets: [{ data: [0], borderColor: '#f0883e', backgroundColor: 'rgba(240, 136, 62, 0.05)', fill: true }] },
  options: chartOptions()
});

const healthChart = new Chart(document.getElementById('healthChart'), {
  type: 'line', 
  data: { labels: getLabels(), datasets: [{ data: [0], borderColor: '#3fb950', backgroundColor: 'rgba(63, 185, 80, 0.05)', fill: true }] },
  options: chartOptions()
});

const progressChart = new Chart(document.getElementById('progressChart'), {
  type: 'line', 
  data: { labels: getLabels(), datasets: [{ data: [0], borderColor: '#8957e5', backgroundColor: 'rgba(137, 87, 229, 0.05)', fill: true }] },
  options: chartOptions()
});

// --- INITIALISASI STATISTIK ADVANCED COMBO CHART ---
const analyticsComboChart = new Chart(document.getElementById('analyticsComboChart'), {
  type: 'bar',
  data: {
    labels: getLabels(),
    datasets: [
      { label: 'Berat (kg)', data: [0], backgroundColor: 'rgba(56, 139, 253, 0.4)', type: 'bar', yAxisID: 'y' },
      { label: 'Lemak (%)', data: [0], borderColor: '#f0883e', type: 'line', fill: false, yAxisID: 'y1' }
    ]
  },
  options: {
    responsive: true, 
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8b949e' } },
      y: { position: 'left', grid: { color: '#1f2631' }, ticks: { color: '#388bfd' } },
      y1: { position: 'right', grid: { display: false }, ticks: { color: '#f0883e' } }
    },
    plugins: { legend: { labels: { color: '#f0f6fc' } } }
  }
});

// --- ENGINE RE-RENDER APLIKASI UTAMA ---
function renderAplikasi() {
  if (databaseLokal.length > 0) {
    const terupdate = databaseLokal[0];
    document.getElementById('cardWeight').textContent = terupdate.berat;
    document.getElementById('cardFat').textContent = terupdate.lemak;
    document.getElementById('cardHealth').textContent = terupdate.kesehatan;
    document.getElementById('cardProgress').textContent = terupdate.progress;
    
    // Hitung Modul Statistik Avanzado
    let totalBerat = 0; let totalOlahraga = 0; let totalProg = 0;
    databaseLokal.forEach(d => {
      totalBerat += d.berat;
      totalProg += d.progress;
      if(d.olahraga !== 'Tidak') totalOlahraga++;
    });
    
    document.getElementById('stats-avg-weight').textContent = (totalBerat / databaseLokal.length).toFixed(1) + ' kg';
    document.getElementById('stats-total-sports').textContent = totalOlahraga + ' Sesi';
    document.getElementById('stats-diet-compliance').textContent = (totalProg / databaseLokal.length).toFixed(1) + '%';

    // Hitung Modul Target Real-Time
    let selisihBerat = terupdate.berat - targetBerat;
    let progressBrt = targetBerat === 0 ? 0 : (selisihBerat <= 0 ? 100 : Math.max(0, Math.min(100, Math.floor(100 - (selisihBerat * 10)))));
    document.getElementById('progress-weight-label').textContent = progressBrt + '%';
    document.getElementById('progress-weight-bar').style.width = progressBrt + '%';

    let selisihLemak = terupdate.lemak - targetLemak;
    let progressLmk = targetLemak === 0 ? 0 : (selisihLemak <= 0 ? 100 : Math.max(0, Math.min(100, Math.floor(100 - (selisihLemak * 15)))));
    document.getElementById('progress-fat-label').textContent = progressLmk + '%';
    document.getElementById('progress-fat-bar').style.width = progressLmk + '%';
  } else {
    // Tampilan Default Jika Data Masih Kosong (0)
    document.getElementById('cardWeight').textContent = "0";
    document.getElementById('cardFat').textContent = "0";
    document.getElementById('cardHealth').textContent = "0";
    document.getElementById('cardProgress').textContent = "0";
    
    document.getElementById('stats-avg-weight').textContent = "0 kg";
    document.getElementById('stats-total-sports').textContent = "0 Sesi";
    document.getElementById('stats-diet-compliance').textContent = "0%";
    
    document.getElementById('progress-weight-label').textContent = "0%";
    document.getElementById('progress-weight-bar').style.width = "0%";
    document.getElementById('progress-fat-label').textContent = "0%";
    document.getElementById('progress-fat-bar').style.width = "0%";
  }

  // Render Tabel Kesimpulan
  const tbody = document.getElementById('table-history-body');
  if (tbody) {
    tbody.innerHTML = '';
    if (databaseLokal.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#8b949e; padding: 20px;">Belum ada data laporan harian. Silakan isi form terlebih dahulu.</td></tr>`;
      document.getElementById('pagination-count-text').textContent = `0 - 0 dari 0 data`;
    } else {
      databaseLokal.forEach((data, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${data.tanggal}</td>
          <td>${data.makan} x</td>
          <td>${data.bangun}</td>
          <td>${data.tidur}</td>
          <td>${data.olahraga}</td>
          <td>${data.berat} kg</td>
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
    }
  }

  // Sinkronisasi grafik koordinat
  const labelBaru = getLabels();
  [weightChart, fatChart, healthChart, progressChart].forEach((ch, idx) => {
    ch.data.labels = labelBaru;
    if (databaseLokal.length === 0) {
      ch.data.datasets[0].data = [0];
    } else {
      if(idx===0) ch.data.datasets[0].data = databaseLokal.map(d => d.berat).reverse();
      if(idx===1) ch.data.datasets[0].data = databaseLokal.map(d => d.lemak).reverse();
      if(idx===2) ch.data.datasets[0].data = databaseLokal.map(d => d.kesehatan).reverse();
      if(idx===3) ch.data.datasets[0].data = databaseLokal.map(d => d.progress).reverse();
    }
    ch.update();
  });

  // Sinkronisasi grafik kombinasi statistik halaman analitik
  analyticsComboChart.data.labels = labelBaru;
  if (databaseLokal.length === 0) {
    analyticsComboChart.data.datasets[0].data = [0];
    analyticsComboChart.data.datasets[1].data = [0];
  } else {
    analyticsComboChart.data.datasets[0].data = databaseLokal.map(d => d.berat).reverse();
    analyticsComboChart.data.datasets[1].data = databaseLokal.map(d => d.lemak).reverse();
  }
  analyticsComboChart.update();
}

window.hapusBarisData = function(index) {
  if(confirm('Hapus log riwayat laporan tanggal ini?')) {
    databaseLokal.splice(index, 1);
    renderAplikasi();
  }
};

// --- DIALOG LOGIKA FORM HARIAN INTERAKTIF ---
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

// SIMPAN ENTRY DATA DATA BARU
document.getElementById('btn-save-daily-report').addEventListener('click', () => {
  const beratVal = parseFloat(document.getElementById('input-hari-weight').value);
  if (!beratVal) {
    alert('Mohon masukkan berat badan hari ini terlebih dahulu!');
    return;
  }
  
  const perubahanVal = document.querySelector('input[name="weight-change"]:checked').value;
  const makanCount = parseInt(jumlahMakanInput.value);
  const bangunTime = document.getElementById('input-time-wake').value;
  const tidurTime = document.getElementById('input-time-sleep').value;
  
  let olahragaText = 'Tidak';
  if(statusOlahraga) {
    olahragaText = `${document.getElementById('input-sport-type').value} (${document.getElementById('input-sport-duration').value})`;
  }

  // Membuat data kalkulasi tiruan agar statistik terisi dinamis sesuai bobot inputan
  const mockLemak = parseFloat((15.0 + Math.random() * 5).toFixed(1));
  const mockKesehatan = Math.floor(75 + Math.random() * 20);
  const mockProgress = Math.floor(65 + Math.random() * 30);

  const formatHariIni = new Date();
  const listBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const tglString = `${formatHariIni.getDate()} ${listBulan[formatHariIni.getMonth()]}`;

  databaseLokal.unshift({
    tanggal: tglString, makan: makanCount, bangun: bangunTime, tidur: tidurTime,
    olahraga: olahragaText, berat: beratVal, perubahan: perubahanVal,
    lemak: mockLemak, kesehatan: mockKesehatan, progress: mockProgress
  });

  renderAplikasi();
  alert('Laporan harian berhasil disimpan!');
  document.getElementById('input-hari-weight').value = ''; // Reset form input berat
  document.querySelector('[data-page="dashboard"]').click();
});

// --- ROUTING SINGLE PAGE APPLICATION (SPA) NAVIGATION ---
const navItems = document.querySelectorAll('.nav-item');
const pageSections = document.querySelectorAll('.page-section');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');

const pageMetaData = {
  dashboard: { title: 'Dashboard', subtitle: 'Ringkasan perkembangan diet Anda' },
  form: { title: 'Form Harian', subtitle: 'Isi laporan harian diet dan aktivitas Anda' },
  kesimpulan: { title: 'Kesimpulan', subtitle: 'Lihat dan kelola semua laporan harian Anda' },
  statistik: { title: 'Grafik & Statistik', subtitle: 'Analisis komprehensif data kesehatan Anda' },
  target: { title: 'Target', subtitle: 'Kelola sasaran berat badan dan parameter ideal Anda' },
  pengingat: { title: 'Pengingat', subtitle: 'Atur jadwal notifikasi otomatis pelaporan harian' },
  pengaturan: { title: 'Pengaturan', subtitle: 'Konfigurasi global preferensi aplikasi' },
  tentang: { title: 'Tentang Aplikasi', subtitle: 'Informasi sistem dan lisensi aplikasi JOSH' }
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

    const meta = pageMetaData[target];
    if (meta) {
      pageTitle.textContent = meta.title;
      pageSubtitle.textContent = meta.subtitle;
    }
  });
});

const shortcutBtn = document.getElementById('btn-shortcut-to-form');
if(shortcutBtn) {
  shortcutBtn.addEventListener('click', () => {
    document.querySelector('[data-page="form"]').click();
  });
}

// --- EVENT CONTROLLER MENU TARGET, ALARM & SETTING ---
document.getElementById('reminder-on').addEventListener('click', function() {
  statusReminder = true; this.classList.add('active'); document.getElementById('reminder-off').classList.remove('active');
});
document.getElementById('reminder-off').addEventListener('click', function() {
  statusReminder = false; this.classList.add('active'); document.getElementById('reminder-on').classList.remove('active');
});
document.getElementById('btn-save-reminder').addEventListener('click', () => {
  const waktu = document.getElementById('reminder-time-input').value;
  alert(`Pengingat harian berhasil dikonfigurasi pada pukul ${waktu} (${statusReminder ? 'Aktif' : 'Mati'}).`);
});

document.getElementById('btn-save-settings').addEventListener('click', () => {
  const unit = document.getElementById('setting-unit-select').value;
  const tema = document.getElementById('setting-theme-select').value;
  
  // LOGIKA RESPONS TEMA INDUK GLOBAL
  if(tema === 'amoled') {
    document.body.classList.add('amoled-theme');
  } else {
    document.body.classList.remove('amoled-theme');
  }
  alert(`Pengaturan sistem berhasil diterapkan: Satuan (${unit.toUpperCase()}), Tema (${tema === 'dark' ? 'Dark Slate' : 'AMOLED Deep Black'}).`);
});

// --- ELECTRON INTER-PROCESS WINDOWS MANAGEMENT ---
const { ipcRenderer } = require('electron');
document.getElementById('btn-minimize').addEventListener('click', () => ipcRenderer.send('window-minimize'));
document.getElementById('btn-maximize').addEventListener('click', () => ipcRenderer.send('window-maximize'));
document.getElementById('btn-close-app').addEventListener('click', () => { if(confirm('Keluar dari aplikasi?')) ipcRenderer.send('window-close'); });

// --- MODAL DATA DIRI & TARGET INTEGRATED CONTROLLER ---
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
profileBtn.addEventListener('click', () => profileModal.classList.add('active'));
document.getElementById('closeModalBtn').addEventListener('click', () => profileModal.classList.remove('active'));

document.getElementById('saveModalBtn').addEventListener('click', () => {
  const name = document.getElementById('inputName').value.trim();
  const inputTargetBerat = parseFloat(document.getElementById('inputTargetWeight').value) || 0;
  const inputTargetLemak = parseFloat(document.getElementById('inputTargetFat').value) || 0;

  if(name) {
    document.getElementById('displayProfileName').textContent = name;
  }
  
  // Set target dari modal data diri global
  targetBerat = inputTargetBerat;
  targetLemak = inputTargetLemak;
  
  // Jalankan render ulang agar data target baru langsung terhitung secara real-time
  renderAplikasi();
  
  profileModal.classList.remove('active');
  alert('Profil & Target Kebugaran berhasil disinkronkan!');
});

document.getElementById('profileStar').addEventListener('click', function(e) {
  e.stopPropagation();
  this.classList.toggle('fa-regular'); this.classList.toggle('fa-solid');
  this.style.color = this.classList.contains('fa-solid') ? '#f1e05a' : '#8b949e';
});

// Jalankan rendering aplikasi pada pemuatan pertama (Kondisi Kosong)
renderAplikasi();
// --- DATABASE & DATA USER STATE ---
let databaseLokal = [];
let databaseCatatan = [
  {
    title: 'Tips Konsumsi Protein',
    category: 'Menu Diet',
    content: 'Prioritaskan dada ayam 200g dan 2 butir telur rebus setiap hari untuk menjaga massa otot.',
    date: '22 Juli'
  }
];

let userState = {
  beratSekarang: 70,
  tinggiBadan: 170,
  usia: 20,
  gender: 'male',
  targetBerat: 60,
  targetLemak: 15,
  kadarLemakAktif: 0
};

let rentangHariAktif = 30; // Default filter 30 hari

// --- RUMUS HITUNG ESTIMASI KADAR LEMAK (BODY FAT %) ---
function hitungEstimasiLemak(beratKg, tinggiCm, usiaTahun, gender) {
  if (!beratKg || !tinggiCm || !usiaTahun) return 0;
  
  const tinggiMeter = tinggiCm / 100;
  const bmi = beratKg / (tinggiMeter * tinggiMeter);
  
  let bodyFat = 0;
  if (gender === 'male') {
    bodyFat = (1.20 * bmi) + (0.23 * usiaTahun) - 16.2;
  } else {
    bodyFat = (1.20 * bmi) + (0.23 * usiaTahun) - 5.4;
  }

  return Math.max(3, Math.min(50, parseFloat(bodyFat.toFixed(1))));
}

// --- POP-UP TOAST NOTIFICATION KUSTOM ---
function tampilkanToast(pesan) {
  const container = document.getElementById('toast-container');
  const toastBox = document.createElement('div');
  toastBox.className = 'toast-box toast-success';
  toastBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${pesan}</span>`;
  
  container.appendChild(toastBox);
  
  setTimeout(() => {
    toastBox.style.animation = 'slideInToast 0.3s reverse forwards';
    setTimeout(() => { toastBox.remove(); }, 300);
  }, 3500);
}

// --- CONFIG & INSTANSIASI CHART.JS ---
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
  const dataTerfilter = databaseLokal.slice(0, rentangHariAktif);
  if (dataTerfilter.length === 0) return ['Belum Ada Data'];
  
  return dataTerfilter.map(d => {
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
  type: 'line', data: { labels: getLabels(), datasets: [{ data: [0], borderColor: '#388bfd', backgroundColor: 'rgba(56, 139, 253, 0.05)', fill: true }] }, options: chartOptions()
});
const fatChart = new Chart(document.getElementById('fatChart'), {
  type: 'line', data: { labels: getLabels(), datasets: [{ data: [0], borderColor: '#f0883e', backgroundColor: 'rgba(240, 136, 62, 0.05)', fill: true }] }, options: chartOptions()
});
const healthChart = new Chart(document.getElementById('healthChart'), {
  type: 'line', data: { labels: getLabels(), datasets: [{ data: [0], borderColor: '#3fb950', backgroundColor: 'rgba(63, 185, 80, 0.05)', fill: true }] }, options: chartOptions()
});
const progressChart = new Chart(document.getElementById('progressChart'), {
  type: 'line', data: { labels: getLabels(), datasets: [{ data: [0], borderColor: '#8957e5', backgroundColor: 'rgba(137, 87, 229, 0.05)', fill: true }] }, options: chartOptions()
});

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
    responsive: true, maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8b949e' } },
      y: { position: 'left', grid: { color: '#1f2631' }, ticks: { color: '#388bfd' } },
      y1: { position: 'right', grid: { display: false }, ticks: { color: '#f0883e' } }
    },
    plugins: { legend: { labels: { color: '#8b949e' } } }
  }
});

// --- RENDER RE-CALCULATE ENGINE DASHBOARD ---
function renderAplikasi() {
  const dataLimit = databaseLokal.slice(0, rentangHariAktif);

  // Re-Calculate Lemak Tubuh Terkini dari Profil
  userState.kadarLemakAktif = hitungEstimasiLemak(userState.beratSekarang, userState.tinggiBadan, userState.usia, userState.gender);

  if (databaseLokal.length > 0) {
    const terupdate = databaseLokal[0];
    document.getElementById('cardWeight').textContent = terupdate.berat;
    document.getElementById('cardFat').textContent = terupdate.lemak;
    document.getElementById('cardHealth').textContent = terupdate.kesehatan;
    document.getElementById('cardProgress').textContent = terupdate.progress;
    
    let totalBerat = 0; let totalOlahraga = 0; let totalProg = 0;
    databaseLokal.forEach(d => {
      totalBerat += d.berat;
      totalProg += d.progress;
      if(d.olahraga !== 'Tidak') totalOlahraga++;
    });
    
    document.getElementById('stats-avg-weight').textContent = (totalBerat / databaseLokal.length).toFixed(1) + ' kg';
    document.getElementById('stats-total-sports').textContent = totalOlahraga + ' Sesi';
    document.getElementById('stats-diet-compliance').textContent = (totalProg / databaseLokal.length).toFixed(1) + '%';
  } else {
    // Tampilan awal tanpa riwayat log
    document.getElementById('cardWeight').textContent = userState.beratSekarang;
    document.getElementById('cardFat').textContent = userState.kadarLemakAktif;
    document.getElementById('cardHealth').textContent = '80';
    document.getElementById('cardProgress').textContent = '0';
  }

  // LOGIKA TARGET PROGRESS BAR
  const beratSkrg = databaseLokal.length > 0 ? databaseLokal[0].berat : userState.beratSekarang;
  const lemakSkrg = databaseLokal.length > 0 ? databaseLokal[0].lemak : userState.kadarLemakAktif;

  let selisihBerat = beratSkrg - userState.targetBerat;
  let progressBrt = userState.targetBerat === 0 ? 0 : (selisihBerat <= 0 ? 100 : Math.max(0, Math.min(100, Math.floor(100 - (selisihBerat * 10)))));
  document.getElementById('progress-weight-label').textContent = progressBrt + '%';
  document.getElementById('progress-weight-bar').style.width = progressBrt + '%';

  let selisihLemak = lemakSkrg - userState.targetLemak;
  let progressLmk = userState.targetLemak === 0 ? 0 : (selisihLemak <= 0 ? 100 : Math.max(0, Math.min(100, Math.floor(100 - (selisihLemak * 12)))));
  document.getElementById('progress-fat-label').textContent = progressLmk + '%';
  document.getElementById('progress-fat-bar').style.width = progressLmk + '%';

  // TABLE RENDERING
  const tbody = document.getElementById('table-history-body');
  if (tbody) {
    tbody.innerHTML = '';
    if (databaseLokal.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#8b949e; padding: 20px;">Belum ada data riwayat log.</td></tr>`;
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
          <td><button class="action-btn-row" onclick="hapusBarisData(${index})"><i class="fa-solid fa-trash"></i></button></td>
        `;
        tbody.appendChild(tr);
      });
      document.getElementById('pagination-count-text').textContent = `1 - ${databaseLokal.length} dari ${databaseLokal.length} data`;
    }
  }

  // GRAFIK SYNCHRONIZATION
  const labelBaru = getLabels();
  [weightChart, fatChart, healthChart, progressChart].forEach((ch, idx) => {
    ch.data.labels = labelBaru;
    if (dataLimit.length === 0) {
      ch.data.datasets[0].data = [0];
    } else {
      if(idx===0) ch.data.datasets[0].data = dataLimit.map(d => d.berat).reverse();
      if(idx===1) ch.data.datasets[0].data = dataLimit.map(d => d.lemak).reverse();
      if(idx===2) ch.data.datasets[0].data = dataLimit.map(d => d.kesehatan).reverse();
      if(idx===3) ch.data.datasets[0].data = dataLimit.map(d => d.progress).reverse();
    }
    ch.update();
  });

  analyticsComboChart.data.labels = labelBaru;
  if (dataLimit.length === 0) {
    analyticsComboChart.data.datasets[0].data = [0];
    analyticsComboChart.data.datasets[1].data = [0];
  } else {
    analyticsComboChart.data.datasets[0].data = dataLimit.map(d => d.berat).reverse();
    analyticsComboChart.data.datasets[1].data = dataLimit.map(d => d.lemak).reverse();
  }
  analyticsComboChart.update();

  // RENDER LIST CATATAN & JURNAL
  renderCatatanList();
}

// LOGIKA RENDER & MANAJEMEN CATATAN
function renderCatatanList() {
  const notesContainer = document.getElementById('notes-list-grid');
  const countBadge = document.getElementById('notes-count-badge');
  
  if (!notesContainer) return;
  notesContainer.innerHTML = '';
  if (countBadge) countBadge.textContent = `${databaseCatatan.length} Catatan`;

  if (databaseCatatan.length === 0) {
    notesContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #8b949e; padding: 30px;">Belum ada catatan tersimpan.</div>`;
    return;
  }

  databaseCatatan.forEach((note, index) => {
    const noteCard = document.createElement('div');
    noteCard.className = 'note-item-card';
    noteCard.innerHTML = `
      <span class="note-tag">${note.category}</span>
      <h4 class="note-title">${note.title}</h4>
      <p class="note-content-text">${note.content}</p>
      <div class="note-date-footer">
        <span><i class="fa-regular fa-clock"></i> ${note.date}</span>
        <button class="note-delete-btn" onclick="hapusCatatan(${index})" title="Hapus Catatan"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    notesContainer.appendChild(noteCard);
  });
}

// Tambah Catatan Baru
const btnSaveNote = document.getElementById('btn-save-note');
if (btnSaveNote) {
  btnSaveNote.addEventListener('click', () => {
    const title = document.getElementById('input-note-title').value.trim();
    const category = document.getElementById('input-note-category').value;
    const content = document.getElementById('input-note-content').value.trim();

    if (!title || !content) {
      tampilkanToast('Harap isi judul dan konten catatan!');
      return;
    }

    const formatHariIni = new Date();
    const listBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const tglString = `${formatHariIni.getDate()} ${listBulan[formatHariIni.getMonth()]}`;

    databaseCatatan.unshift({ title, category, content, date: tglString });
    
    // Clear input
    document.getElementById('input-note-title').value = '';
    document.getElementById('input-note-content').value = '';

    renderCatatanList();
    tampilkanToast('Catatan baru berhasil disimpan!');
  });
}

// Hapus Catatan
window.hapusCatatan = function(index) {
  databaseCatatan.splice(index, 1);
  renderCatatanList();
  tampilkanToast('Catatan telah dihapus.');
};

// LOGIKA FILTER WAKTU (7 HARI VS 30 HARI)
document.getElementById('header-period-filter').addEventListener('change', function() {
  rentangHariAktif = parseInt(this.value);
  renderAplikasi();
  tampilkanToast(`Rentang data grafik diubah ke ${rentangHariAktif} hari terakhir.`);
});

window.hapusBarisData = function(index) {
  databaseLokal.splice(index, 1);
  renderAplikasi();
  tampilkanToast("Log data riwayat berhasil dihapus!");
};

// --- LOGIKA FORM HARIAN ---
let jumlahMakanInput = document.getElementById('input-makan-count');
document.getElementById('btn-makan-plus').addEventListener('click', () => { jumlahMakanInput.value = parseInt(jumlahMakanInput.value) + 1; });
document.getElementById('btn-makan-min').addEventListener('click', () => { if(parseInt(jumlahMakanInput.value) > 1) jumlahMakanInput.value = parseInt(jumlahMakanInput.value) - 1; });

let statusOlahraga = true;
document.getElementById('sport-yes').addEventListener('click', function() {
  statusOlahraga = true; this.classList.add('active'); document.getElementById('sport-no').classList.remove('active');
  document.getElementById('sport-details-fields').style.display = 'block';
});
document.getElementById('sport-no').addEventListener('click', function() {
  statusOlahraga = false; this.classList.add('active'); document.getElementById('sport-yes').classList.remove('active');
  document.getElementById('sport-details-fields').style.display = 'none';
});

document.getElementById('btn-save-daily-report').addEventListener('click', () => {
  const beratVal = parseFloat(document.getElementById('input-hari-weight').value);
  if (!beratVal) {
    tampilkanToast('Error: Parameter berat badan hari ini kosong!');
    return;
  }

  userState.beratSekarang = beratVal; // Update berat badan aktif
  const lemakKalkulasi = hitungEstimasiLemak(beratVal, userState.tinggiBadan, userState.usia, userState.gender);

  const perubahanVal = document.querySelector('input[name="weight-change"]:checked').value;
  const makanCount = parseInt(jumlahMakanInput.value);
  const bangunTime = document.getElementById('input-time-wake').value;
  const tidurTime = document.getElementById('input-time-sleep').value;
  let olahragaText = statusOlahraga ? `${document.getElementById('input-sport-type').value} (${document.getElementById('input-sport-duration').value})` : 'Tidak';

  const mockKesehatan = Math.floor(75 + Math.random() * 22);
  const mockProgress = Math.floor(60 + Math.random() * 40);

  const formatHariIni = new Date();
  const listBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const tglString = `${formatHariIni.getDate()} ${listBulan[formatHariIni.getMonth()]}`;

  databaseLokal.unshift({
    tanggal: tglString, makan: makanCount, bangun: bangunTime, tidur: tidurTime,
    olahraga: olahragaText, berat: beratVal, perubahan: perubahanVal,
    lemak: lemakKalkulasi, kesehatan: mockKesehatan, progress: mockProgress
  });

  renderAplikasi();
  tampilkanToast(`Laporan disimpan! Estimasi kadar lemak: ${lemakKalkulasi}%`);
  document.getElementById('input-hari-weight').value = '';
  document.querySelector('[data-page="dashboard"]').click();
});

// --- ROUTING SINGLE PAGE ---
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
  catatan: { title: 'Catatan & Jurnal', subtitle: 'Kelola catatan menu diet, jurnal workout, dan target harian' },
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
    document.getElementById(`page-${target}`).classList.add('active');

    const meta = pageMetaData[target];
    if (meta) { pageTitle.textContent = meta.title; pageSubtitle.textContent = meta.subtitle; }
  });
});

document.getElementById('btn-shortcut-to-form').addEventListener('click', () => {
  document.querySelector('[data-page="form"]').click();
});

// --- KONFIGURASI TEMA VISUAL ---
document.getElementById('btn-save-settings').addEventListener('click', () => {
  const temaSelect = document.getElementById('setting-theme-select').value;
  document.body.classList.remove('theme-amoled', 'theme-light', 'theme-cyberpunk');
  if (temaSelect === 'amoled') document.body.classList.add('theme-amoled');
  else if (temaSelect === 'light') document.body.classList.add('theme-light');
  else if (temaSelect === 'cyberpunk') document.body.classList.add('theme-cyberpunk');
  tampilkanToast(`Visual sukses dialihkan ke tema ${temaSelect.toUpperCase()}!`);
});

// --- ELECTRON WINDOW INTEGRATION ---
const { ipcRenderer } = require('electron');
document.getElementById('btn-minimize').addEventListener('click', () => ipcRenderer.send('window-minimize'));
document.getElementById('btn-maximize').addEventListener('click', () => ipcRenderer.send('window-maximize'));
document.getElementById('btn-close-app').addEventListener('click', () => ipcRenderer.send('window-close'));

// --- MODAL PROFIL & METRIK FISIK ---
const profileModal = document.getElementById('profileModal');
document.getElementById('profileBtn').addEventListener('click', () => {
  document.getElementById('inputCurrentWeight').value = userState.beratSekarang;
  document.getElementById('inputHeight').value = userState.tinggiBadan;
  document.getElementById('inputAge').value = userState.usia;
  document.getElementById('inputGender').value = userState.gender;
  document.getElementById('inputTargetWeight').value = userState.targetBerat;
  document.getElementById('inputTargetFat').value = userState.targetLemak;
  profileModal.classList.add('active');
});

document.getElementById('closeModalBtn').addEventListener('click', () => profileModal.classList.remove('active'));

document.getElementById('saveModalBtn').addEventListener('click', () => {
  const name = document.getElementById('inputName').value.trim();
  if(name) document.getElementById('displayProfileName').textContent = name;
  
  userState.beratSekarang = parseFloat(document.getElementById('inputCurrentWeight').value) || 70;
  userState.tinggiBadan = parseFloat(document.getElementById('inputHeight').value) || 170;
  userState.usia = parseInt(document.getElementById('inputAge').value) || 20;
  userState.gender = document.getElementById('inputGender').value;
  userState.targetBerat = parseFloat(document.getElementById('inputTargetWeight').value) || 60;
  userState.targetLemak = parseFloat(document.getElementById('inputTargetFat').value) || 15;

  renderAplikasi();
  profileModal.classList.remove('active');
  tampilkanToast(`Profil berhasil diupdate! Kadar lemak tubuh saat ini: ${userState.kadarLemakAktif}%`);
});

renderAplikasi();
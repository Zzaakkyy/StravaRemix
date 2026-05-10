// ============ DATA STORAGE ============
// Kunci untuk localStorage
const STORAGE_KEYS = {
    ACTIVITIES: 'strava_activities',
    POSTED_ACTIVITIES: 'strava_posted_activities'
};

// Data default untuk demo
const defaultActivities = [
    { id: '1', olahraga: 'Lari', durasi: 30, jarak: 5, tanggal: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), isPosted: true, userId: 'Andi' },
    { id: '2', olahraga: 'Bersepeda', durasi: 60, jarak: 20, tanggal: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), isPosted: false, userId: 'Andi' },
    { id: '3', olahraga: 'Lari', durasi: 45, jarak: 10, tanggal: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), isPosted: true, userId: 'Andi' }
];

// Data teman (static)
const friendActivities = [
    { id: 'f1', name: 'Budi', sport: 'Lari', distance: 8, duration: '2 jam lalu', pace: 'Pace 5\'45"', likes: 12, comments: 3 },
    { id: 'f2', name: 'Citra', sport: 'Bersepeda', distance: 25, duration: '1 hari lalu', pace: 'Speed 24km/j', likes: 8, comments: 2 },
    { id: 'f3', name: 'Dewi', sport: 'Renang', distance: 2, duration: '3 jam lalu', pace: '2km/jam', likes: 5, comments: 1 }
];

// Fasilitas data
const fasilitasData = [
    { id: 1, nama: '💧 Water Station - Taman GBK', kategori: 'water', jarak: '0.5 km' },
    { id: 2, nama: '🚻 Toilet Umum - Halte Busway', kategori: 'toilet', jarak: '0.8 km' },
    { id: 3, nama: '💡 Lampu Penerangan - Jalan Sudirman', kategori: 'lampu', jarak: '0.3 km' },
    { id: 4, nama: '🅿️ Parkir Sentral - SCBD', kategori: 'parkir', jarak: '1.2 km' },
    { id: 5, nama: '💧 Water Station - Senayan', kategori: 'water', jarak: '0.7 km' },
    { id: 6, nama: '🚻 Toilet - Kota Kasablanka', kategori: 'toilet', jarak: '1.5 km' }
];

// Rute data
const ruteData = [
    { id: 1, nama: 'GBK Loop - 10km', rating: '⭐ 4.8', jarak: '10 km', jarakDariUser: '2 km', users: '1.234 pelari' },
    { id: 2, nama: 'Sudirman-Thamrin - 8km', rating: '⭐ 4.6', jarak: '8 km', jarakDariUser: '1.5 km', users: '892 pelari' },
    { id: 3, nama: 'SCBD Night Run - 5km', rating: '⭐ 4.9', jarak: '5 km', jarakDariUser: '0.8 km', users: '2.100 pelari' }
];

// Badges data berdasarkan pencapaian
const badgesData = [
    { name: '10km Club', icon: '🏃', achieved: true, gold: true },
    { name: 'Early Bird', icon: '🌅', achieved: false, gold: false },
    { name: 'Speedster', icon: '⚡', achieved: false, gold: false },
    { name: 'Consistency', icon: '🔥', achieved: true, gold: true }
];

// ============ UTILITY FUNCTIONS ============
function showToast(message) {
    let existingToast = document.querySelector('.toast-global');
    if (existingToast) existingToast.remove();

    let toast = document.createElement('div');
    toast.className = 'toast-global';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2000);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatRelativeDate(date) {
    const now = new Date();
    const diffDays = Math.floor((now - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    return `${diffDays} hari lalu`;
}

// ============ ACTIVITY STORAGE ============
function getActivities() {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (stored) {
        return JSON.parse(stored, (key, value) => {
            if (key === 'tanggal') return new Date(value);
            return value;
        });
    }
    // Initialize with default data
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(defaultActivities));
    return [...defaultActivities];
}

function saveActivities(activities) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
}

function addActivity(activity) {
    const activities = getActivities();
    const newActivity = {
        ...activity,
        id: Date.now().toString(),
        tanggal: new Date(),
        isPosted: false,
        userId: 'Andi'
    };
    activities.push(newActivity);
    saveActivities(activities);
    return newActivity;
}

function deleteActivity(id) {
    let activities = getActivities();
    activities = activities.filter(a => a.id !== id);
    saveActivities(activities);
}

function postActivity(id) {
    const activities = getActivities();
    const index = activities.findIndex(a => a.id === id);
    if (index !== -1) {
        activities[index].isPosted = true;
        saveActivities(activities);
        
        // Also add to posted activities for feed
        const postedActivities = getPostedActivities();
        postedActivities.unshift({ ...activities[index] });
        savePostedActivities(postedActivities);
    }
}

function getPostedActivities() {
    const stored = localStorage.getItem(STORAGE_KEYS.POSTED_ACTIVITIES);
    if (stored) {
        return JSON.parse(stored, (key, value) => {
            if (key === 'tanggal') return new Date(value);
            return value;
        });
    }
    const initialPosted = defaultActivities.filter(a => a.isPosted);
    localStorage.setItem(STORAGE_KEYS.POSTED_ACTIVITIES, JSON.stringify(initialPosted));
    return initialPosted;
}

function savePostedActivities(activities) {
    localStorage.setItem(STORAGE_KEYS.POSTED_ACTIVITIES, JSON.stringify(activities));
}

function addPostedActivity(activity) {
    const posted = getPostedActivities();
    posted.unshift(activity);
    savePostedActivities(posted);
}

// ============ STATISTICS FUNCTIONS ============
function getTotalStatistics() {
    const activities = getActivities();
    const totalJarak = activities.reduce((sum, a) => sum + (a.jarak || 0), 0);
    const totalDurasi = activities.reduce((sum, a) => sum + a.durasi, 0);
    const totalKalori = Math.round(totalJarak * 60); // Estimasi: 60 kcal per km
    
    return { totalJarak, totalDurasi, totalKalori, totalAktivitas: activities.length };
}

function getLifetimeStats() {
    const activities = getActivities();
    const totalJarak = activities.reduce((sum, a) => sum + (a.jarak || 0), 0);
    const totalDurasiJam = Math.floor(activities.reduce((sum, a) => sum + a.durasi, 0) / 60);
    
    return {
        totalJarak: Math.round(totalJarak * 10) / 10,
        totalJam: totalDurasiJam,
        totalAktivitas: activities.length
    };
}

function getWeeklyData() {
    const activities = getActivities();
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const distances = [0, 0, 0, 0, 0, 0, 0];
    
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    
    activities.forEach(activity => {
        const activityDate = new Date(activity.tanggal);
        if (activityDate >= startOfWeek) {
            const dayIndex = activityDate.getDay() - 1;
            if (dayIndex >= 0 && dayIndex < 7) {
                distances[dayIndex] += activity.jarak || 0;
            }
        }
    });
    
    return { days, distances };
}

function getSportStats() {
    const activities = getActivities();
    let lari = 0, sepeda = 0, lainnya = 0;
    
    activities.forEach(activity => {
        if (activity.olahraga === 'Lari') lari += activity.jarak || 0;
        else if (activity.olahraga === 'Bersepeda') sepeda += activity.jarak || 0;
        else lainnya += activity.durasi;
    });
    
    return { lari, sepeda, lainnya };
}

// ============ PAGE RENDERERS ============

// Render Dashboard
function renderDashboard() {
    const stats = getTotalStatistics();
    document.getElementById('totalJarak').textContent = stats.totalJarak;
    document.getElementById('totalKalori').textContent = stats.totalKalori;
    document.getElementById('totalDurasi').textContent = stats.totalDurasi;
    
    const weekly = getWeeklyData();
    const chartContainer = document.getElementById('weeklyChart');
    if (chartContainer) {
        chartContainer.innerHTML = '';
        weekly.days.forEach((day, i) => {
            const height = Math.min(weekly.distances[i] * 15, 200);
            chartContainer.innerHTML += `
                <div class="bar-item">
                    <div class="bar-value">${weekly.distances[i]} km</div>
                    <div class="bar" style="height: ${height}px"></div>
                    <div class="bar-label">${day}</div>
                </div>
            `;
        });
    }
    
    const badgesContainer = document.getElementById('badgesGrid');
    if (badgesContainer) {
        badgesContainer.innerHTML = '';
        badgesData.forEach(badge => {
            badgesContainer.innerHTML += `
                <div class="badge ${badge.achieved ? 'badge-gold' : 'badge-gray'}">
                    <div class="badge-icon">${badge.icon}</div>
                    <div class="badge-name">${badge.name}</div>
                </div>
            `;
        });
    }
    
    const recentContainer = document.getElementById('recentActivities');
    if (recentContainer) {
        const activities = getActivities();
        recentContainer.innerHTML = '';
        activities.slice(0, 3).forEach(activity => {
            recentContainer.innerHTML += `
                <li>
                    <div>
                        <div class="activity-name">${activity.olahraga} ${activity.jarak || 0}km</div>
                        <div class="activity-date">${formatRelativeDate(activity.tanggal)}</div>
                    </div>
                    <div>${activity.durasi} menit</div>
                </li>
            `;
        });
    }
    
    const sportStats = getSportStats();
    const sportContainer = document.getElementById('sportStats');
    if (sportContainer) {
        sportContainer.innerHTML = `
            <div class="sport-card sport-card-lari">
                <div class="sport-icon">🏃</div>
                <div class="sport-value">${sportStats.lari} km</div>
                <div class="sport-label">Lari</div>
            </div>
            <div class="sport-card sport-card-bersepeda">
                <div class="sport-icon">🚴</div>
                <div class="sport-value">${sportStats.sepeda} km</div>
                <div class="sport-label">Bersepeda</div>
            </div>
            <div class="sport-card sport-card-lain">
                <div class="sport-icon">🎾</div>
                <div class="sport-value">${sportStats.lainnya} menit</div>
                <div class="sport-label">Olahraga Lain</div>
            </div>
        `;
    }
}

// Render Beranda (index.html)
function renderBeranda() {
    // Total stats
    const stats = getTotalStatistics();
    const totalDistanceElem = document.getElementById('totalDistance');
    const totalCaloriesElem = document.getElementById('totalCalories');
    if (totalDistanceElem) totalDistanceElem.textContent = stats.totalJarak;
    if (totalCaloriesElem) totalCaloriesElem.textContent = stats.totalKalori;
    
    // Render posted activities
    const postedContainer = document.getElementById('postedActivitiesContainer');
    if (postedContainer) {
        const postedActivities = getPostedActivities();
        if (postedActivities.length > 0) {
            postedContainer.innerHTML = '';
            postedActivities.forEach(post => {
                postedContainer.innerHTML += `
                    <div class="card">
                        <div class="card-header">
                            <span class="card-name">👤 ${post.userId} <span class="badge-posted">📢 Diposting</span></span>
                            <span class="card-time">${formatDate(post.tanggal)}</span>
                        </div>
                        <div class="stats">
                            <span>${post.olahraga}</span> |
                            <span>${post.durasi} menit</span> |
                            <span>${post.jarak || 0} km</span>
                        </div>
                        <div class="map-placeholder" style="background:#e0e0e0; height:100px; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#666;">
                            🗺️ Mockup Rute
                        </div>
                        <div class="actions">
                            <button onclick="showToast('❤️ Menyukai postingan ini!')">❤️ Like</button>
                            <button onclick="showToast('💬 Fitur komentar (prototipe)')">💬 Komentar</button>
                            <button onclick="showToast('↗️ Membagikan postingan')">↗️ Share</button>
                        </div>
                    </div>
                `;
            });
        } else {
            postedContainer.innerHTML = '<div class="card" style="text-align:center; color:#888;">Belum ada postingan. Catat aktivitas dan posting! 📝</div>';
        }
    }
    
    // Render friend activities
    const activitiesContainer = document.getElementById('activitiesContainer');
    if (activitiesContainer) {
        activitiesContainer.innerHTML = '';
        friendActivities.forEach((activity, index) => {
            activitiesContainer.innerHTML += `
                <div class="card">
                    <div class="card-header">
                        <span class="card-name">${activity.name} · ${activity.sport} ${activity.distance}km</span>
                        <span class="card-time">${activity.duration}</span>
                    </div>
                    <div class="stats">
                        <span>Jarak: ${activity.distance} km</span> |
                        <span>${activity.duration}</span> |
                        <span>${activity.pace}</span>
                    </div>
                    <div id="map-friend-${index}" style="height: 200px; border-radius: 8px; margin: 12px 0;"></div>
                    <div class="actions">
                        <button onclick="showToast('Aktivitas disimpan ke favorit!')">🔖 Simpan</button>
                        <button onclick="showToast('Menyukai aktivitas ini!')">❤️ ${activity.likes}</button>
                        <button onclick="showToast('Fitur komentar (prototipe)')">💬 ${activity.comments}</button>
                        <button onclick="showToast('Membagikan aktivitas')">↗️ Share</button>
                    </div>
                    <div class="comment-preview">
                        <div><span style="font-weight:bold;">Budi:</span> "Mantap pace-nya! 🔥"</div>
                    </div>
                </div>
            `;
            
            // Initialize map for each friend activity
            if (typeof L !== 'undefined') {
                setTimeout(() => {
                    const mapDiv = document.getElementById(`map-friend-${index}`);
                    if (mapDiv) {
                        const map = L.map(mapDiv).setView([-6.2000 + (index * 0.01), 106.8166], 14);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                        L.polyline([[-6.208, 106.808], [-6.200, 106.8166], [-6.192, 106.825]], { color: '#FC4C02', weight: 4 }).addTo(map);
                    }
                }, 100);
            }
        });
    }
}

// Render Laporan (laporan.html)
function renderLaporan() {
    const stats = getTotalStatistics();
    const summaryContainer = document.getElementById('summaryStats');
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <div class="stat-card-green"><div class="stat-value">${stats.totalAktivitas}</div><div class="stat-label">Total Aktivitas</div></div>
            <div class="stat-card-green"><div class="stat-value">${stats.totalDurasi} mnt</div><div class="stat-label">Total Durasi</div></div>
            <div class="stat-card-green"><div class="stat-value">${stats.totalJarak} km</div><div class="stat-label">Total Jarak</div></div>
        `;
    }
    
    const tableBody = document.getElementById('aktivitasTableBody');
    if (tableBody) {
        const activities = getActivities();
        tableBody.innerHTML = '';
        activities.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).forEach(activity => {
            tableBody.innerHTML += `
                <tr>
                    <td>${formatDate(activity.tanggal)}</td>
                    <td>${activity.olahraga} ${activity.isPosted ? '<span class="badge-posted">Sudah posting</span>' : ''}</td>
                    <td>${activity.durasi} menit</td>
                    <td>${activity.jarak || 0} km</td>
                    <td>${activity.isPosted ? '<span style="color:#4CAF50;">Diposting</span>' : '<span style="color:#888;">Belum diposting</span>'}</td>
                    <td>
                        <button class="btn-danger" onclick="handleDeleteActivity('${activity.id}')">Hapus</button>
                        ${!activity.isPosted ? `<button class="btn-success" onclick="handlePostActivity('${activity.id}')">Posting</button>` : ''}
                    </td>
                </tr>
            `;
        });
    }
}

// Handle delete activity
function handleDeleteActivity(id) {
    if (confirm('Yakin hapus aktivitas ini?')) {
        deleteActivity(id);
        renderLaporan();
        if (document.getElementById('weeklyChart')) renderDashboard();
        if (document.getElementById('postedActivitiesContainer')) renderBeranda();
        showToast('Aktivitas berhasil dihapus');
    }
}

// Handle post activity
function handlePostActivity(id) {
    postActivity(id);
    renderLaporan();
    if (document.getElementById('postedActivitiesContainer')) renderBeranda();
    showToast('Aktivitas berhasil diposting ke beranda!');
}

// Render Fasilitas
function renderFasilitas() {
    const fasilitasContainer = document.getElementById('fasilitasList');
    const ruteContainer = document.getElementById('ruteList');
    
    if (fasilitasContainer) {
        fasilitasContainer.innerHTML = '';
        fasilitasData.forEach(item => {
            fasilitasContainer.innerHTML += `
                <div class="list-item" data-kategori="${item.kategori}">
                    <div class="item-icon">${item.nama.substring(0, 2)}</div>
                    <div class="item-text">
                        <div class="item-title">${item.nama}</div>
                        <div class="item-desc">📍 ${item.jarak} dari lokasi Anda</div>
                    </div>
                    <button class="btn-simpan" onclick="showToast('✅ ${item.nama} dipilih')">Pilih</button>
                </div>
            `;
        });
    }
    
    if (ruteContainer) {
        ruteContainer.innerHTML = '';
        ruteData.forEach(rute => {
            ruteContainer.innerHTML += `
                <div class="list-item">
                    <div class="item-icon">🗺️</div>
                    <div class="item-text">
                        <div class="item-title">${rute.nama}</div>
                        <div class="item-desc">📍 ${rute.jarakDariUser} dari lokasi Anda · ${rute.users}</div>
                    </div>
                    <button class="btn-simpan" onclick="showToast('✅ Rute ${rute.nama} disimpan ke favorit!')">Simpan</button>
                </div>
            `;
        });
    }
}

// Render Profile
function renderProfile() {
    const stats = getLifetimeStats();
    const totalDistanceElem = document.getElementById('totalDistanceLifetime');
    const totalHoursElem = document.getElementById('totalHoursLifetime');
    const totalActivitiesElem = document.getElementById('totalActivitiesLifetime');
    
    if (totalDistanceElem) totalDistanceElem.textContent = stats.totalJarak;
    if (totalHoursElem) totalHoursElem.textContent = stats.totalJam;
    if (totalActivitiesElem) totalActivitiesElem.textContent = stats.totalAktivitas;
}

// Render Peta (with Leaflet)
function renderPeta() {
    if (typeof L !== 'undefined') {
        const map = L.map('mainMap').setView([-6.2243, 106.8427], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        const locations = [
            { name: "🏃 GBK Running Track", lat: -6.2183, lng: 106.8022, type: "Lari" },
            { name: "🎾 Padel Court SCBD", lat: -6.2248, lng: 106.8115, type: "Padel" },
            { name: "🌳 Taman Menteng", lat: -6.1963, lng: 106.8322, type: "Umum" },
            { name: "🚴 Sirkuit Senayan", lat: -6.2225, lng: 106.7995, type: "Bersepeda" }
        ];
        
        locations.forEach(loc => {
            L.marker([loc.lat, loc.lng])
                .addTo(map)
                .bindPopup(`<b>${loc.name}</b><br>Kategori: ${loc.type}`);
        });
    }
    
    const routeContainer = document.getElementById('routeList');
    if (routeContainer) {
        routeContainer.innerHTML = '';
        ruteData.forEach(rute => {
            routeContainer.innerHTML += `
                <li>
                    <div>
                        <div class="route-name">${rute.nama}</div>
                        <div class="route-rating">${rute.rating}</div>
                        <div style="font-size:11px; color:#888;">${rute.jarak} · ${rute.jarakDariUser} dari Anda</div>
                    </div>
                    <button class="popular-badge" onclick="showToast('Rute ${rute.nama} disimpan!')">Simpan</button>
                </li>
            `;
        });
    }
}

// ============ ACTIVITY FORM ============
function initActivityForm() {
    const form = document.getElementById('aktivitasForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const olahraga = document.getElementById('olahraga').value;
            const durasi = parseInt(document.getElementById('durasi').value);
            const jarak = parseFloat(document.getElementById('jarak').value) || 0;
            
            if (!olahraga || !durasi) {
                showToast('Mohon isi semua field yang diperlukan');
                return;
            }
            
            const newActivity = { olahraga, durasi, jarak };
            addActivity(newActivity);
            
            showToast('✅ Aktivitas berhasil disimpan!');
            form.reset();
            
            // Redirect to laporan page after 1 second
            setTimeout(() => {
                window.location.href = 'laporan.html';
            }, 1000);
        });
    }
}

// ============ ACCESSIBILITY ============
function initAccessibility() {
    // High Contrast Toggle
    const hcToggle = document.getElementById('highContrastToggle');
    if (hcToggle) {
        hcToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            hcToggle.classList.toggle('active');
            showToast(document.body.classList.contains('high-contrast') ? 'Mode Kontras Tinggi DIaktifkan' : 'Mode Kontras Tinggi DINONAKTIFkan');
            localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
        });
    }
    
    // Dark Mode Toggle
    const dmToggle = document.getElementById('darkModeToggle');
    if (dmToggle) {
        dmToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            dmToggle.classList.toggle('active');
            showToast(document.body.classList.contains('dark-mode') ? 'Mode Gelap DIaktifkan' : 'Mode Gelap DINONAKTIFkan');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
    }
    
    // Font Size Slider
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('change', (e) => {
            const value = e.target.value;
            document.body.style.fontSize = value + 'px';
            showToast(`Ukuran teks diubah menjadi ${value}px`);
            localStorage.setItem('fontSize', value);
        });
    }
    
    // Load saved settings
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
        if (hcToggle) hcToggle.classList.add('active');
    }
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        if (dmToggle) dmToggle.classList.add('active');
    }
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize && fontSizeSlider) {
        document.body.style.fontSize = savedFontSize + 'px';
        fontSizeSlider.value = savedFontSize;
    }
}

// ============ BUTTON HANDLERS ============
function initButtons() {
    // Posting baru button
    const btnPosting = document.getElementById('btnPostingBaru');
    if (btnPosting) {
        btnPosting.addEventListener('click', () => {
            window.location.href = 'aktivitas.html';
        });
    }
    
    // Upload foto button
    const btnUpload = document.getElementById('btnUploadFoto');
    if (btnUpload) {
        btnUpload.addEventListener('click', () => {
            showToast('Fitur upload foto (prototipe) - Upload foto lari Anda! 📸');
        });
    }
    
    // Mulai rekam button
    const btnRekam = document.getElementById('mulaiRekam');
    if (btnRekam) {
        btnRekam.addEventListener('click', () => {
            window.location.href = 'aktivitas.html';
        });
    }
    
    // Follow buttons
    document.querySelectorAll('.follow-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = btn.dataset.name;
            showToast(`Mengikuti ${name}`);
            btn.textContent = '✓ Mengikuti';
            btn.disabled = true;
        });
    });
    
    // Edit profile button
    const editProfile = document.getElementById('editProfileBtn');
    if (editProfile) {
        editProfile.addEventListener('click', () => {
            showToast('Fitur Edit Profil (Prototipe)');
        });
    }
    
    // Hubungkan wearable button
    const hubungkanBtn = document.getElementById('hubungkanWearableBtn');
    if (hubungkanBtn) {
        hubungkanBtn.addEventListener('click', () => {
            showToast('Fitur Hubungkan Wearable (Prototipe)');
        });
    }
    
    // Buat rute button
    const btnBuatRute = document.getElementById('btnBuatRute');
    if (btnBuatRute) {
        btnBuatRute.addEventListener('click', () => {
            showToast('Fitur Buat Rute Baru (Prototipe)');
        });
    }
    
    // Apply filter buttons
    const applyFilter = document.getElementById('applyFilterBtn');
    if (applyFilter) {
        applyFilter.addEventListener('click', () => {
            showToast('Filter diterapkan (prototipe)');
        });
    }
    
    const applySportFilter = document.getElementById('applySportFilterBtn');
    if (applySportFilter) {
        applySportFilter.addEventListener('click', () => {
            showToast('Filter olahraga diterapkan (prototipe)');
        });
    }
    
    // Period dropdown
    const periodDropdown = document.getElementById('periodDropdown');
    if (periodDropdown) {
        periodDropdown.addEventListener('change', (e) => {
            showToast(`Periode diubah menjadi: ${e.target.options[e.target.selectedIndex].text}`);
        });
    }
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we're on and render accordingly
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    
    initActivityForm();
    initAccessibility();
    initButtons();
    
    if (filename === 'index.html' || filename === '') {
        renderBeranda();
    } else if (filename === 'dashboard.html') {
        renderDashboard();
    } else if (filename === 'laporan.html') {
        renderLaporan();
    } else if (filename === 'fasilitas.html') {
        renderFasilitas();
    } else if (filename === 'profile.html') {
        renderProfile();
    } else if (filename === 'peta.html') {
        renderPeta();
    }
    
    // Make functions global for onclick handlers
    window.showToast = showToast;
    window.handleDeleteActivity = handleDeleteActivity;
    window.handlePostActivity = handlePostActivity;
});
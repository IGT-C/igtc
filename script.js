// --- FUNGSI UTAMA UNTUK MENGAMBIL DATA ---
function updateData() {
    // Path akan otomatis mengikuti <base href="/igtc/">
    fetch('standings.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Logika hanya berjalan jika elemen ada di halaman saat ini
            if (document.getElementById('driver-standings-body')) {
                renderStandings(data); // Fungsi untuk index.html
            }
            if (document.getElementById('pro-roster')) {
                renderRoster(data.roster); // Fungsi untuk roster.html
            }
        })
        .catch(error => {
            console.error('Failed to load standings data:', error);
            // Handling error untuk Standings
            const driverStandingsBody = document.getElementById('driver-standings-body');
            if (driverStandingsBody) driverStandingsBody.innerHTML = '<tr><td colspan="4">Failed to load driver standings.</td></tr>';
            const teamStandingsBody = document.getElementById('team-standings-body');
            if (teamStandingsBody) teamStandingsBody.innerHTML = '<tr><td colspan="4">Failed to load team standings.</td></tr>';
            // Handling error untuk Roster
            const proContainer = document.getElementById('pro-roster');
            if (proContainer) proContainer.innerHTML = '<p class="placeholder-note">Failed to load PRO roster data.</p>';
            const proAmContainer = document.getElementById('pro-am-roster');
            if (proAmContainer) proAmContainer.innerHTML = '<p class="placeholder-note">Failed to load PRO-AM roster data.</p>';
        });
}


// --- 1. STANDINGS RENDERING (Untuk index.html) ---

function renderStandings(data) {
    // Render Driver Standings
    const driverStandingsBody = document.getElementById('driver-standings-body');
    const sortedDrivers = data.drivers.sort((a, b) => b.points - a.points);
    
    driverStandingsBody.innerHTML = '';
    sortedDrivers.forEach((driver, index) => {
        const row = driverStandingsBody.insertRow();
        row.innerHTML = `
            <td class="pos-col">${index + 1}</td>
            <td class="driver-col">
                <div class="driver-info">
                    <span class="nationality-flag">${driver.nationality}</span>
                    <strong>${driver.name.toUpperCase()}</strong>
                </div>
            </td>
            <td class="team-col">${driver.team}</td>
            <td class="pts-col">${driver.points}</td>
        `;
    });

    // Render Team Standings
    const teamStandingsBody = document.getElementById('team-standings-body');
    const sortedTeams = data.teams.sort((a, b) => b.points - a.points);

    teamStandingsBody.innerHTML = '';
    sortedTeams.forEach((team, index) => {
        const row = teamStandingsBody.insertRow();
        row.innerHTML = `
            <td class="pos-col">${index + 1}</td>
            <td class="team-col"><strong>${team.name.toUpperCase()}</strong></td>
            <td class="car-col">${team.car}</td>
            <td class="pts-col">${team.points}</td>
        `;
    });
}


// --- 2. ROSTER RENDERING (Untuk roster.html) ---

// KARTU BARU: Tanpa foto pembalap, diganti Bendera
function createDriverCard(driver) {
    const driverCard = document.createElement('div');
    driverCard.className = 'driver-card';
    
    driverCard.innerHTML = `
        <div class="driver-header">
            <span class="driver-number">#${driver.number}</span>
            <span class="nationality-flag-large">${driver.nationality}</span>
        </div>
        <div class="driver-details">
            <p class="driver-name">${driver.name.toUpperCase()}</p>
            <p class="driver-team">${driver.team}</p>
            <p class="driver-car">Car: ${driver.car}</p>
            <p class="driver-class">Class: <strong>${driver.class}</strong></p>
        </div>
    `;
    return driverCard;
}

function renderRoster(rosterData) {
    const proContainer = document.getElementById('pro-roster');
    const proAmContainer = document.getElementById('pro-am-roster');
    
    if (!proContainer || !proAmContainer) return; 

    proContainer.innerHTML = '';
    proAmContainer.innerHTML = '';
    
    const proDrivers = rosterData.filter(driver => driver.class === 'PRO');
    const proAmDrivers = rosterData.filter(driver => driver.class === 'PRO-AM');

    // Render PRO Drivers
    if (proDrivers.length > 0) {
        proDrivers.forEach(driver => {
            proContainer.appendChild(createDriverCard(driver));
        });
    } else {
        proContainer.innerHTML = '<p class="placeholder-note">No PRO drivers currently registered.</p>';
    }

    // Render PRO-AM Drivers
    if (proAmDrivers.length > 0) {
        proAmDrivers.forEach(driver => {
            proAmContainer.appendChild(createDriverCard(driver));
        });
    } else {
        proAmContainer.innerHTML = '<p class="placeholder-note">No PRO-AM drivers currently registered.</p>';
    }
}


// --- FUNGSI NAVIGASI MOBILE & INISIALISASI ---

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (toggleButton && navMenu) {
        toggleButton.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            toggleButton.classList.toggle('active');
        });
    }
    
    // Panggil fungsi utama untuk memuat data di halaman yang relevan
    updateData(); 
});

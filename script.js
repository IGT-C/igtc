// script.js

// --- FUNGSI UTAMA UNTUK MENGAMBIL DATA ---
function updateData() {
    // Menggunakan path mutlak untuk keamanan dan konsistensi
    fetch('/igtc/standings.json') 
        .then(response => {
            if (!response.ok) {
                // Memberikan pesan error yang jelas jika fetch gagal
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Logika Standings (untuk standings.html)
            if (document.getElementById('driver-standings-body')) {
                renderStandings(data); 
            }
            // Logika Roster (untuk roster.html)
            if (document.getElementById('team-roster-container')) {
                renderTeamRoster(data.roster); 
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
            const container = document.getElementById('team-roster-container');
            const loadingMessage = document.getElementById('loading-roster-message');
            if (loadingMessage) loadingMessage.remove(); 
            if (container) container.innerHTML = '<p class="placeholder-note">Failed to load Roster data. Please check standings.json path.</p>';
        });
}


// --- 1. STANDINGS RENDERING (Untuk standings.html) ---

function renderStandings(data) {
    // Render Driver Standings
    const driverStandingsBody = document.getElementById('driver-standings-body');
    if (driverStandingsBody) {
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
    }

    // Render Team Standings
    const teamStandingsBody = document.getElementById('team-standings-body');
    if (teamStandingsBody) {
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
}


// --- 2. ROSTER RENDERING (FUNGSI BARU: Per Tim, Untuk roster.html) ---

function createDriverCard(driver) {
    const driverCard = document.createElement('div');
    driverCard.className = 'driver-card';
    
    driverCard.innerHTML = `
        <div class="driver-header">
            <span class="driver-number red-text">#${driver.number}</span>
            <span class="nationality-flag-large">${driver.nationality}</span>
        </div>
        <div class="driver-details">
            <p class="driver-name">${driver.name.toUpperCase()}</p>
            <p class="driver-team-car">${driver.car}</p>
            <p class="driver-class">Class: <strong>${driver.class}</strong></p>
        </div>
    `;
    return driverCard;
}

function renderTeamRoster(rosterData) {
    const container = document.getElementById('team-roster-container');
    const loadingMessage = document.getElementById('loading-roster-message');
    
    if (loadingMessage) loadingMessage.remove(); 
    if (!container) return; 

    // 1. KELOMPOKKAN DRIVER BERDASARKAN TIM (Grouping Logic)
    const teams = rosterData.reduce((acc, driver) => {
        if (!acc[driver.team]) {
            acc[driver.team] = {
                name: driver.team,
                car: driver.car, 
                drivers: []
            };
        }
        acc[driver.team].drivers.push(driver);
        return acc;
    }, {});
    
    container.innerHTML = ''; // Kosongkan container utama
    
    // 2. RENDER SETIAP GRUP TIM
    Object.values(teams).forEach(team => {
        const teamGroup = document.createElement('div');
        teamGroup.className = 'team-group';
        
        // Header Tim dan Info
        teamGroup.innerHTML = `
            <h2>${team.name.toUpperCase()}</h2>
            <p class="team-info">Car: <strong class="red-text">${team.car}</strong></p>
            <div class="team-driver-grid"></div>
        `;

        const driverGrid = teamGroup.querySelector('.team-driver-grid');
        
        // Kartu Driver di dalam Tim
        team.drivers.forEach(driver => {
            driverGrid.appendChild(createDriverCard(driver));
        });

        container.appendChild(teamGroup);
    });
}


// --- FUNGSI NAVIGASI MOBILE & INISIALISASI ---

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Fungsionalitas Menu Toggle (Menu Hamburger)
    if (toggleButton && navMenu) {
        toggleButton.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            toggleButton.classList.toggle('active');
        });
    }
    
    // Panggil fungsi utama untuk memuat data di halaman yang relevan
    updateData(); 
});

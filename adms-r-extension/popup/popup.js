document.addEventListener('DOMContentLoaded', async () => {
    const authView = document.getElementById('auth-view');
    const unauthView = document.getElementById('unauth-view');
    const btnLogin = document.getElementById('btn-login');

    // Check auth status
    chrome.runtime.sendMessage({ type: "CHECK_AUTH" }, (response) => {
        if (response && response.isAuthenticated) {
            unauthView.classList.add('hidden');
            authView.classList.remove('hidden');
            renderChart();
            loadMockData(); // In real app, this would fetch from storage/API
        } else {
            unauthView.classList.remove('hidden');
            authView.classList.add('hidden');
        }
    });

    btnLogin.addEventListener('click', () => {
        // In real app: open tab to ADMS-R login page which sets the token in storage
        chrome.tabs.create({ url: 'http://localhost:4200' });
    });

    function loadMockData() {
        // Just for the visual prototype 
        document.getElementById('val-time').innerText = '4h 12m';
        document.getElementById('val-clicks').innerText = '1,245';
    }

    function renderChart() {
        const ctx = document.getElementById('weeklyChart').getContext('2d');

        // Monochrome styling configuration
        Chart.defaults.color = '#888';
        Chart.defaults.font.family = "'Inter', sans-serif";

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                datasets: [{
                    label: 'Hours Online',
                    data: [2.5, 3.8, 1.2, 4.2, 5.0, 1.5, 0.5],
                    backgroundColor: '#ffffff',
                    borderRadius: 4,
                    barThickness: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#111',
                        titleColor: '#fff',
                        bodyColor: '#aaa',
                        borderColor: '#333',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        border: { display: false },
                        ticks: { font: { size: 10 }, stepSize: 2 }
                    }
                }
            }
        });
    }
});

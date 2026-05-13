// Corruption Perceptions Index (CPI) data for South Africa from Transparency International
const cpiData = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [{
        label: 'CPI Score (0-100)',
        data: [43, 44, 44, 44, 43, 41, 41],
        borderColor: 'rgba(220, 53, 69, 1)',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        tension: 0.4,
        fill: true
    }]
};

// Create the chart
const ctx = document.getElementById('cpiChart').getContext('2d');
const cpiChart = new Chart(ctx, {
    type: 'line',
    data: cpiData,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'South Africa Corruption Perceptions Index (CPI) 2018-2024'
            },
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 35,
                max: 50,
                title: {
                    display: true,
                    text: 'CPI Score (Higher = Less Corrupt)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Year'
                }
            }
        },
        elements: {
            point: {
                radius: 6,
                hoverRadius: 8
            }
        }
    }
});

// Update indicators with 2024 data
document.getElementById('current-cpi').textContent = '41/100';
document.getElementById('rank').textContent = '81st out of 182 countries';
document.getElementById('trend').textContent = 'Stable (no change from 2023)';
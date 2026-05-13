// Sample data for Corruption Perceptions Index (CPI) for South Africa
const cpiData = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [{
        label: 'CPI Score (0-100)',
        data: [43, 44, 44, 44, 43, 41],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
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
                text: 'South Africa Corruption Perceptions Index Over Time'
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 35,
                max: 50
            }
        }
    }
});

// Update indicators
document.getElementById('current-cpi').textContent = '41';
document.getElementById('rank').textContent = '72nd out of 180';
document.getElementById('trend').textContent = 'Declining';
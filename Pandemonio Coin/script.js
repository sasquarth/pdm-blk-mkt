// Function to format a date as DD/MM/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


async function updateCoinValue() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const values = data.data.map(item => item.value);
        const dates = data.data.map(item => formatDate(item.date));

        const currentValue = values[values.length - 1];
        document.getElementById('current-value').textContent = `$${currentValue.toFixed(2)}`;

        // Update the chart with formatted dates as labels
        updateChart(values, dates);
    } catch (error) {
        console.error('Error fetching or updating the data:', error);
    }
}

// Function to update the chart with new data
function updateChart(values, dates) {
    const ctx = document.getElementById('coinChart').getContext('2d');

    // Destroy existing chart instance if it exists and is a Chart object
    if (window.coinChart instanceof Chart) {
        window.coinChart.destroy();
    }

    // Create a gradient for the chart fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(75, 192, 192, 0.4)');
    gradient.addColorStop(1, 'rgba(75, 192, 192, 0)');

    // Create a new chart instance
    window.coinChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates, // Use formatted dates as labels
            datasets: [{
                label: 'Coin Value',
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                backgroundColor: gradient,
                tension: 0.1 // Smooth curve
            }]
        },
        options: {
            scales: {
                x: {
                    display: false // Hide X-axis labels
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: '($)'
                    },
                    ticks: {
                        beginAtZero: false,
                        color: '#fff'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Hide the legend for a cleaner look
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const date = dates[tooltipItem.dataIndex];
                            const value = tooltipItem.raw;
                            return [`Date: ${date}`, `Value: $${value.toFixed(2)}`];
                        }
                    }
                }
            }
        }
    });
}

// Initial update on page load
updateCoinValue();

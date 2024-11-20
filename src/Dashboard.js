import React from 'react';
import { Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Chart options
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to resize dynamically
    plugins: {
        legend: {
        position: 'top',
        },
        tooltip: {
        callbacks: {
            label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
            },
        },
        },
    },
    scales: {
        x: {
        beginAtZero: true,
        },
        y: {
        beginAtZero: true,
        },
    },
    };

    // Example chart data
    const chartData = {
    labels: ['SLA Met', 'SLA Not Met'],
    datasets: [
        {
        label: 'SLA Met',
        data: [10],
        backgroundColor: '#4caf50',
        },
        {
        label: 'SLA Not Met',
        data: [5],
        backgroundColor: '#f44336',
        },
    ],
    };

    // Responsive chart container component

    const Dashboard = () => {
        return (
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap', // Allows stacking on smaller screens
                    gap: '10px', // Adds spacing between charts
                    justifyContent: 'space-between', // Aligns items evenly
                    alignItems: 'stretch', // Ensures charts have equal height
                    width: '100%' // Ensures the container spans the full width
                }}
            >
                {/* Chart Block 1 */}
                <div
                    style={{
                        flex: '1 1 48%', // Takes up 48% of the width on larger screens
                        minWidth: '300px', // Ensures the chart doesn't shrink too much
                        padding: '20px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                    }}
                >
                    <Typography variant="h5" gutterBottom>
                        Incidents SLA Performance
                    </Typography>
                    <div 
                        style={{ 
                            height: '300px', 
                            width: '100%' 
                        }}>

                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>
    
                {/* Chart Block 2 */}
                <div
                    style={{
                        flex: '1 1 48%', // Takes up 48% of the width on larger screens
                        minWidth: '300px', // Ensures the chart doesn't shrink too much
                        padding: '20px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                    }}
                >
                    <Typography variant="h5" gutterBottom>
                        Another Chart
                    </Typography>

                    <div style={{ 
                        height: '300px', 
                        width: '100%' 
                        }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>
                
            </div>
        );
    };
    

export default Dashboard;
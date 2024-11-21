import React, { useState } from 'react';
import { Grid, Grid2, Card, CardContent, Typography, Button, ButtonGroup } from '@mui/material';
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

// Sample data for incidents (this can later be fetched from an API)
const sampleIncidents = [
    { id: 1, status: 'Open', sla: 'Met', date: new Date('2024-11-14') },
    { id: 2, status: 'Resolved', sla: 'Not Met', date: new Date('2024-11-13') },
    { id: 3, status: 'In Progress', sla: 'Met', date: new Date('2024-11-12') },
    { id: 4, status: 'Closed', sla: 'Met', date: new Date('2024-11-08') },
    { id: 5, status: 'On Hold', sla: 'Not Met', date: new Date('2024-10-20') },
    { id: 6, status: 'Open', sla: 'Met', date: new Date('2023-12-31') },
];

// Utility function to filter incidents based on the selected filter
const filterIncidents = (incidents, filter) => {
    const now = new Date();
    switch (filter) {
        case 'Today':
            return incidents.filter(
                incident => incident.date.toDateString() === now.toDateString()
            ); 
        case '7 Days':
            const last7Days = new Date(now);
            last7Days.setDate(now.getDate() - 7);
            return incidents.filter(
                incident => incident.date >= last7Days
            );
        case 'Year':
            const lastYear = new Date(now);
            lastYear.setFullYear(now.getFullYear() - 1);
            return incidents.filter(
                incident => incident.date >= lastYear
            );
        default:
            return incidents;
    }
}

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

const Incidents = () => {
    const [filter, setFilter] = useState('All');
    const filteredIncidents = filterIncidents(sampleIncidents, filter);

    const dashboardItems = [
        { label: 'Total Incidents', value: filteredIncidents.length, color: '#2196f3' },
        { label: 'Open Incidents', value: filteredIncidents.filter(incident => incident.status === 'Open').length, color: '#f44336' },
        { label: 'In Progress', value: filteredIncidents.filter(incident => incident.status === 'In Progress').length, color: '#ff9800' },
        { label: 'On Hold', value: filteredIncidents.filter(incident => incident.status === 'On Hold').length, color: '#9c27b0' },
        { label: 'Resolved', value: filteredIncidents.filter(incident => incident.status === 'Resolved').length, color: '#4caf50' },
        { label: 'Closed', value: filteredIncidents.filter(incident => incident.status === 'Closed').length, color: '#607d8b' },
    ];

    // Chart Data Preparation
    const slaCounts = {
        Met: filteredIncidents.filter((i) => i.sla === 'Met').length,
        NotMet: filteredIncidents.filter((i) => i.sla === 'Not Met').length,
    };

    const chartData = {
        labels: ['SLA Met', 'SLA Not Met'], // Labels for each bar group
        datasets: [
            {
                label: 'Incidents',
                data: [slaCounts.Met, slaCounts.NotMet], // One value per label
                backgroundColor: ['#4caf50', '#f44336'],
            },
        ],
    };
    

    return (
        <div style={{ padding: '20px' }}>
            
            <Typography variant="h4" gutterBottom>
                Incidents Page
            </Typography>

            <ButtonGroup style={{ 
                marginBottom: '20px', 
                marginRight: '10px'
                }}>
                {['All', 'Today', '7 Days', 'Year'].map(label => (
                    <Button 
                        key={label}
                        variant={filter === label ? 'contained' : 'outlined'}
                        onClick={() => setFilter(label)}
                        sx={{
                            fontSize: '10px', // Adjust font size here
                        }}
                    >
                        {label}
                    </Button>
                ))}
            </ButtonGroup>

            <Grid
                container 
                // spacing={3}
                style={{ 
                    width: '100%', 
                    margin: '0 auto', // Centers the grid container
                }}
                >
                {dashboardItems.map((item, index) => (
                    <Grid
                        item 
                        xs={12} 
                        sm={6} 
                        md={4} 
                        lg={2} 
                        key={index}
                        style={{ display: 'flex' }} // Ensures the grid item stretches
                    >   
                    <Card 
                        style={{ 
                            backgroundColor: item.color,
                            color: 'white',
                            textAlign: 'center',
                            padding: '5px',
                            borderRadius: '8px',
                            marginRight: '10px',
                            marginTop: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            // height: '100%',
                            flex: 1, // Ensures the card stretches
                            }}>
                            <CardContent>
                                <Typography variant="h6">{item.label}</Typography>
                                <Typography variant="h4">{item.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap', // Allows stacking on smaller screens
                gap: '10px', // Adds spacing between charts
                justifyContent: 'space-between', // Aligns items evenly
                alignItems: 'stretch', // Ensures charts have equal height
                width: '100%', // Ensures the container spans the full width
                marginTop: '20px',
            }}>


                <div style={{ 
                    flex: '1 1 48%', // Takes up 48% of the width on larger screens
                    minWidth: '150px', // Ensures the chart doesn't shrink too much
                    padding: '20px',
                    // border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    marginRight: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}>

                    <Typography variant="h5" gutterBottom>
                        Incidents SLA Performance
                    </Typography>
                        
                    <div style={{ 
                            height: '260px', 
                            width: '100%', 
                    }}>
                    <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div style={{ 
                    flex: '1 1 48%', // Takes up 48% of the width on larger screens
                    minWidth: '150px', // Ensures the chart doesn't shrink too much
                    padding: '20px',
                    // border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    marginRight: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}>

                    <Typography variant="h5" gutterBottom>
                        Another Chart
                    </Typography>
                            
                    <div style={{ 
                        height: '260px', 
                        width: '100%' 
                    }}>
                    <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

            </div>   
        
        </div>
    );
};

export default Incidents;

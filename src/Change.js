import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { Button, ButtonGroup, Typography, TextField, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// Generate random incidents
const generateRandomIncidents = (count) => {
    const incidents = [];
    const slaOptions = ['Met', 'NotMet'];

    for (let i = 1; i <= count; i++) {
        const randomDays = Math.floor(Math.random() * 30); // Random date within the past 30 days
        const randomSLA = slaOptions[Math.floor(Math.random() * slaOptions.length)];
        incidents.push({
            id: i,
            sla: randomSLA,
            date: subDays(new Date(), randomDays),
        });
    }

    return incidents;
};
const sampleIncidents = generateRandomIncidents(50);
console.log(sampleIncidents);

// Group incidents by date
const groupIncidentsByDate = (incidents) => {
    const groupedData = {};
    incidents.forEach((incident) => {
        const dateKey = format(incident.date, 'yyyy-MM-dd');
        if (!groupedData[dateKey]) {
            groupedData[dateKey] = { Met: 0, NotMet: 0 };
        }
        groupedData[dateKey][incident.sla]++;
    });
    return groupedData;
};

// Prepare chart data
const prepareChartData = (filteredIncidents, fromDate, toDate) => {
    const groupedData = groupIncidentsByDate(filteredIncidents);

    // Create x-axis labels within the selected range
    const dateRange = [];
    let currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
        dateRange.push(format(currentDate, 'yyyy-MM-dd'));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Populate data for each SLA status
    const metCounts = dateRange.map((date) => groupedData[date]?.Met || 0);
    const notMetCounts = dateRange.map((date) => groupedData[date]?.NotMet || 0);

    return {
        labels: dateRange,
        datasets: [
            {
                label: 'SLA Met',
                data: metCounts,
                borderColor: '#2ecc71', // Modern emerald green
                backgroundColor: '#A3E4D7', // Soft light aqua green
                fill: false,
                pointRadius: 5,
                tension: 0.4,
            },
            {
                label: 'SLA Not Met',
                data: notMetCounts,
                borderColor: '#e74c3c', // Modern soft red
                backgroundColor: '#F5B7B1', // Soft light pink
                fill: false,
                pointRadius: 5,
                tension: 0.4,
            },
        ],
    };
};

const SLAChart = () => {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [tempFromDate, setTempFromDate] = useState(null);
    const [tempToDate, setTempToDate] = useState(null);
    const [filter, setFilter] = useState('Today');

    const handleFilter = (filter) => {
        setFilter(filter);
        const today = new Date();
        switch (filter) {
            case 'Today':
                setFromDate(today);
                setToDate(today);
                break;
            case '7 Days':
                setFromDate(subDays(today, 7));
                setToDate(today);
                break;
            case 'Custom':
                break; // Handle custom dates separately
            default:
                break;
        }
    };

    const handleApplyCustomFilter = () => {
        if (tempFromDate && tempToDate) {
            setFromDate(tempFromDate);
            setToDate(tempToDate);
            setFilter('Custom');
        } else {
            alert('Please select both From and To dates.');
        }
    };

    const filteredIncidents = sampleIncidents.filter(
        (incident) => incident.date >= fromDate && incident.date <= toDate
    );
    console.log("filtered", filteredIncidents);

    const chartData = prepareChartData(filteredIncidents, fromDate, toDate);
    console.log("chart", chartData);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Incident Count',
                },
            },
        },
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
                SLA Trends
            </Typography>

            <ButtonGroup>
                <Button
                    variant={filter === 'Today' ? 'contained' : 'outlined'}
                    onClick={() => handleFilter('Today')}
                >
                    Today
                </Button>
                <Button
                    variant={filter === '7 Days' ? 'contained' : 'outlined'}
                    onClick={() => handleFilter('7 Days')}
                >
                    Last 7 Days
                </Button>
                <Button
                    variant={filter === 'Custom' ? 'contained' : 'outlined'}
                    onClick={() => handleFilter('Custom')}
                >
                    Custom
                </Button>
            </ButtonGroup>

            {filter === 'Custom' && (
                <Box mt={2} display="flex" alignItems="center">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="From Date"
                            value={tempFromDate}
                            onChange={(newValue) => setTempFromDate(newValue)}
                            renderInput={(params) => <TextField {...params} sx={{ marginRight: 2 }} />}
                        />
                        <DatePicker
                            label="To Date"
                            value={tempToDate}
                            onChange={(newValue) => setTempToDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyCustomFilter}
                        sx={{ marginLeft: 2 }}
                    >
                        Apply
                    </Button>
                </Box>
            )}

            <div style={{ height: '300px', marginTop: '20px' }}>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default SLAChart;

import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {    
        Grid, 
        Grid2, 
        Card, 
        CardContent, 
        Typography, 
        Button, 
        ButtonGroup,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow,
        Paper,
        TablePagination,
        TextField,
        Divider,
        IconButton,
        Drawer,
        Menu,
        MenuItem
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
} from 'chart.js';

// Icons for the dashboard items
import AssignmentIcon from '@mui/icons-material/Assignment';
import InboxIcon from '@mui/icons-material/Inbox';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import { format, subDays } from 'date-fns';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ca } from 'date-fns/locale';

// Register required Chart.js components
ChartJS.register(LineElement, PointElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);


// Sample data for incidents (this can later be fetched from an API)
// const sampleIncidents = [
//     { id: 1, status: 'Open', sla: 'Met', date: new Date('2024-11-14') },
//     { id: 2, status: 'Resolved', sla: 'NotMet', date: new Date('2024-11-13'), category: 'Software' },
//     { id: 3, status: 'In Progress', sla: 'Met', date: new Date('2024-11-12'), category: 'Hardware' },
//     { id: 4, status: 'Closed', sla: 'Met', date: new Date('2024-11-08'), category: 'Database' },
//     { id: 5, status: 'On Hold', sla: 'NotMet', date: new Date('2024-10-20'), category: 'Hardware' },
//     { id: 6, status: 'Open', sla: 'Met', date: new Date('2023-12-31'), category: 'Hardware' },
//     { id: 7, status: 'Resolved', sla: 'NotMet', date: new Date('2024-11-27'), category: 'Inquiry' },
//     // today
//     { id: 8, status: 'In Progress', sla: 'Met', date: new Date(), category: 'Hardware' },
//     { id: 9, status: 'Closed', sla: 'Met', date: new Date(), category: 'Database' },
//     // past 7 days
//     { id: 10, status: 'On Hold', sla: 'NotMet', date: subDays(new Date(), 7), category: 'Hardware' },
//     { id: 11, status: 'Open', sla: 'Met', date: subDays(new Date(), 7), category: 'Inquiry' },
//     { id: 12, status: 'Resolved', sla: 'NotMet', date: subDays(new Date(), 7), category: 'Inquiry' },
//     { id: 13, status: 'In Progress', sla: 'Met', date: subDays(new Date(), 7), category: 'Hardware' },
//     { id: 14, status: 'Closed', sla: 'Met', date: subDays(new Date(), 7), category: 'Database' },
//     // this month
//     { id: 15, status: 'On Hold', sla: 'NotMet', date: new Date('2024-11-01'), category: 'Hardware' },
//     { id: 16, status: 'Open', sla: 'Met', date: new Date('2024-11-01'), category: 'Inquiry' },
//     { id: 17, status: 'Resolved', sla: 'NotMet', date: new Date('2024-11-01'), category: 'Inquiry' },
//     { id: 18, status: 'In Progress', sla: 'Met', date: new Date('2024-11-01'), category: 'Hardware' },
//     { id: 19, status: 'Closed', sla: 'Met', date: new Date('2024-11-01'), category: 'Database' },
//     // this year
//     { id: 20, status: 'On Hold', sla: 'NotMet', date: new Date('2024-12-09'), category: 'Hardware' },
//     { id: 21, status: 'Open', sla: 'Met', date: new Date('2024-12-05'), category: 'Inquiry' },
//     { id: 22, status: 'Resolved', sla: 'NotMet', date: new Date('2024-12-10'), category: 'Inquiry' },
//     { id: 23, status: 'In Progress', sla: 'Met', date: new Date('2024-12-10'), category: 'Hardware' },
//     { id: 24, status: 'Closed', sla: 'Met', date: new Date('2024-01-01'), category: 'Database' },
// ];

// console.log(sampleIncidents);

// Generate random incidents
const generateRandomIncidents = (count) => {
    const incidents = [];
    const states = ["Open", "In Progress", "Closed", "Unassigned", "On Hold", "Resolved"];
    const categories = ["Database", "Hardware", "Inquiry", "Network", "Software", "Null"];
    const slaOptions = ["Met", "NotMet"];
    const priorities = ["Critical", "High", "Moderate", "Low", "Planning"]; // Added priority levels
    const descriptions = [
        "Network issue",
        "Server crash",
        "UI bug",
        "Database error",
        "API timeout",
        "Feature request",
        "Code optimization",
        "System maintenance",
    ];

    // Function to generate an ID in the format INC0012235
    const generateIncidentID = (index) => {
        const prefix = "INC"; // Fixed prefix
        const paddedIndex = String(index).padStart(7, "0"); // Pad index with 7 digits
        return `${prefix}${paddedIndex}`; // Combine prefix and padded index
    };

    for (let i = 1; i <= count; i++) {
        const isLongAgo = Math.random() < 0.3; // 30% chance for dates more than 30 days in the past

        // Generate random days for the creation date
        const randomDaysCreation = isLongAgo
            ? Math.floor(Math.random() * 30) + 31 // More than 30 days ago
            : Math.floor(Math.random() * 30); // Within the past 30 days
        const creationDate = subDays(new Date(), randomDaysCreation);

        // Ensure opened date is after creation date
        const additionalDaysOpened = Math.floor(Math.random() * 7) + 1; // Opened date at least 1 day after creation date
        const openedDate = subDays(creationDate, -additionalDaysOpened);

        // Ensure lastUpdated is on or after opened date
        const isLastUpdatedMoreThan7Days = Math.random() < 0.5; // 50% chance
        const additionalDaysLastUpdated = isLastUpdatedMoreThan7Days
            ? Math.floor(Math.random() * 7) + 7 // At least 7 days after opened
            : Math.floor(Math.random() * 7); // Within 7 days after opened

        const lastUpdatedDate = subDays(openedDate, -additionalDaysLastUpdated);


        const randomState = states[Math.floor(Math.random() * states.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomSLA = slaOptions[Math.floor(Math.random() * slaOptions.length)];
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)]; // Added priority levels
        const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

            incidents.push({
            id: i,
            number: generateIncidentID(i),
            state: randomState,
            category: randomCategory,
            sla: randomSLA,
            priority: randomPriority, // Added priority levels
            date: creationDate, // Ensure this is always before opened
            lastUpdated: lastUpdatedDate, // Assign lastUpdated after or same as opened
            opened: openedDate, // Ensure this is after creationDate
            shortDescription: randomDescription,
            });
    }
    return incidents;
};


const sampleIncidents = generateRandomIncidents(100);

console.log("sample", sampleIncidents);

const groupIncidentsByMonth = (incidents) => {
    const groupedData = {};
    incidents.forEach((incident) => {
        const monthKey = format(incident.date, 'yyyy-MM'); // Group by year and month
        if (!groupedData[monthKey]) {
            groupedData[monthKey] = { Met: 0, NotMet: 0 };
        }
        groupedData[monthKey][incident.sla]++;
    });
    return groupedData;
};


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
const prepareChartData = (filteredIncidents, fromDate, toDate, isAllFilter) => {
    const now = new Date();
    const currentYearStart = new Date(now.getFullYear(), 0, 1);

    // If "All" filter is applied, restrict to current year
    const incidentsForChart = isAllFilter
        ? filteredIncidents.filter((incident) => incident.date >= currentYearStart)
        : filteredIncidents.filter(
              (incident) => incident.date >= fromDate && incident.date <= toDate
          );

    const groupedData = isAllFilter
        ? groupIncidentsByMonth(incidentsForChart)
        : groupIncidentsByDate(incidentsForChart);

    // Generate x-axis labels based on the filter type
    const labels = isAllFilter
        ? Object.keys(groupedData).sort() // Month keys (e.g., "2024-01", "2024-02")
        : (() => {
              const dateRange = [];
              let currentDate = new Date(fromDate);
              while (currentDate <= toDate) {
                  dateRange.push(format(currentDate, "yyyy-MM-dd"));
                  currentDate.setDate(currentDate.getDate() + 1);
              }
              return dateRange;
          })();

    // Populate data for each SLA state
    const metCounts = labels.map((key) => groupedData[key]?.Met || 0);
    const notMetCounts = labels.map((key) => groupedData[key]?.NotMet || 0);

    // Calculate total counts
    const totalMet = metCounts.reduce((sum, count) => sum + count, 0);
    const totalNotMet = notMetCounts.reduce((sum, count) => sum + count, 0);

    return {
        labels,
        datasets: [
            {
                label: `SLA Met (${totalMet})`, // Add total count to the label
                data: metCounts,
                borderColor: "#2ecc71",
                backgroundColor: "#A3E4D7",
                fill: false,
                pointRadius: 2,
                pointHoverRadius: 3,
                borderWidth: 1,
                tension: 0.2,
            },
            {
                label: `SLA Not Met (${totalNotMet})`, // Add total count to the label
                data: notMetCounts,
                borderColor: "#e74c3c",
                backgroundColor: "#F5B7B1",
                fill: false,
                pointRadius: 2,
                pointHoverRadius: 3,
                borderWidth: 1,
                tension: 0.2,
            },
        ],
    };
};



// Top card filter
// Utility function to filter incidents based on the selected filter
const filterTopCards = (incidents, filter, fromDate, toDate) => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // Start of the current year

    switch (filter) {
        case 'Today':
            return incidents.filter(incident => incident.date.toDateString() === now.toDateString());
        case '7 Days':
            const last7Days = new Date(now);
            last7Days.setDate(now.getDate() - 7);
            return incidents.filter(incident => incident.date >= last7Days);
        case 'Month':
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
            return incidents.filter(incident => incident.date >= startOfMonth);
        case 'Year':
            const lastYear = new Date(now);
            lastYear.setFullYear(now.getFullYear() - 1);
            return incidents.filter(incident => incident.date >= lastYear);
        case 'Custom':
            if (fromDate && toDate) {
                return incidents.filter(
                    incident => incident.date >= fromDate && incident.date <= toDate
                );
            }
            return []; // No filtering if dates are not set
        case 'All':
            default:
                return incidents.filter((incident) => incident.date >= startOfYear);
    }
};

// not in use already
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

// Sla Breach Chart Data
const slaChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to resize dynamically
    plugins: {
        legend: {
            position: 'top', // Position of the legend
            labels: {
                boxWidth: 12, // Adjusts the size of the color boxes
                boxHeight: 12, // Adjusts the height of the color boxes (Chart.js v4+)
                font: {
                    size: 10, // Adjusts the font size of the legend text
                    weight: 'normal', // Adjusts font weight (e.g., 'bold', 'normal')
                },
                padding: 10, // Adjusts spacing around the legend items
                // usePointStyle: true, // Use a circle instead of a square for the legend box
            },
        },
        datalabels: {
            display: false, // Disables data labels inside the chart
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    // Display the label without the total count
                    const datasetLabel = context.dataset.label.split('(')[0].trim(); // Remove total count
                    const value = context.raw; // Get the point value
                    return `${datasetLabel}: ${value}`; // Display only the label and value
                },
            },
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

// not in use
// Incident sample data
// const sampleData = [
//     { number: 1, opened: "2024-11-14", shortDescription: "Issue A", priority: "High", state: "Open", category: "Bug" },
//     { number: 2, opened: "2024-11-13", shortDescription: "Issue B", priority: "Medium", state: "In Progress", category: "Feature" },
//     { number: 3, opened: "2024-11-12", shortDescription: "Issue C", priority: "Low", state: "Resolved", category: "Enhancement" },
//     { number: 4, opened: "2024-11-11", shortDescription: "Issue D", priority: "High", state: "Closed", category: "Bug" },
//     { number: 5, opened: "2024-11-10", shortDescription: "Issue E", priority: "Low", state: "Open", category: "Maintenance" },
//     { number: 6, opened: "2024-11-09", shortDescription: "Issue F", priority: "Medium", state: "In Progress", category: "Bug" },
//     { number: 7, opened: "2024-11-08", shortDescription: "Issue G", priority: "High", state: "Closed", category: "Feature" },
//     { number: 8, opened: "2024-11-07", shortDescription: "Issue H", priority: "Low", state: "Resolved", category: "Enhancement" },
//     { number: 9, opened: "2024-11-06", shortDescription: "Issue I", priority: "Medium", state: "Open", category: "Bug" },
//     { number: 10, opened: "2024-11-05", shortDescription: "Issue J", priority: "High", state: "In Progress", category: "Feature" },
//     { number: 11, opened: "2024-11-04", shortDescription: "Issue K", priority: "Low", state: "Resolved", category: "Bug" },
//     { number: 12, opened: "2024-11-03", shortDescription: "Issue L", priority: "Medium", state: "Closed", category: "Enhancement" },
//     { number: 13, opened: "2024-11-02", shortDescription: "Issue M", priority: "High", state: "Open", category: "Feature" },
//     { number: 14, opened: "2024-11-01", shortDescription: "Issue N", priority: "Low", state: "In Progress", category: "Bug" },
//     { number: 15, opened: "2024-10-31", shortDescription: "Issue O", priority: "Medium", state: "Closed", category: "Feature" },
//     { number: 16, opened: "2024-10-30", shortDescription: "Issue P", priority: "High", state: "Resolved", category: "Enhancement" },
//     { number: 17, opened: "2024-10-29", shortDescription: "Issue Q", priority: "Low", state: "Open", category: "Bug" },
//     { number: 18, opened: "2024-10-28", shortDescription: "Issue R", priority: "Medium", state: "In Progress", category: "Feature" },
//     { number: 19, opened: "2024-10-27", shortDescription: "Issue S", priority: "High", state: "Closed", category: "Enhancement" },
//     { number: 20, opened: "2024-10-26", shortDescription: "Issue T", priority: "Low", state: "Resolved", category: "Bug" },
// ];

// Function to generate random incident data
const generateTableRandomIncidents = (count) => {
    const incidents = [];
    const states = ["Open", "In Progress", "Resolved", "Closed"];
    const categories = ["Bug", "Feature", "Enhancement", "Maintenance"];
    const priorities = ["High", "Medium", "Low", "Critical", "Planning"];
    const descriptions = [
        "Network issue",
        "Server crash",
        "UI bug",
        "Database error",
        "API timeout",
        "Feature request",
        "Code optimization",
        "System maintenance",
    ];
    
    // Function to generate an ID in the format INC0012235
    const generateIncidentID = (index) => {
        const prefix = "INC"; // Fixed prefix
        const paddedIndex = String(index).padStart(7, "0"); // Pad index with 7 digits
        return `${prefix}${paddedIndex}`; // Combine prefix and padded index
    };

    for (let i = 1; i <= count; i++) {
        const randomDays = Math.floor(Math.random() * 30); // Random number of days ago
        const randomState = states[Math.floor(Math.random() * states.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
        const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

        incidents.push({
            number: generateIncidentID(i),
            opened: subDays(new Date(), randomDays).toISOString().split("T")[0], // Format date as YYYY-MM-DD
            shortDescription: randomDescription,
            priority: randomPriority,
            state: randomState,
            category: randomCategory,
        });
    }

    return incidents;
};

// not in use
// Generate 20 random incidents
const sampleData = generateTableRandomIncidents(20);

// chart 2.2.1
const stackedBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to resize dynamically
    indexAxis: "y",
    plugins: {
        legend: {
            position: 'top', // Position of the legend
            labels: {
                boxWidth: 12, // Adjusts the size of the color boxes
                boxHeight: 12, // Adjusts the height of the color boxes (Chart.js v4+)
                font: {
                    size: 10, // Adjusts the font size of the legend text
                    weight: 'normal', // Adjusts font weight (e.g., 'bold', 'normal')
                },
                padding: 10, // Adjusts spacing around the legend items
                // usePointStyle: true, // Use a circle instead of a square for the legend box
            },
        },
        datalabels: {
            anchor: "center",
            align: "center",
            color: "white",
            formatter: (value) => (value > 0 ? `${value}%` : ""), // Show only if value > 0
        },
    },
    scales: {
        x: {
            stacked: true,
            title: { display: true, text: "Percentage (%)" },
            min: 0, // Set minimum value to 0
            max: 100, // Restrict x-axis to 100%
        },
        y: {
            stacked: true,
            title: { display: true, text: "Incident Categories" },
        },
    },
};

// chart 2.1.3
// Group incidents by category and state
const groupIncidentsByCategoryAndStatus = (incidents) => {
    const groupedData = {};

    // Group incidents by category and state
    incidents.forEach((incident) => {
        if (!groupedData[incident.category]) {
        groupedData[incident.category] = { Open: 0, "In Progress": 0, "On Hold": 0, Resolved: 0, Closed: 0, Unassigned: 0 };
        }
        groupedData[incident.category][incident.state]++;
    });
    

    // Calculate percentages correctly per category with adjustment
    Object.keys(groupedData).forEach((category) => {
        const total = Object.values(groupedData[category]).reduce((sum, val) => sum + val, 0);

        if (total > 0) {
        const rawPercentages = {};
        let roundedPercentages = {};
        let totalRounded = 0;

        // Step 1: Calculate raw percentages
        Object.keys(groupedData[category]).forEach((state) => {
            rawPercentages[state] = (groupedData[category][state] / total) * 100;
        });

        // Step 2: Round percentages and calculate the rounding difference
        Object.keys(rawPercentages).forEach((state) => {
            roundedPercentages[state] = Math.floor(rawPercentages[state]);
            totalRounded += roundedPercentages[state];
        });

        // Step 3: Adjust residuals to make total equal 100
        const residual = 100 - totalRounded;
        const sortedstate = Object.keys(rawPercentages).sort(
            (a, b) => rawPercentages[b] - rawPercentages[a]
        );

        for (let i = 0; i < residual; i++) {
            roundedPercentages[sortedstate[i]]++;
        }

        groupedData[category] = roundedPercentages;
        }
    });

    return groupedData;
};


// chart 2.1.2
// Prepare Stacked Bar Chart Data
const prepareStackedBarChartData = (filteredIncidents, filter) => {
    // Filter incidents to include only this year for "All" filter
    const now = new Date();
    const currentYearStart = new Date(now.getFullYear(), 0, 1);

    const filteredCategories =
        filter === 'All'
            ? filteredIncidents.filter(
                  (incident) =>
                      incident.date >= currentYearStart // No exclusion for "On Hold" and "Resolved"
              )
            : filteredIncidents;

    const groupedData = groupIncidentsByCategoryAndStatus(filteredCategories);

    return {
        labels: Object.keys(groupedData),
        datasets: [
            {
                label: "Open",
                data: Object.values(groupedData).map((category) => category.Open),
                backgroundColor: "#e74c3c",
            },
            {
                label: "In Progress",
                data: Object.values(groupedData).map((category) => category["In Progress"]),
                backgroundColor: "#f1c40f",
            },
            {
                label: "On Hold",
                data: Object.values(groupedData).map((category) => category["On Hold"] || 0),
                backgroundColor: "#9c27b0",
            },
            {
                label: "Resolved",
                data: Object.values(groupedData).map((category) => category.Resolved || 0),
                backgroundColor: "#4caf50",
            },
            {
                label: "Closed",
                data: Object.values(groupedData).map((category) => category.Closed),
                backgroundColor: "#95a5a6",
            },
            {
                label: "Unassigned",
                data: Object.values(groupedData).map((category) => category.Unassigned),
                backgroundColor: "#4B4B4B",
            },
        ],
    };
};

const Incidents = () => {
    // filter incidents state
    const [filter, setFilter] = useState('All');
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [tempFromDate, setTempFromDate] = useState(null); // Temporary From date
    const [tempToDate, setTempToDate] = useState(null); // Temporary To date
    const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu

    // Top card
    // Filtered top cards
    const currentYearStart = new Date(new Date().getFullYear(), 0, 1); // Start of the current year
    // const filteredTopCards =
    // filter === "Custom" && fromDate && toDate
    //     ? sampleIncidents.filter(
    //           (incident) =>
    //               incident.date >= fromDate && incident.date <= toDate
    //       )
    //     : sampleIncidents.filter((incident) => incident.date >= currentYearStart);

    const filteredTopCards = filterTopCards(sampleIncidents, filter, fromDate, toDate);

    // data table state
    const [rows, setRows] = useState(sampleData); // Full data
    const [filteredRows, setFilteredRows] = useState(sampleIncidents); // Filtered data
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "number", direction: "asc" });

    const [customRange, setCustomRange] = useState('Please select a date range'); // Custom date range
    
    // const [filteredData, setFilteredData] = useState(sampleIncidents); // Shared filtered data

    const [filteredData, setFilteredData] = useState(
        sampleIncidents.filter((incident) => incident.date >= currentYearStart)
    );

    // Top card
    // Assigned colour for different incident state
    const dashboardItems = [
        { label: 'Total', value: filteredTopCards.length, color: '#2196f3', icon: <AssignmentIcon /> },
        { label: 'Open', value: filteredTopCards.filter(incident => incident.state === 'Open').length, color: '#f44336', icon: <InboxIcon /> },
        { label: 'In Progress', value: filteredTopCards.filter(incident => incident.state === 'In Progress').length, color: '#ff9800', icon: <AutorenewIcon /> },
        { label: 'On Hold', value: filteredTopCards.filter(incident => incident.state === 'On Hold').length, color: '#9c27b0', icon: <PauseCircleFilledIcon /> },
        { label: 'Resolved', value: filteredTopCards.filter(incident => incident.state === 'Resolved').length, color: '#4caf50', icon: <CheckCircleIcon /> },
        { label: 'Closed', value: filteredTopCards.filter(incident => incident.state === 'Closed').length, color: '#607d8b', icon: <DoneAllIcon /> },
    ];

    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter);

        // Adjust date ranges based on the filter
        const today = new Date();
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        let filtered;

        switch (selectedFilter) {
            case 'Today':
                const todayStart = new Date();
                todayStart.setHours(0, 0, 0, 0); // Start of the day
                const todayEnd = new Date();
                todayEnd.setHours(23, 59, 59, 999); // End of the day
                filtered = sampleIncidents.filter(
                    (incident) => incident.date >= todayStart && incident.date <= todayEnd
                );
                setFromDate(todayStart);
                setToDate(todayEnd);
                break;
            case '7 Days':
                const startOfLast7Days = new Date();
                startOfLast7Days.setHours(0, 0, 0, 0); // Start of the current day
                const last7DaysStart = subDays(startOfLast7Days, 6); // Subtract 6 days for a full 7-day range

                filtered = sampleIncidents.filter(
                    (incident) =>
                        incident.date >= last7DaysStart && incident.date <= now
                );

                setFromDate(last7DaysStart); // Set the start date for the 7-day range
                setToDate(now); // Set the current date as the end of the range
                break;
            case 'Month':
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the current month
                filtered = sampleIncidents.filter(
                    (incident) => incident.date >= startOfMonth && incident.date <= now
                );
                setFromDate(startOfMonth);
                setToDate(now);
                break;
            case 'Year':
                setFromDate(new Date(today.getFullYear(), 0, 1));
                setToDate(today);
                break;
            case 'Custom':
                if (fromDate && toDate) {
                    filtered = sampleIncidents.filter(
                        (incident) =>
                            incident.date >= fromDate && incident.date <= toDate
                    );
                    setFilteredData(filtered); // Update the data for charts and table
                } else {
                    alert("Please select both 'From' and 'To' dates to apply the filter.");
                    return;
                }
                break;
            default:
                const currentYearStart = new Date(today.getFullYear(), 0, 1);
                filtered = sampleIncidents.filter(
                    (incident) => incident.date >= currentYearStart
                );
                setFromDate(currentYearStart);
                setToDate(now);
                break;
        }

        setFilteredData(filtered); // Update the shared filtered data
    };

    // Chart Data Preparation
    const slaCounts = {
        Met: filteredTopCards.filter((i) => i.sla === 'Met').length,
        NotMet: filteredTopCards.filter((i) => i.sla === 'NotMet').length,
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

    // Data Table 
    // Sorting Functionality
    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });

        const sortedData = [...filteredData].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });
    
        setFilteredData(sortedData);
    };

    // Handle Pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle Search
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase(); // Normalize search term to lowercase
        setSearchText(value);

        const filtered = sampleIncidents.filter((row) =>
            Object.values(row).some((field) =>
                field.toString().toLowerCase().includes(value) // Normalize fields to lowercase and check for inclusion
            )
        );

        setFilteredData(filtered);
    };

    const today = new Date(); // Format today's date
    const yearStart = new Date(new Date().getFullYear(), 0, 1); // Format start of the year
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Format start of the month    
    
    // Function to calculate the date range based on the filter
    const getDateDisplay = () => {
        switch (filter) {
            case 'Today':
                return format(today, 'dd MMM yyyy');
            case '7 Days':
                const sevenDaysAgo = subDays(today, 6);
                return `${format(sevenDaysAgo, 'dd MMM yyyy')} - ${format(today, 'dd MMM yyyy')}`;
            case 'Year':
                return `${format(yearStart, 'dd MMM yyyy')} - ${format(today, 'dd MMM yyyy')}`;
            case 'Month':
                return `${format(monthStart, 'dd MMM yyyy')} - ${format(today, 'dd MMM yyyy')}`;
            case 'Custom':
                return fromDate && toDate
                    ? `${format(fromDate, 'dd MMM yyyy')} - ${format(toDate, 'dd MMM yyyy')}`
                    : 'Please select a date range';
            case 'All':
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                return `${format(startOfYear, "dd MMM yyyy")} - ${format(today, "dd MMM yyyy")}`;

            default:
                return 'All Dates';
        }
    };
    
    
    const handleDropdownOpen = (event) => {
        setAnchorEl(event.currentTarget); // Open the dropdown
    };

    const handleDropdownClose = () => {
        setAnchorEl(null); // Close the dropdown
    };

    const handleApplyFilter = () => {
        if (tempFromDate && tempToDate) {
            setFromDate(tempFromDate);
            setToDate(tempToDate);
    
            // Update the filtered data
            const filtered = sampleIncidents.filter(
                (incident) =>
                    incident.date >= tempFromDate &&
                    incident.date <= tempToDate
            );
    
            setFilteredData(filtered); // Update shared filtered data for charts and table
            setCustomRange(`${format(tempFromDate, "dd MMM yyyy")} - ${format(tempToDate, "dd MMM yyyy")}`);
            setFilter("Custom");
        } else {
            alert("Please select both 'From' and 'To' dates to apply the filter.");
        }
    
        setAnchorEl(null); // Close dropdown
    };
    
    // sla filtered date
    const filteredSlaIncidents =
    filter === 'All'
        ? sampleIncidents // Include all incidents for "All"
        : filter === 'Today'
        ? sampleIncidents.filter((incident) => {
              const todayStart = new Date();
              todayStart.setHours(0, 0, 0, 0); // Normalize to start of the day
              const todayEnd = new Date();
              todayEnd.setHours(23, 59, 59, 999); // Normalize to end of the day
              return incident.date >= todayStart && incident.date <= todayEnd;
          })
        : sampleIncidents.filter(
              (incident) => incident.date >= fromDate && incident.date <= toDate
          );


    console.log("filtered", filteredSlaIncidents);

    const slaChartData = prepareChartData(filteredSlaIncidents, fromDate, toDate, filter === 'All');
    console.log("slachart", slaChartData);

     // chart 2.1.1
    // Prepare Stacked Bar Chart Data for Incident Categories
    const stackedBarChartData = prepareStackedBarChartData(filteredSlaIncidents, filter);
    
    console.log("stacked", stackedBarChartData);

    // chart 3.1.4
    // Group incidents by priority and status
    const groupIncidentsByPriorityAndStatus = (incidents, filter) => {

        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1); // Start of the current year

        // Filter incidents for the "All" case or use the full dataset for other cases
        const filteredIncidents = filter === 'All'
            ? incidents.filter((incident) => incident.date >= startOfYear)
            : incidents;

        const groupedData = {
            Critical: { Open: 0, "In Progress": 0, "On Hold": 0, Resolved: 0, Closed: 0, Unassigned: 0 },
            High: { Open: 0, "In Progress": 0, "On Hold": 0, Resolved: 0, Closed: 0, Unassigned: 0 },
            Moderate: { Open: 0, "In Progress": 0, "On Hold": 0, Resolved: 0, Closed: 0, Unassigned: 0 },
            Low: { Open: 0, "In Progress": 0, "On Hold": 0, Resolved: 0, Closed: 0, Unassigned: 0 },
            Planning: { Open: 0, "In Progress": 0, "On Hold": 0, Resolved: 0, Closed: 0, Unassigned: 0 },
        };
    
        // Group filtered incidents by priority and status
        filteredIncidents.forEach((incident) => {
            if (groupedData[incident.priority]) {
                groupedData[incident.priority][incident.state]++;
            }
        });

        return groupedData;
    };
    
    // chart 3.1.2
    // Prepare Vertical Bar Chart for Priorities
    const preparePriorityChartData = (groupedData) => {

        return {
        labels: Object.keys(groupedData),
        datasets: [
            {
            label: "Open",
            data: Object.values(groupedData).map((priority) => priority.Open),
            backgroundColor: "#e74c3c",
            },
            {
            label: "In Progress",
            data: Object.values(groupedData).map((priority) => priority["In Progress"]),
            backgroundColor: "#f1c40f",
            },
            {
            label: "On Hold",
            data: Object.values(groupedData).map((priority) => priority["On Hold"]),
            backgroundColor: "#9c27b0",
            },
            {
            label: "Resolved",
            data: Object.values(groupedData).map((priority) => priority.Resolved),
            backgroundColor: "#4caf50",
            },
            {
            label: "Closed",
            data: Object.values(groupedData).map((priority) => priority.Closed),
            backgroundColor: "#95a5a6",
            },
            {
            label: "Unassigned",
            data: Object.values(groupedData).map((priority) => priority.Unassigned),
            backgroundColor: "#4B4B4B",
            },    
        ],
        };
    };

    

    // chart 3.2.1
    const priorityBarChartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allows the chart to resize dynamically
        plugins: {
        legend: { 
            position: "top" ,
            labels: {
                boxWidth: 12, // Adjusts the size of the color boxes
                boxHeight: 12, // Adjusts the height of the color boxes (Chart.js v4+)
                font: {
                    size: 10, // Adjusts the font size of the legend text
                    weight: 'normal', // Adjusts font weight (e.g., 'bold', 'normal')
                },
                padding: 10, // Adjusts spacing around the legend items
                // usePointStyle: true, // Use a circle instead of a square for the legend box
            },
            },
            tooltip: {
                callbacks: {
                label: function (context) {
                    const value = context.raw;
                    if (value === 0) {
                    return null; // Hide tooltip for zero values
                    }
                    return `${context.dataset.label}: ${value}`;
                },
                },
            },
        datalabels: {
            display: false, // Disable data labels on bars
        },
        },
        scales: {
        x: {
            stacked: false, // Disable stacking for the x-axis
            title: { display: true, text: "Priorities" },
        },
        y: {
            stacked: false, // Disable stacking for the y-axis
            title: { display: true, text: "Count" },
            beginAtZero: true,
        },
        },
    };

    // chart 3.1.3
    // Group incidents by priority and status
    const groupedData = groupIncidentsByPriorityAndStatus(filteredSlaIncidents, filter);

    // chart 3.1.1
    // Prepare Vertical Bar Chart for Priorities
    const priorityBarChartData = preparePriorityChartData(groupedData);

    const getOverdueIncidents = (incidents) => {
        const currentYear = new Date().getFullYear(); // Get the current year
        return incidents.filter(
            (incident) =>
                (incident.state === "Open" || incident.state === "In Progress") && // Only open or in-progress incidents
                new Date(incident.opened).getFullYear() === currentYear && // Ensure it's within the current year
                new Date(incident.opened) <= subDays(new Date(), 30) // Opened more than 30 days ago
        );
    };

    // card 1.1 
    // function for Overdue Incidents
    const openIncidentsMoreThan30Days = getOverdueIncidents(sampleIncidents).length;

    // function for unassigned incidents
    const getUnassignedIncidents = (incidents) => {
        const currentYear = new Date().getFullYear();
    
        return incidents.filter((incident) => {
            const incidentYear = new Date(incident.date).getFullYear();
            return incident.state === "Unassigned" && incidentYear === currentYear;
        });
    };

    // card 3.2
    // Filter for Unassigned Incidents count
    const getUnassignedIncidentsCount = (incidents) => {
        const currentYear = new Date().getFullYear();
    
        return incidents.filter((incident) => {
            const incidentYear = new Date(incident.date).getFullYear();
            return incident.state === "Unassigned" && incidentYear === currentYear;
        }).length;
    };

    // card 3.1
    // Dynamically get unassigned count
    const unassignedCount = getUnassignedIncidentsCount(sampleIncidents);

    // card 2.3
    // Filter incidents not updated since opened
    const filterIncidentsNotUpdated = (incidents) => {
        const currentYear = new Date().getFullYear(); // Get the current year
    
        return incidents.filter((incident) => {
            const openedDate = new Date(incident.opened); // Parse the opened date
            const lastUpdatedDate = new Date(incident.lastUpdated); // Parse the last updated date
    
            // Ensure the incident is within the current year
            const isInCurrentYear = openedDate.getFullYear() === currentYear;
    
            // Calculate the difference in days between opened and last updated
            const differenceInDays = (lastUpdatedDate - openedDate) / (1000 * 60 * 60 * 24);
    
            // Check if the difference is greater than 7 days
            const isMoreThan7Days = differenceInDays > 7;
    
            // Exclude incidents with "Resolved" or "Closed" states
            const isActiveState = incident.state !== "Resolved" && incident.state !== "Closed";
    
            return isInCurrentYear && isMoreThan7Days && isActiveState; // Combine all conditions
        });
    };
    
    
    // card 2.2
    // Get count of incidents not updated in 7 days
    const incidentsNotUpdated = filterIncidentsNotUpdated(sampleIncidents);
    
    // card 2.1
    const countNotUpdated = incidentsNotUpdated.length;

    return (

        // Main Container
        <div style={{ padding: '20px' }}>
            
            {/* Title */}
            <Typography variant="h6" gutterBottom>
                Incident Management
            </Typography>

            {/* date display and buttons dropdown */}
            <div
                style={{
                    display: 'flex', // Align items in a row
                    justifyContent: 'space-between', // Space out elements
                    alignItems: 'center', // Align items vertically in the center
                    marginBottom: '10px',
                }}
                >

                {/* Date Range Display */}
                <Typography
                    variant="body2"
                    style={{
                        color: 'grey', // Make the text less prominent
                        fontStyle: 'italic', // Optional: Italicize for style
                    }}
                >
                    {/* Display the date range */}
                    {getDateDisplay()} 
                </Typography>

                {/* Button Group */}
                <ButtonGroup>
                    {['All', 'Today', '7 Days', 'Month'].map((label) => (
                        <Button
                            key={label}
                            variant={filter === label && filter !== 'Custom' ? 'contained' : 'outlined'}
                            onClick={() => handleFilterChange(label)}
                            sx={{
                                fontSize: '10px', // Adjust font size here
                            }}
                        >
                            {label}
                        </Button>
                    ))}

                    {/* Custom Button */}
                    <Button
                        variant={filter === 'Custom' ? 'contained' : 'outlined'}
                        onClick={(event) => {
                            setFilter('Custom'); // Set filter to "Custom"
                            handleDropdownOpen(event); // Open the dropdown
                        }}
                        sx={{
                            fontSize: '10px',
                        }}
                    >
                        Custom
                    </Button>

                </ButtonGroup>

                {/* Dropdown Menu for Custom Date */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleDropdownClose}
                    keepMounted
                    disablePortal={false}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right', // Align to the right edge of the button
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right', // Align the top-right corner of the menu with the button
                    }}
                    MenuListProps={{
                        style: { padding: '10px', width: '250px' },
                    }}
                    PopperProps={{
                        modifiers: [
                            {
                                name: 'preventOverflow',
                                options: {
                                    boundary: 'window',
                                },
                            },
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, 10], // Add a vertical margin of 10px
                                },
                            },
                            {
                                name: 'computeStyles',
                                options: {
                                    adaptive: true, // Ensures the menu repositions on window resize
                                    gpuAcceleration: true, // Smooth animations
                                },
                            },
                        ],
                    }}
                >

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {/* From Date Picker */}
                    <MenuItem
                        disableRipple
                        sx={{
                            "&:hover": { backgroundColor: "transparent" }, // Remove grey on hover
                            "&:focus": { backgroundColor: "transparent" }, // Remove grey on focus
                            "&.Mui-selected": { backgroundColor: "transparent" }, // Remove grey when selected
                            "&.Mui-selected:hover": { backgroundColor: "transparent" }, // Remove grey on selected hover
                        }}
                    >
                        <DatePicker
                            label="From"
                            value={tempFromDate}
                            onChange={(newValue) => setTempFromDate(newValue)} // Update tempFromDate
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        marginBottom: '10px',
                                    }}
                                />
                            )}
                        />
                    </MenuItem>

                    {/* To Date Picker */}
                    <MenuItem
                        disableRipple
                        sx={{
                            "&:hover": { backgroundColor: "transparent" }, // Remove grey on hover
                            "&:focus": { backgroundColor: "transparent" }, // Remove grey on focus
                            "&.Mui-selected": { backgroundColor: "transparent" }, // Remove grey when selected
                            "&.Mui-selected:hover": { backgroundColor: "transparent" }, // Remove grey on selected hover
                        }}
                    >
                        <DatePicker
                            label="To"
                            value={tempToDate}
                            onChange={(newValue) => setTempToDate(newValue)} // Update tempToDate
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        marginBottom: '10px',
                                    }}
                                />
                            )}
                        />
                    </MenuItem>

                    {/* Apply Button */}
                    <MenuItem
                        disableRipple
                        sx={{
                            "&:hover": { backgroundColor: "transparent" }, // Remove grey on hover
                            "&:focus": { backgroundColor: "transparent" }, // Remove grey on focus
                            "&.Mui-selected": { backgroundColor: "transparent" }, // Remove grey when selected
                            "&.Mui-selected:hover": { backgroundColor: "transparent" }, // Remove grey on selected hover
                        }}
                        style={{ justifyContent: 'center', padding: '10px 0' }}
                    >   
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApplyFilter}
                            size="small"
                            sx={{
                                width: '100%',
                            }}
                        >
                            Apply
                        </Button>
                    </MenuItem>
                </LocalizationProvider>
                </Menu>
            </div>


            
            {/* Top Cards */}
            <Grid
                container
                spacing={1}
                style={{
                    marginBottom: '10px',
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
                    style={{ display: 'flex' }}
                >
                    <Card
                        onClick={() => {
                            setFilteredData(
                                filteredSlaIncidents.filter((incident) => {
                                    const incidentYear = new Date(incident.date).getFullYear(); // Get the year of the incident
                                    const currentYear = new Date().getFullYear(); // Current year check
                        
                                    // Logic for filtering based on the dashboard item's label
                                    if (item.label === 'Total') {
                                        return incidentYear === currentYear; // Include all incidents for the current year
                                    }
                                    return (
                                        incident.state === item.label && // Match the incident state with the card label
                                        incidentYear === currentYear // Ensure the incident is from the current year
                                    );
                                })
                            );
                        }}
                        style={{
                            display: 'flex', // Flexbox for horizontal alignment
                            alignItems: 'center', // Align items vertically
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            flex: 1,
                            padding: '16px', // Add padding for inner spacing
                            cursor: 'pointer', // Make the card clickable
                            transition: 'box-shadow 0.3s ease', // Smooth hover effect
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)") // Add shadow on hover
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)") // Reset shadow when not hovered
                        }
                    >
                        {/* Circular Icon */}
                        <div
                            style={{
                                width: '40px', // Width of the circular icon
                                height: '40px', // Height of the circular icon
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%', // Makes the icon circular
                                fontSize: '1.8rem', // Size of the icon
                                marginRight: '16px', // Space between the icon and the text
                                
                                backgroundColor: item.color, // Set the color from the item
                                color: 'white', // White icon color for contrast
                            }}
                        >
                            {item.icon}
                        </div>

                        {/* Label and Value */}
                        <div style={{ flex: 1, textAlign: 'right', paddingRight: '10px' }}>
                            {/* Label */}
                            <Typography
                                variant="h7"
                                style={{
                                    // fontWeight: 'bold',
                                    color: 'grey', // Dim the color of the label
                                    textAlign: 'right', // Align label to the right
                                }}
                            >
                                {item.label}
                            </Typography>

                            {/* Value */}
                            <Typography
                                variant="h4"
                                style={{
                                    fontWeight: 'bold',
                                    marginTop: '8px',
                                    textAlign: 'right', // Align value to the right
                                }}
                            >
                                {item.value}
                            </Typography>
                        </div>
                    </Card>
                </Grid>
            ))}
            </Grid>

            {/* Row 1 */}
            <Grid container spacing={1}> 

                {/* left */}
                <Grid item xs={12} sm={12} md={6}>
                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '8px',
                            boxSizing: 'border-box',
                            // marginRight: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            marginBottom: '10px',
                        }}
                    >
                        <Typography variant="h7" gutterBottom>
                            SLA Breach
                        </Typography>
                        <div style={{ height: '260px', width: '100%' }}>
                            {/* <Bar data={chartData} options={chartOptions} /> */}
                            <Line data={slaChartData} options={slaChartOptions} />
                        </div>
                    </div>
                </Grid>
                
                {}
                <Grid item xs={12} sm={12} md={6}> 
                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '8px',
                            boxSizing: 'border-box',
                            // marginRight: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            marginBottom: '10px',
                        }}
                    >
                        <Typography variant="h7" gutterBottom>
                            Incident Categories (%)
                        </Typography>
                        <div style={{ height: '260px', width: '100%' }}>
                            <Bar data={stackedBarChartData} options={stackedBarChartOptions} />
                        </div>
                    </div>
                </Grid>        
            </Grid>
            
            {/*Row 2*/}
            <Grid container spacing={1}> 
                {/* left */}
                <Grid item xs={12} sm={12} md={6}>
                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '8px',
                            boxSizing: 'border-box',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            marginBottom: '10px',
                        }}
                    >
                        <Typography variant="subtitle1">Incident Grouped (Priority and Status)</Typography>
                        <div style={{ height: '260px', width: '100%' }}>
                            <Bar data={priorityBarChartData} options={priorityBarChartOptions} />
                        </div>
                    </div>
                </Grid>
                
                {/* right */}
                <Grid item xs={12} sm={12} md={6}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between", // Evenly distribute the divs vertically
                    height: "335px", // Match the height of the left chart
                }}
                >
    
                {/* Overdue Incidents */}
                <div
                    onClick={() => setFilteredData(getOverdueIncidents(sampleIncidents))} // Filter data on click
                    style={{
                        padding: "10px 20px",
                        borderRadius: "8px",
                        boxSizing: "border-box",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Box shadow effect
                        height: "120px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer", // Makes the card clickable
                        transition: "box-shadow 0.3s ease", // Smooth hover effect
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)") // Add shadow on hover
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)") // Reset shadow when not hovered
                    }
                    >
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 }}>
                        <span style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "5px" }}>Overdue Incidents</span>
                        <span style={{ fontSize: "12px", color: "grey" }}>More than 30 days</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                        <span style={{ fontSize: "30px", color: "#2196F3", fontWeight: "bold", lineHeight: "1", marginBottom: "5px" }}>
                            {openIncidentsMoreThan30Days}
                        </span>
                        <span style={{ fontSize: "12px", color: "grey", lineHeight: "1" }}>
                            {`Jan 1, ${new Date().getFullYear()} - ${new Date().toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}`}
                        </span>
                    </div>
                </div>
    
                {/* Stale Incidents */}
                <div
                    onClick={() => setFilteredData(filterIncidentsNotUpdated(sampleIncidents))}
                    style={{
                        padding: "20px",
                        borderRadius: "8px",
                        boxSizing: "border-box",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Box shadow effect
                        height: "106px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between", // Space between left and right sections
                        cursor: "pointer", // Makes the card clickable
                        transition: "box-shadow 0.3s ease", // Smooth hover effect
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)") // Add shadow on hover
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)") // Reset shadow when not hovered
                    }
                >
                    {/* Left Section */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 }}>
                        <span style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "5px" }}>Stale Incidents</span>
                        <span style={{ fontSize: "12px", color: "grey" }}>Not updated for more than 7 days</span>
                    </div>

                    {/* Right Section */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end", // Align to the right
                            justifyContent: "center", // Vertically center
                        }}
                    >
                        {/* Count */}
                        <span
                            style={{
                                fontSize: "30px", // Bigger font for emphasis
                                color: "#2196F3",
                                fontWeight: "bold",
                                lineHeight: "1",
                                marginBottom: "5px", // Space between count and date range
                            }}
                        >
                            {countNotUpdated}
                        </span>

                        {/* Date Range */}
                        <span
                            style={{
                                fontSize: "12px",
                                color: "grey",
                                lineHeight: "1",
                            }}
                        >
                            {`Jan 1, ${new Date().getFullYear()} - ${new Date().toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}`}
                        </span>
                    </div>
                </div>
    
                {/* Unassigned Incidents */}
                <div
                    onClick={() => setFilteredData(getUnassignedIncidents(sampleIncidents))}
                    style={{
                        padding: "20px",
                        borderRadius: "8px",
                        boxSizing: "border-box",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        height: "106px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer", // Make it clickable
                        transition: "box-shadow 0.3s ease", // Add smooth hover effect
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)")
                    } // Add shadow on hover
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)")
                    } // Reset shadow on hover leave
                >
                    {/* Left Section: Title and Subtitle */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            flexGrow: 1,
                        }}
                    >
                        <span
                            style={{
                                fontWeight: "bold",
                                fontSize: "20px",
                                marginBottom: "5px",
                            }}
                        >
                            Unassigned
                        </span>
                        <span style={{ fontSize: "12px", color: "grey" }}>
                            Incidents without assignment
                        </span>
                    </div>

                    {/* Right Section: Count and Date */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column", // Stack count and date vertically
                            alignItems: "flex-end", // Align to the right
                            justifyContent: "center",
                            height: "100%", // Ensure full height alignment
                        }}
                    >
                        <span
                            style={{
                                fontSize: "30px", // Large font for count
                                color: "#2196F3",
                                fontWeight: "bold",
                                lineHeight: "1",
                            }}
                        >
                            {unassignedCount}
                        </span>
                        <span
                            style={{
                                fontSize: "12px", // Smaller font for date
                                color: "grey",
                                marginTop: "5px", // Spacing below the count
                            }}
                        >
                            {`Jan 1, ${new Date().getFullYear()} - ${new Date().toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}`}
                        </span>
                    </div>
                </div>
    
    
    
                </Grid> 
            </Grid>
            
            {/* Row 3 */}
            <Grid container spacing={2}>

                {/* Table Section */}
                <Grid item xs={12} md={12}>
                    <Paper
                    sx={{
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: 3,
                        marginBottom: '20px', // Consistent spacing
                    }}
                    >
                    {/* Table Title */}
                    <Typography variant="h5" gutterBottom>
                        Incidents
                    </Typography>

                    {/* Search Bar */}
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchText}
                        onChange={handleSearch}
                        fullWidth
                        sx={{ marginBottom: '20px' }}
                    />

                    {/* Table */}
                    <TableContainer sx={{ maxHeight: "400px", overflow: "auto" }}>
                        <Table stickyHeader>
                            <TableHead>
                            <TableRow>
                                {[
                                { label: "Number", key: "number" },
                                { label: "Date", key: "date" },
                                { label: "Opened", key: "opened" },
                                { label: "Last Updated", key: "lastUpdated" },
                                { label: "Short Description", key: "shortDescription" },
                                { label: "Priority", key: "priority" },
                                { label: "State", key: "state" },
                                { label: "Category", key: "category" },
                                ].map((column) => (
                                <TableCell
                                    key={column.key}
                                    onClick={() => handleSort(column.key)}
                                    sx={{ cursor: "pointer", userSelect: "none" }}
                                >
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                    {column.label}
                                    {sortConfig.key === column.key ? (
                                        sortConfig.direction === "asc" ? (
                                        <ArrowUpward fontSize="small" />
                                        ) : (
                                        <ArrowDownward fontSize="small" />
                                        )
                                    ) : null}
                                    </div>
                                </TableCell>
                                ))}
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {filteredData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                <TableRow key={row.number}>
                                    <TableCell>{row.number}</TableCell>
                                    <TableCell>{new Date(row.date).toLocaleDateString('en-US')}</TableCell>
                                    <TableCell>{new Date(row.opened).toLocaleDateString('en-US')}</TableCell>
                                    <TableCell>{new Date(row.lastUpdated).toLocaleDateString('en-US')}</TableCell>
                                    <TableCell>{row.shortDescription}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{row.state}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </TableContainer>

                    {/* Pagination */}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        component="div"
                        count={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    </Paper>
                </Grid>
            </Grid>

        </div>
    );
};

export default Incidents;

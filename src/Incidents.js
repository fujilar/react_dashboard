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
    const statuses = ["Open", "In Progress", "Closed", "Unassigned", "On Hold", "Resolved"];
    const categories = ["Database", "Hardware", "Inquiry", "Network", "Software", "Null"];
    const slaOptions = ["Met", "NotMet"];
    const priorities = ["Critical", "High", "Moderate", "Low", "Planning"]; // Added priority levels
  
    for (let i = 1; i <= count; i++) {
      // Generate random days, with a 20% chance of being more than 30 days
      const randomDays = Math.random() < 0.8 
        ? Math.floor(Math.random() * 30)  // 80% chance: within 30 days
        : Math.floor(Math.random() * 30) + 31; // 20% chance: more than 30 days
  
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomSLA = slaOptions[Math.floor(Math.random() * slaOptions.length)];
      const randomPriority = priorities[Math.floor(Math.random() * priorities.length)]; // Added priority levels
      incidents.push({
        id: i,
        status: randomStatus,
        category: randomCategory,
        sla: randomSLA,
        priority: randomPriority, // Added priority levels
        date: subDays(new Date(), randomDays),
        lastUpdated: subDays(new Date(), randomDays), // Random last updated date
      });
    }
    return incidents;
  };
  
  
  const sampleIncidents = generateRandomIncidents(100);

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
    const groupedData = isAllFilter
        ? groupIncidentsByMonth(filteredIncidents)
        : groupIncidentsByDate(filteredIncidents);

    // Generate x-axis labels based on the filter type
    const labels = isAllFilter
        ? Object.keys(groupedData).sort() // Month keys (e.g., "2024-01", "2024-02")
        : (() => {
              const dateRange = [];
              let currentDate = new Date(fromDate);
              while (currentDate <= toDate) {
                  dateRange.push(format(currentDate, 'yyyy-MM-dd'));
                  currentDate.setDate(currentDate.getDate() + 1);
              }
              return dateRange;
          })();

    // Populate data for each SLA status
    const metCounts = labels.map((key) => groupedData[key]?.Met || 0);
    const notMetCounts = labels.map((key) => groupedData[key]?.NotMet || 0);

    // Calculate total counts
    const totalMet = metCounts.reduce((sum, count) => sum + count, 0);
    const totalNotMet = notMetCounts.reduce((sum, count) => sum + count, 0);

    return {
        labels,
        datasets: [
            {
                label: `SLA Met`, // Add total count to the label
                data: metCounts,
                borderColor: '#2ecc71', // Modern emerald green
                backgroundColor: '#A3E4D7', // Soft light aqua green
                fill: false,
                pointRadius: 2, // Smaller point radius
                pointHoverRadius: 3, // Hover effect point size
                borderWidth: 1, // Thinner line
                tension: 0.2, // Smaller curve tension
            },
            {
                label: `SLA Not Met`, // Add total count to the label
                data: notMetCounts,
                borderColor: '#e74c3c', // Modern soft red
                backgroundColor: '#F5B7B1', // Soft light pink
                fill: false,
                pointRadius: 2, // Smaller point radius
                pointHoverRadius: 3, // Hover effect point size
                borderWidth: 1, // Thinner line
                tension: 0.2, // Smaller curve tension
            },
        ],
    };
};


// Top card filter
// Utility function to filter incidents based on the selected filter
const filterTopCards = (incidents, filter, fromDate, toDate) => {
    const now = new Date();
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
        default:
            return incidents;
    }
};


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
            position: 'top',
        },
        datalabels: {
            display: false, // Disables data labels inside the chart
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


// Incident sample data
const sampleData = [
    { number: 1, opened: "2024-11-14", shortDescription: "Issue A", priority: "High", state: "Open", category: "Bug" },
    { number: 2, opened: "2024-11-13", shortDescription: "Issue B", priority: "Medium", state: "In Progress", category: "Feature" },
    { number: 3, opened: "2024-11-12", shortDescription: "Issue C", priority: "Low", state: "Resolved", category: "Enhancement" },
    { number: 4, opened: "2024-11-11", shortDescription: "Issue D", priority: "High", state: "Closed", category: "Bug" },
    { number: 5, opened: "2024-11-10", shortDescription: "Issue E", priority: "Low", state: "Open", category: "Maintenance" },
    { number: 6, opened: "2024-11-09", shortDescription: "Issue F", priority: "Medium", state: "In Progress", category: "Bug" },
    { number: 7, opened: "2024-11-08", shortDescription: "Issue G", priority: "High", state: "Closed", category: "Feature" },
    { number: 8, opened: "2024-11-07", shortDescription: "Issue H", priority: "Low", state: "Resolved", category: "Enhancement" },
    { number: 9, opened: "2024-11-06", shortDescription: "Issue I", priority: "Medium", state: "Open", category: "Bug" },
    { number: 10, opened: "2024-11-05", shortDescription: "Issue J", priority: "High", state: "In Progress", category: "Feature" },
    { number: 11, opened: "2024-11-04", shortDescription: "Issue K", priority: "Low", state: "Resolved", category: "Bug" },
    { number: 12, opened: "2024-11-03", shortDescription: "Issue L", priority: "Medium", state: "Closed", category: "Enhancement" },
    { number: 13, opened: "2024-11-02", shortDescription: "Issue M", priority: "High", state: "Open", category: "Feature" },
    { number: 14, opened: "2024-11-01", shortDescription: "Issue N", priority: "Low", state: "In Progress", category: "Bug" },
    { number: 15, opened: "2024-10-31", shortDescription: "Issue O", priority: "Medium", state: "Closed", category: "Feature" },
    { number: 16, opened: "2024-10-30", shortDescription: "Issue P", priority: "High", state: "Resolved", category: "Enhancement" },
    { number: 17, opened: "2024-10-29", shortDescription: "Issue Q", priority: "Low", state: "Open", category: "Bug" },
    { number: 18, opened: "2024-10-28", shortDescription: "Issue R", priority: "Medium", state: "In Progress", category: "Feature" },
    { number: 19, opened: "2024-10-27", shortDescription: "Issue S", priority: "High", state: "Closed", category: "Enhancement" },
    { number: 20, opened: "2024-10-26", shortDescription: "Issue T", priority: "Low", state: "Resolved", category: "Bug" },
];

// chart 2.2.1
const stackedBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to resize dynamically
    indexAxis: "y",
    plugins: {
        legend: { position: "top" },
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
// Group incidents by category and status
const groupIncidentsByCategoryAndStatus = (incidents) => {
    const groupedData = {};

    // Group incidents by category and status
    incidents.forEach((incident) => {
        if (!groupedData[incident.category]) {
        groupedData[incident.category] = { Open: 0, "In Progress": 0, Closed: 0, Unassigned: 0 };
        }
        groupedData[incident.category][incident.status]++;
    });

    // Calculate percentages correctly per category with adjustment
    Object.keys(groupedData).forEach((category) => {
        const total = Object.values(groupedData[category]).reduce((sum, val) => sum + val, 0);

        if (total > 0) {
        const rawPercentages = {};
        let roundedPercentages = {};
        let totalRounded = 0;

        // Step 1: Calculate raw percentages
        Object.keys(groupedData[category]).forEach((status) => {
            rawPercentages[status] = (groupedData[category][status] / total) * 100;
        });

        // Step 2: Round percentages and calculate the rounding difference
        Object.keys(rawPercentages).forEach((status) => {
            roundedPercentages[status] = Math.floor(rawPercentages[status]);
            totalRounded += roundedPercentages[status];
        });

        // Step 3: Adjust residuals to make total equal 100
        const residual = 100 - totalRounded;
        const sortedStatuses = Object.keys(rawPercentages).sort(
            (a, b) => rawPercentages[b] - rawPercentages[a]
        );

        for (let i = 0; i < residual; i++) {
            roundedPercentages[sortedStatuses[i]]++;
        }

        groupedData[category] = roundedPercentages;
        }
    });

    return groupedData;
};


// chart 2.1.2
// Prepare Stacked Bar Chart Data
const prepareStackedBarChartData = (filteredIncidents) => {
    // Exclude "On Hold" and "Resolved" from the incident categories
    const filteredCategories = filteredIncidents.filter(
        (incident) => incident.status !== "On Hold" && incident.status !== "Resolved"
    );

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
    const filteredTopCards = filterTopCards(sampleIncidents, filter, fromDate, toDate);

    // data table state
    const [rows, setRows] = useState(sampleData); // Full data
    const [filteredRows, setFilteredRows] = useState(sampleData); // Filtered data
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "number", direction: "asc" });

    const [customRange, setCustomRange] = useState('Please select a date range'); // Custom date range
    
    // Top card
    // Assigned colour for different incident statuses
    const dashboardItems = [
        { label: 'Total', value: filteredTopCards.length, color: '#2196f3', icon: <AssignmentIcon /> },
        { label: 'Open', value: filteredTopCards.filter(incident => incident.status === 'Open').length, color: '#f44336', icon: <InboxIcon /> },
        { label: 'In Progress', value: filteredTopCards.filter(incident => incident.status === 'In Progress').length, color: '#ff9800', icon: <AutorenewIcon /> },
        { label: 'On Hold', value: filteredTopCards.filter(incident => incident.status === 'On Hold').length, color: '#9c27b0', icon: <PauseCircleFilledIcon /> },
        { label: 'Resolved', value: filteredTopCards.filter(incident => incident.status === 'Resolved').length, color: '#4caf50', icon: <CheckCircleIcon /> },
        { label: 'Closed', value: filteredTopCards.filter(incident => incident.status === 'Closed').length, color: '#607d8b', icon: <DoneAllIcon /> },
    ];

    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter);

        // Adjust date ranges based on the filter
        const today = new Date();
        switch (selectedFilter) {
            case 'Today':
                setFromDate(today);
                setToDate(today);
                break;
            case '7 Days':
                setFromDate(subDays(today, 7));
                setToDate(today);
                break;
            case 'Month':
                setFromDate(new Date(today.getFullYear(), today.getMonth(), 1));
                setToDate(today);
                break;
            case 'Year':
                setFromDate(new Date(today.getFullYear(), 0, 1));
                setToDate(today);
                break;
            case 'Custom':
                // Custom filter uses temporary date pickers
                break;
            default:
                // Default to All incidents
                setFromDate(new Date('2000-01-01')); // Arbitrary past date
                setToDate(today);
        }
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

        const sortedData = [...filteredRows].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });
    
        setFilteredRows(sortedData);
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

        const filtered = rows.filter((row) =>
            Object.values(row).some((field) =>
                field.toString().toLowerCase().includes(value) // Normalize fields to lowercase and check for inclusion
            )
        );

        setFilteredRows(filtered);
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
                const sevenDaysAgo = subDays(today, 7);
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
                const slaDates = sampleIncidents
                    .filter(incident => incident.sla) // Filter only incidents with SLA information
                    .map(incident => incident.date); // Extract their dates
    
                if (slaDates.length === 0) {
                    // If no incidents with SLA exist
                    return `No SLA data available`;
                }
    
                const earliestDate = new Date(Math.min(...slaDates)); // Find the earliest SLA date
                const currentDate = today; // Current date for the range
    
                return `${format(earliestDate, 'dd MMM yyyy')} - ${format(currentDate, 'dd MMM yyyy')}`;
            default:
                return `${format(yearStart, 'dd MMM yyyy')} - ${format(today, 'dd MMM yyyy')}`;
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
            setFromDate(tempFromDate); // Apply the temporary date
            setToDate(tempToDate); // Apply the temporary date
            setCustomRange(`${tempFromDate.toLocaleDateString()} - ${tempToDate.toLocaleDateString()}`);
            setFilter('Custom');
        } else {
            alert("Please select both 'From' and 'To' dates to apply the filter.");
        }
        setAnchorEl(null); // Close dropdown after applying filter
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
    const stackedBarChartData = prepareStackedBarChartData(filteredSlaIncidents);

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
                        style={{
                            display: 'flex', // Flexbox for horizontal alignment
                            alignItems: 'center', // Align items vertically
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            flex: 1,
                            padding: '16px', // Add padding for inner spacing
                        }}
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
                            Incident Categories
                        </Typography>
                        <div style={{ height: '260px', width: '100%' }}>
                            <Bar data={stackedBarChartData} options={stackedBarChartOptions} />
                        </div>
                    </div>
                </Grid>        
            </Grid>
            
            {/* Row 2 */}
            <Grid container spacing={1}> 
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
                        <Typography variant="h5" gutterBottom>
                            3 
                        </Typography>
                        <div style={{ height: '260px', width: '100%' }}>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </Grid>

                <Grid item xs={12} sm={12} md={6}> 
                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '8px',
                            boxSizing: 'border-box',
                            // marginRight: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            height: '106px',
                            marginBottom: '10px',
                            fontWeight: 'bold',
                        }}
                    >
                    Incidents Open for more than 30 days
                    </div>

                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '8px',
                            boxSizing: 'border-box',
                            // marginRight: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            height: '106px',
                            marginBottom: '10px',
                            fontWeight: 'bold'
                        }}
                    >
                    Incidents not updated for 7 days
                    </div>

                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '8px',
                            boxSizing: 'border-box',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            height: '106px',
                            marginBottom: '10px',
                            fontWeight: 'bold',
                            display: 'flex', // Flexbox for alignment
                            alignItems: 'center', // Vertical alignment
                        }}
                    >

                        {/* Text Section */}
                        <div style={{ flex: 1 }}> {/* Flex grows this section */}
                            <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>Unassigned Incidents</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '8px' }}>3</div>
                        </div>
                        {/* Arrow Icon */}
                        <div
                            style={{
                                width: '40px', // Set size for the circular icon
                                height: '40px',
                                backgroundColor: '#f5f5f5', // Background color for the circular icon
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%', // Circular shape
                                marginRight: '10px', // Indentation on the left
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Optional: Add shadow for depth
                            }}
                        >
                            <ArrowDownward style={{ color: '#000' }} /> {/* Icon */}
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
                        Data Table with Sorting and Search
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
                                { label: "Opened", key: "opened" },
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
                            {filteredRows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                <TableRow key={row.number}>
                                    <TableCell>{row.number}</TableCell>
                                    <TableCell>{row.opened}</TableCell>
                                    <TableCell>{row.shortDescription}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{row.state}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </TableContainer>;

                    {/* Pagination */}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        component="div"
                        count={filteredRows.length}
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

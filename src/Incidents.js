import React, { useState } from 'react';
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
    { id: 7, status: 'Resolved', sla: 'Not Met', date: new Date('2024-11-27') },
];

// Utility function to filter incidents based on the selected filter
const filterIncidents = (incidents, filter, fromDate, toDate) => {
    const now = new Date();
    switch (filter) {
        case 'Today':
            return incidents.filter(incident => incident.date.toDateString() === now.toDateString());
        case '7 Days':
            const last7Days = new Date(now);
            last7Days.setDate(now.getDate() - 7);
            return incidents.filter(incident => incident.date >= last7Days);
        case 'Month':
            const lastMonth = new Date(now);
            lastMonth.setMonth(now.getMonth() - 1);
            return incidents.filter(incident => incident.date >= lastMonth);
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

const Incidents = () => {
    // filter incidents state
    const [filter, setFilter] = useState('All');

    const [fromDate, setFromDate] = useState(null); // State for From date
    const [toDate, setToDate] = useState(null); // State for To date

    const [tempFromDate, setTempFromDate] = useState(null); // Temporary From date
    const [tempToDate, setTempToDate] = useState(null); // Temporary To date

    const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu


    const filteredIncidents = filterIncidents(sampleIncidents, filter, fromDate, toDate);

    // data table state
    const [rows, setRows] = useState(sampleData); // Full data
    const [filteredRows, setFilteredRows] = useState(sampleData); // Filtered data
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "number", direction: "asc" });

    const [customRange, setCustomRange] = useState('Please select a date range'); // Custom date range

    // Assigned colour for different incident statuses
    const dashboardItems = [
        { label: 'Total', value: filteredIncidents.length, color: '#2196f3', icon: <AssignmentIcon /> },
        { label: 'Open', value: filteredIncidents.filter(incident => incident.status === 'Open').length, color: '#f44336', icon: <InboxIcon /> },
        { label: 'In Progress', value: filteredIncidents.filter(incident => incident.status === 'In Progress').length, color: '#ff9800', icon: <AutorenewIcon /> },
        { label: 'On Hold', value: filteredIncidents.filter(incident => incident.status === 'On Hold').length, color: '#9c27b0', icon: <PauseCircleFilledIcon /> },
        { label: 'Resolved', value: filteredIncidents.filter(incident => incident.status === 'Resolved').length, color: '#4caf50', icon: <CheckCircleIcon /> },
        { label: 'Closed', value: filteredIncidents.filter(incident => incident.status === 'Closed').length, color: '#607d8b', icon: <DoneAllIcon /> },
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

    // Calculate the start of the year and today's date
    // const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    // const today = new Date();

    // Format the dates
    // const formatDate = (date) => date.toLocaleDateString('en-US'); // Format as MM/DD/YYYY
    // const dateRange = `${formatDate(startOfYear)} - ${formatDate(today)}`;

    const today = new Date(); // Format today's date
    const yearStart = new Date(new Date().getFullYear(), 0, 1); // Format start of the year
    //monthStart
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
    

    return (
        <div style={{ padding: '20px' }}>
            
            <Typography variant="h6" gutterBottom>
                Incident Management
            </Typography>

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
                {getDateDisplay()}
            </Typography>

            {/* Button Group */}
            <ButtonGroup>
                {['All', 'Today', '7 Days', 'Month'].map((label) => (
                    <Button
                        key={label}
                        variant={filter === label && filter !== 'Custom' ? 'contained' : 'outlined'}
                        onClick={() => setFilter(label)}
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
                        <Typography variant="h7" gutterBottom>
                            SLA Breach
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
                            marginBottom: '10px',
                        }}
                    >
                        <Typography variant="h7" gutterBottom>
                            Categories
                        </Typography>
                        <div style={{ height: '260px', width: '100%' }}>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </Grid>        
            </Grid>

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

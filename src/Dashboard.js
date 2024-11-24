import React, { useState } from 'react';
import {
    Typography,
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
} from "@mui/material";
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

    // Responsive chart container component

    const Dashboard = () => {

        const [rows, setRows] = useState(sampleData); // Full data
        const [filteredRows, setFilteredRows] = useState(sampleData); // Filtered data
        const [page, setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(10);
        const [searchText, setSearchText] = useState("");
        const [sortConfig, setSortConfig] = useState({ key: "number", direction: "asc" });

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
                        // border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
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
                        // border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
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

                {/* Chart Block 3 */}
                <div
                    style={{
                        flex: '1 1 48%', // Takes up 48% of the width on larger screens
                        minWidth: '300px', // Ensures the chart doesn't shrink too much
                        padding: '20px',
                        // border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                        marginBottom: '10px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Typography variant="h5" gutterBottom>
                        3
                    </Typography>

                    <div style={{ 
                        height: '300px', 
                        width: '100%' 
                        }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                 {/* Divider for Separation */}
                <Divider sx={{ margin: "20px 0" }} />

                <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
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
                    sx={{ marginBottom: "20px" }}
                />

                {/* Table */}
                <TableContainer>
                    <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                        <TableCell>
                            <div style={{ display: "flex", alignItems: "center" }}>
                            Number
                            <IconButton onClick={() => handleSort("number")} size="small">
                                {sortConfig.key === "number" ? (
                                sortConfig.direction === "asc" ? (
                                    <ArrowUpward fontSize="small" />
                                ) : (
                                    <ArrowDownward fontSize="small" />
                                )
                                ) : (
                                <ArrowUpward fontSize="small" style={{ opacity: 0.5 }} />
                                )}
                            </IconButton>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ display: "flex", alignItems: "center" }}>
                            Opened
                            <IconButton onClick={() => handleSort("opened")} size="small">
                                {sortConfig.key === "opened" ? (
                                sortConfig.direction === "asc" ? (
                                    <ArrowUpward fontSize="small" />
                                ) : (
                                    <ArrowDownward fontSize="small" />
                                )
                                ) : (
                                <ArrowUpward fontSize="small" style={{ opacity: 0.5 }} />
                                )}
                            </IconButton>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ display: "flex", alignItems: "center" }}>
                            Short Description
                            <IconButton onClick={() => handleSort("shortDescription")} size="small">
                                {sortConfig.key === "shortDescription" ? (
                                sortConfig.direction === "asc" ? (
                                    <ArrowUpward fontSize="small" />
                                ) : (
                                    <ArrowDownward fontSize="small" />
                                )
                                ) : (
                                <ArrowUpward fontSize="small" style={{ opacity: 0.5 }} />
                                )}
                            </IconButton>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ display: "flex", alignItems: "center" }}>
                            Priority
                            <IconButton onClick={() => handleSort("priority")} size="small">
                                {sortConfig.key === "priority" ? (
                                sortConfig.direction === "asc" ? (
                                    <ArrowUpward fontSize="small" />
                                ) : (
                                    <ArrowDownward fontSize="small" />
                                )
                                ) : (
                                <ArrowUpward fontSize="small" style={{ opacity: 0.5 }} />
                                )}
                            </IconButton>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ display: "flex", alignItems: "center" }}>
                            State
                            <IconButton onClick={() => handleSort("state")} size="small">
                                {sortConfig.key === "state" ? (
                                sortConfig.direction === "asc" ? (
                                    <ArrowUpward fontSize="small" />
                                ) : (
                                    <ArrowDownward fontSize="small" />
                                )
                                ) : (
                                <ArrowUpward fontSize="small" style={{ opacity: 0.5 }} />
                                )}
                            </IconButton>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{ display: "flex", alignItems: "center" }}>
                            Category
                            <IconButton onClick={() => handleSort("category")} size="small">
                                {sortConfig.key === "category" ? (
                                sortConfig.direction === "asc" ? (
                                    <ArrowUpward fontSize="small" />
                                ) : (
                                    <ArrowDownward fontSize="small" />
                                )
                                ) : (
                                <ArrowUpward fontSize="small" style={{ opacity: 0.5 }} />
                                )}
                            </IconButton>
                            </div>
                        </TableCell>
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
                </TableContainer>

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
                
            </div>
            
        );
    };
    

export default Dashboard;
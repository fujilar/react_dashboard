import React from 'react';
import { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
    Grid, 
    Card, 
    CardContent, 
    Typography, 
    Button, 
    TextField, 
    Menu, 
    MenuItem 
} from '@mui/material';

const Problem = () => {

    const [fromDate, setFromDate] = useState(null); // State for from date
    const [toDate, setToDate] = useState(null); // State for to date
    const [filteredData, setFilteredData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null); // Anchor element for dropdown

    const data = [
        { id: 1, name: 'Task A', date: new Date('2024-11-01') },
        { id: 2, name: 'Task B', date: new Date('2024-11-10') },
        { id: 3, name: 'Task C', date: new Date('2024-11-15') },
        { id: 4, name: 'Task D', date: new Date('2024-11-20') },
        { id: 5, name: 'Task E', date: new Date('2024-11-25') },
    ];

    const handleApplyFilter = () => {
        if (fromDate && toDate) {
            const filtered = data.filter((item) =>
                item.date >= new Date(fromDate) && item.date <= new Date(toDate)
            );
            setFilteredData(filtered);
            setAnchorEl(null); // Close the dropdown
        } else {
            alert('Please select both From and To dates.');
        }
    };

    const handleDropdownOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDropdownClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Responsive Cards Example
            </Typography>

            {/* Grid Container */}
            <Grid 
                container 
                spacing={3} // Controls spacing between grid items
                style={{ 
                    width: '100%', 
                    margin: '0 auto', // Centers the grid container
                }}
            >
                {/* Render 6 Identical Cards */}
                {Array.from({ length: 6 }).map((_, index) => (
                    <Grid 
                        item 
                        xs={12}  // Full width on extra-small screens
                        sm={6}   // Two cards per row on small screens
                        md={4}   // Three cards per row on medium screens
                        lg={2}   // Six cards per row on large screens
                        key={index}
                        style={{ display: 'flex' }} // Ensures the grid item stretches
                    >
                        <Card 
                            style={{ 
                                backgroundColor: '#4caf50', 
                                color: 'white',
                                textAlign: 'center',
                                padding: '5px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                // height: '100%',
                                flex: 1, // Ensures the card stretches
                            }}
                        >
                            <CardContent>
                                <Typography variant="h5">Card Title</Typography>
                                <Typography variant="body1">
                                    This is an example card.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Custom Date Selection Example
            </Typography>

            {/* Dropdown for Custom Date */}
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDropdownOpen}
                    sx={{
                        fontSize: '0.85rem',
                        height: '40px', // Compact height
                        marginBottom: '10px', // Space below button
                    }}
                >
                    Custom
                </Button>
                
                <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleDropdownClose}
    anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
    }}
    transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
    }}
    MenuListProps={{
        style: { padding: '10px', width: '300px' },
    }}
>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MenuItem
            disableRipple
            sx={{
                "&:hover": {
                    backgroundColor: "transparent", // No background on hover
                },
                "&:focus": {
                    backgroundColor: "transparent", // No background on focus
                },
                "&.Mui-selected": {
                    backgroundColor: "transparent", // No background when selected
                },
                "&.Mui-selected:hover": {
                    backgroundColor: "transparent", // No background on hover when selected
                },
            }}
        >
            <DatePicker
                label="From"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        size="small" 
                        fullWidth 
                        sx={{
                            fontSize: '0.8rem',
                            marginBottom: '5px',
                        }}
                    />
                )}
            />
        </MenuItem>
        <MenuItem
            disableRipple
            sx={{
                "&:hover": {
                    backgroundColor: "transparent", // No background on hover
                },
                "&:focus": {
                    backgroundColor: "transparent", // No background on focus
                },
                "&.Mui-selected": {
                    backgroundColor: "transparent", // No background when selected
                },
                "&.Mui-selected:hover": {
                    backgroundColor: "transparent", // No background on hover when selected
                },
            }}
        >
            <DatePicker
                label="To"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        size="small" 
                        fullWidth 
                        sx={{
                            fontSize: '0.8rem',
                            marginBottom: '5px',
                        }}
                    />
                )}
            />
        </MenuItem>
        <MenuItem
            disableRipple
            sx={{
                "&:hover": {
                    backgroundColor: "transparent", // No background on hover
                },
                "&:focus": {
                    backgroundColor: "transparent", // No background on focus
                },
                "&.Mui-selected": {
                    backgroundColor: "transparent", // No background when selected
                },
                "&.Mui-selected:hover": {
                    backgroundColor: "transparent", // No background on hover when selected
                },
            }}
        >
            <Button
                variant="contained"
                color="primary"
                onClick={handleApplyFilter}
                size="small"
                sx={{
                    fontSize: '0.8rem',
                    width: '100%',
                }}
            >
                Apply
            </Button>
        </MenuItem>
    </LocalizationProvider>
</Menu>





            </div>

            {/* Display Filtered Results */}
            <Typography variant="h5" style={{ marginTop: '20px' }}>
                Filtered Results:
            </Typography>
            <Grid container spacing={2}>
                {filteredData.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{item.name}</Typography>
                                <Typography variant="body2">
                                    Date: {item.date.toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>

        </div>
    );
};

export default Problem;

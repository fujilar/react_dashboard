import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const Problem = () => {
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
        </div>
    );
};

export default Problem;

import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { format, subDays } from "date-fns";
import { Button, ButtonGroup, Typography, TextField, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { Grid } from "@mui/material";

import ChartDataLabels from "chartjs-plugin-datalabels";


ChartJS.register(LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

// Generate random incidents
const generateRandomIncidents = (count) => {
  const incidents = [];
  const statuses = ["Open", "In Progress", "Closed", "Unassigned"];
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

// chart 1.1.3
// Group incidents by date for SLA Trends
const groupIncidentsByDate = (incidents) => {
  const groupedData = {};
  incidents.forEach((incident) => {
    const dateKey = format(incident.date, "yyyy-MM-dd");
    if (!groupedData[dateKey]) {
      groupedData[dateKey] = { Met: 0, NotMet: 0 };
    }
    groupedData[dateKey][incident.sla]++;
  });
  return groupedData;
};

// chart 1.1.2
// Prepare SLA Trends Data
const prepareSLATrendData = (filteredIncidents, fromDate, toDate) => {
  const groupedData = groupIncidentsByDate(filteredIncidents);
  const dateRange = [];
  let currentDate = new Date(fromDate);

  while (currentDate <= toDate) {
    dateRange.push(format(currentDate, "yyyy-MM-dd"));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const metCounts = dateRange.map((date) => groupedData[date]?.Met || 0);
  const notMetCounts = dateRange.map((date) => groupedData[date]?.NotMet || 0);

  return {
    labels: dateRange,
    datasets: [
      {
        label: "SLA Met",
        data: metCounts,
        borderColor: "#2ecc71",
        backgroundColor: "#A3E4D7",
        fill: false,
        pointRadius: 2, // Smaller point radius
        pointHoverRadius: 3, // Hover effect point size
        borderWidth: 1, // Thinner line
        tension: 0.2, // Smaller curve tension
      },
      {
        label: "SLA Not Met",
        data: notMetCounts,
        borderColor: "#e74c3c",
        backgroundColor: "#F5B7B1",
        fill: false,
        pointRadius: 2, // Smaller point radius
        pointHoverRadius: 3, // Hover effect point size
        borderWidth: 1, // Thinner line
        tension: 0.2, // Smaller curve tension
      },
    ],
  };
};

// chart 1.2.1
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
          ticks: {
            autoSkip: false, // Forces all dates to display
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
  const groupedData = groupIncidentsByCategoryAndStatus(filteredIncidents);

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

const groupIncidentsByPriorityAndStatus = (incidents) => {
  const groupedData = {
    Critical: { Open: 0, "In Progress": 0, Closed: 0, Unassigned: 0 },
    High: { Open: 0, "In Progress": 0, Closed: 0, Unassigned: 0 },
    Moderate: { Open: 0, "In Progress": 0, Closed: 0, Unassigned: 0 },
    Low: { Open: 0, "In Progress": 0, Closed: 0, Unassigned: 0 },
    Planning: { Open: 0, "In Progress": 0, Closed: 0, Unassigned: 0 },
  };

  incidents.forEach((incident) => {
    if (groupedData[incident.priority]) {
      groupedData[incident.priority][incident.status]++;
    }
  });
  return groupedData;
};

// Prepare Vertical Bar Chart for Priorities
const preparePriorityChartData = (groupedData) => {
  return {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: "Open",
        data: Object.values(groupedData).map((priority) => priority.Open),
        backgroundColor: "#3498db",
      },
      {
        label: "In Progress",
        data: Object.values(groupedData).map((priority) => priority["In Progress"]),
        backgroundColor: "#f39c12",
      },
      {
        label: "Closed",
        data: Object.values(groupedData).map((priority) => priority.Closed),
        backgroundColor: "#2ecc71",
      },
      {
        label: "Unassigned",
        data: Object.values(groupedData).map((priority) => priority.Unassigned),
        backgroundColor: "#e74c3c",
      },
    ],
  };
};

const priorityBarChartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Allows the chart to resize dynamically
  plugins: {
    legend: { position: "top" },
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


// Filter incidents not updated in the last 7 days
const filterIncidentsNotUpdated = (incidents) => {
  const sevenDaysAgo = subDays(new Date(), 7);
  return incidents.filter((incident) => incident.lastUpdated < sevenDaysAgo);
};

// Get count of incidents not updated in 7 days
const incidentsNotUpdated = filterIncidentsNotUpdated(sampleIncidents);
const countNotUpdated = incidentsNotUpdated.length;


const SLAChart = () => {
  const [fromDate, setFromDate] = useState(subDays(new Date(), 30));
  const [toDate, setToDate] = useState(new Date());
  const [filter, setFilter] = useState("30 Days");
  const [tempFromDate, setTempFromDate] = useState(null);
  const [tempToDate, setTempToDate] = useState(null);

  const handleFilter = (filterType) => {
    setFilter(filterType);
    const today = new Date();
    switch (filterType) {
      case "Today":
        setFromDate(today);
        setToDate(today);
        break;
      case "7 Days":
        setFromDate(subDays(today, 7));
        setToDate(today);
        break;
      case "30 Days":
        setFromDate(subDays(today, 30));
        setToDate(today);
        break;
      default:
        break;
    }
  };

  const handleCustomFilter = () => {
    if (tempFromDate && tempToDate) {
      setFromDate(tempFromDate);
      setToDate(tempToDate);
      setFilter("Custom");
    }
  };

  const filteredIncidents = sampleIncidents.filter(
    (incident) => incident.date >= fromDate && incident.date <= toDate
  );

  // chart 1.1.1
  const slaTrendData = prepareSLATrendData(filteredIncidents, fromDate, toDate);

  // chart 2.1.1
  const stackedBarChartData = prepareStackedBarChartData(filteredIncidents);

  

  const groupedData = groupIncidentsByPriorityAndStatus(filteredIncidents);
  const priorityBarChartData = preparePriorityChartData(groupedData);
  
  const openIncidentsMoreThan30Days = sampleIncidents.filter(
    (incident) => 
      incident.status !== "Closed" && 
      incident.date <= subDays(new Date(), 30)
  ).length;

  // Filter for Unassigned Incidents
const getUnassignedIncidentsCount = (incidents) => {
  return incidents.filter((incident) => incident.status === "Unassigned").length;
};

// Dynamically get unassigned count
const unassignedCount = getUnassignedIncidentsCount(filteredIncidents);

  return (
    <div style={{ padding: "20px" }}>

      {/* Title */}
      <Typography variant="h6" gutterBottom>
        SLA Trends & Incident Categories
      </Typography>

      {/* Filter Buttons */}
      <ButtonGroup>
        <Button variant={filter === "Today" ? "contained" : "outlined"} onClick={() => handleFilter("Today")}>
          Today
        </Button>
        <Button variant={filter === "7 Days" ? "contained" : "outlined"} onClick={() => handleFilter("7 Days")}>
          Last 7 Days
        </Button>
        <Button variant={filter === "30 Days" ? "contained" : "outlined"} onClick={() => handleFilter("30 Days")}>
          Last 30 Days
        </Button>
        <Button variant={filter === "Custom" ? "contained" : "outlined"} onClick={() => setFilter("Custom")}>
          Custom
        </Button>
      </ButtonGroup>

      {filter === "Custom" && (
        <Box mt={2} display="flex" alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="From Date"
            value={tempFromDate}
            onChange={(newValue) => setTempFromDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="To Date"
            value={tempToDate}
            onChange={(newValue) => setTempToDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />

          </LocalizationProvider>
          <Button onClick={handleCustomFilter} variant="contained" color="primary" style={{ marginLeft: "10px" }}>
            Apply
          </Button>
        </Box>
      )}

      {/*Row 1*/}
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
                  <Typography variant="subtitle1">SLA Trends</Typography>
                  <div style={{ height: '260px', width: '100%' }}>
                  <Line data={slaTrendData} options={slaChartOptions} />
                  </div>
              </div>
          </Grid>
          
          {/* right */}
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
                  <Typography variant="subtitle1">Incident Categories</Typography>
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
                      // marginRight: '10px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      marginBottom: '10px',
                  }}
              >
                  <Typography variant="subtitle1">Incident Grouped (Priority Status)</Typography>
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
            style={{
              padding: "10px 20px", // Reduced padding for tighter layout
              borderRadius: "8px",
              boxSizing: "border-box",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              height: "120px", // Slightly increased height for better spacing
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Space between the left and right sections
              width: "100%",
            }}
          >
            {/* Left Section: Title and Subtitle */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 }}>
              <span style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "5px" }}>Overdue Incidents</span>
              <span style={{ fontSize: "12px", color: "grey" }}>More than 30 days</span>
            </div>

            {/* Right Section: Count and Date Range */}
            <div
              style={{
                display: "flex",
                flexDirection: "column", // Stack the count and date range vertically
                alignItems: "flex-end", // Align to the right
                justifyContent: "center", // Vertically center the content
              }}
            >
              {/* Count */}
              <span
                style={{
                  fontSize: "30px", // Increased size for emphasis
                  color: "#2196F3",
                  fontWeight: "bold",
                  lineHeight: "1",
                  marginBottom: "5px", // Space between count and date range
                }}
              >
                {openIncidentsMoreThan30Days}
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


            
          </div>

          {/* Stale Incidents */}
          <div
            style={{
              padding: "20px",
              borderRadius: "8px",
              boxSizing: "border-box",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              height: "106px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Space between left and right sections
            }}
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
                {`${new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })} - ${new Date().toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}`}
              </span>
            </div>
          </div>

          {/* Unassigned Incidents */}
          <div
            style={{
              padding: "20px",
              borderRadius: "8px",
              boxSizing: "border-box",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              height: "106px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Left Section: Title and Subtitle */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 }}>
              <span style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "5px" }}>Unassigned</span>
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

    </div>
  );
};

export default SLAChart;

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
    const randomDays = Math.floor(Math.random() * 30);
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
    });
  }
  return incidents;
};

const sampleIncidents = generateRandomIncidents(100);

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
        pointRadius: 5,
        tension: 0.4,
      },
      {
        label: "SLA Not Met",
        data: notMetCounts,
        borderColor: "#e74c3c",
        backgroundColor: "#F5B7B1",
        fill: false,
        pointRadius: 5,
        tension: 0.4,
      },
    ],
  };
};

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
  
    // Calculate percentages correctly per category
    Object.keys(groupedData).forEach((category) => {
      const total = Object.values(groupedData[category]).reduce((sum, val) => sum + val, 0);
      Object.keys(groupedData[category]).forEach((status) => {
        groupedData[category][status] = total > 0
          ? parseFloat(((groupedData[category][status] / total) * 100).toFixed(1)) // Fix precision
          : 0;
      });
    });
  
    return groupedData;
  };

// Prepare Stacked Bar Chart Data
const prepareStackedBarChartData = (filteredIncidents) => {
  const groupedData = groupIncidentsByCategoryAndStatus(filteredIncidents);

  return {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: "Open",
        data: Object.values(groupedData).map((category) => category.Open),
        backgroundColor: "#3498db",
      },
      {
        label: "In Progress",
        data: Object.values(groupedData).map((category) => category["In Progress"]),
        backgroundColor: "#1abc9c",
      },
      {
        label: "Closed",
        data: Object.values(groupedData).map((category) => category.Closed),
        backgroundColor: "#2ecc71",
      },
      {
        label: "Unassigned",
        data: Object.values(groupedData).map((category) => category.Unassigned),
        backgroundColor: "#f39c12",
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

  const slaTrendData = prepareSLATrendData(filteredIncidents, fromDate, toDate);
  const stackedBarChartData = prepareStackedBarChartData(filteredIncidents);

  const stackedBarChartOptions = {
    responsive: true,
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

  const groupedData = groupIncidentsByPriorityAndStatus(filteredIncidents);
  const priorityBarChartData = preparePriorityChartData(groupedData);
  
  return (
    <div style={{ padding: "20px" }}>
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

      {/* Charts */}
      <Box mt={4} display="flex" gap={4}>
        <div style={{ flex: 1 }}>
          <Typography variant="subtitle1">SLA Trends</Typography>
          <Line data={slaTrendData} />
        </div>
        <div style={{ flex: 1 }}>
          <Typography variant="subtitle1">Incident Categories</Typography>
          <Bar data={stackedBarChartData} options={stackedBarChartOptions} />
        </div>
      </Box>

      <Box mt={4} display="flex" gap={4}>
        <div style={{ flex: 1 }}>
          <Typography variant="subtitle1">Incident Grouped (Priority Status)</Typography>
          <Bar data={priorityBarChartData}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Typography variant="subtitle1">Incident Categories</Typography>
          <Bar data={stackedBarChartData} options={stackedBarChartOptions} />
        </div>
      </Box>

    </div>
  );
};

export default SLAChart;

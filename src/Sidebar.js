import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportIcon from '@mui/icons-material/Report';
import BugReportIcon from '@mui/icons-material/BugReport';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';


const Sidebar = () => {
    const menuItems = [
        { text: 'ITSM Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Incidents', icon: <ReportIcon />, path: '/incidents' },
        { text: 'Problem Management', icon: <BugReportIcon />, path: '/problems' },
        { text: 'Change Request', icon: <ChangeCircleIcon />, path: '/changes' }
    ];

    return (
        <div style={{ width: '250px', height: '100vh', backgroundColor: '#f5f5f5', color: 'black' }}>
            {menuItems.map((item, index) => (
                <List>
                    <ListItem 
                        button component={Link} to={item.path} key={index}>
                        <ListItemIcon style={{ color: 'black' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                </List>
            ))}
        </div>
    );
}

export default Sidebar;
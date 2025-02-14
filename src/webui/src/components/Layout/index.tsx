import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <TopBar
        drawerWidth={drawerWidth}
        sidebarOpen={sidebarOpen}
        onDrawerToggle={handleDrawerToggle}
      />

      {/* Sidebar Navigation */}
      <Sidebar drawerWidth={drawerWidth} sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px',
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

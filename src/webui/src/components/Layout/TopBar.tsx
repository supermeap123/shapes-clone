import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  styled,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useDispatch, useAppSelector } from '../../store';
import { toggleDarkMode } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';

interface TopBarProps {
  drawerWidth: number;
  sidebarOpen: boolean;
  onDrawerToggle: () => void;
}

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'drawerWidth',
})<{ drawerWidth: number }>(({ theme, drawerWidth }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: `${drawerWidth}px`,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

const TopBar: React.FC<TopBarProps> = ({
  drawerWidth,
  sidebarOpen,
  onDrawerToggle,
}) => {
  const dispatch = useDispatch();
  const { darkMode } = useAppSelector((state) => state.ui);

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <StyledAppBar position="fixed" drawerWidth={drawerWidth}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={onDrawerToggle}
          edge="start"
          sx={{ mr: 2, ...(sidebarOpen && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Shapes Admin
        </Typography>

        <IconButton color="inherit" onClick={handleDarkModeToggle}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        <Button
          color="inherit"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{ ml: 1 }}
        >
          Logout
        </Button>
      </Toolbar>
    </StyledAppBar>
  );
};

export default TopBar;

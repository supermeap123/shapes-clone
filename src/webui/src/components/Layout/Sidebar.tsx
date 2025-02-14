import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon,
  AutoFixHigh as FreeWillIcon,
  School as KnowledgeIcon,
  Build as TrainingIcon,
  Memory as AIEngineIcon,
  Image as ImageEngineIcon,
  RecordVoiceOver as VoiceEngineIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

interface StyledDrawerProps {
  drawerWidth: number;
}

interface MenuItemProps {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'drawerWidth',
})<StyledDrawerProps>(({ theme, drawerWidth }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const menuItems: MenuItemProps[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  { text: 'Personality', icon: <PsychologyIcon />, path: '/personality' },
  { text: 'Free Will', icon: <FreeWillIcon />, path: '/freewill' },
  { text: 'Knowledge', icon: <KnowledgeIcon />, path: '/knowledge' },
  { text: 'Training', icon: <TrainingIcon />, path: '/training' },
  { text: 'AI Engine', icon: <AIEngineIcon />, path: '/ai-engine' },
  { text: 'Image Engine', icon: <ImageEngineIcon />, path: '/image-engine' },
  { text: 'Voice Engine', icon: <VoiceEngineIcon />, path: '/voice-engine' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

interface SidebarProps {
  drawerWidth: number;
  sidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth, sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const shapeId = location.pathname.split('/')[2];

  const getItemPath = (basePath: string) => {
    if (basePath === '/') return basePath;
    return shapeId ? `/shapes/${shapeId}${basePath}` : basePath;
  };

  return (
    <StyledDrawer
      variant="permanent"
      open={sidebarOpen}
      drawerWidth={drawerWidth}
    >
      <List sx={{ mt: '64px' }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(getItemPath(item.path))}
            selected={location.pathname.includes(item.path)}
            sx={{
              mb: 1,
              mx: 1,
              borderRadius: 1,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: location.pathname.includes(item.path)
                  ? 'primary.contrastText'
                  : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                color: location.pathname.includes(item.path)
                  ? 'primary.contrastText'
                  : 'inherit',
              }}
            />
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;

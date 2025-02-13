import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  styled,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as ProfileIcon,
  Psychology as PersonalityIcon,
  AutoFixHigh as FreeWillIcon,
  School as KnowledgeIcon,
  MenuBook as TrainingIcon,
  Memory as AIEngineIcon,
  Image as ImageEngineIcon,
  RecordVoiceOver as VoiceEngineIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface SidebarProps {
  drawerWidth: number;
}

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: props => props.drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: props => props.drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Profile', icon: <ProfileIcon />, path: '/shapes/:shapeId/profile' },
  { text: 'Personality', icon: <PersonalityIcon />, path: '/shapes/:shapeId/personality' },
  { text: 'Free Will', icon: <FreeWillIcon />, path: '/shapes/:shapeId/freewill' },
  { text: 'Knowledge', icon: <KnowledgeIcon />, path: '/shapes/:shapeId/knowledge' },
  { text: 'Training', icon: <TrainingIcon />, path: '/shapes/:shapeId/training' },
  { text: 'AI Engine', icon: <AIEngineIcon />, path: '/shapes/:shapeId/ai-engine' },
  { text: 'Image Engine', icon: <ImageEngineIcon />, path: '/shapes/:shapeId/image-engine' },
  { text: 'Voice Engine', icon: <VoiceEngineIcon />, path: '/shapes/:shapeId/voice-engine' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/shapes/:shapeId/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { currentShape } = useSelector((state: RootState) => state.shapes);

  const handleNavigation = (path: string) => {
    if (currentShape) {
      const actualPath = path.replace(':shapeId', currentShape._id);
      navigate(actualPath);
    } else if (path === '/') {
      navigate(path);
    }
  };

  const isCurrentPath = (path: string) => {
    if (currentShape) {
      const actualPath = path.replace(':shapeId', currentShape._id);
      return location.pathname === actualPath;
    }
    return location.pathname === path;
  };

  return (
    <StyledDrawer
      variant="permanent"
      open={sidebarOpen}
      drawerWidth={drawerWidth}
    >
      <List sx={{ mt: '64px' }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem
              button
              onClick={() => handleNavigation(item.path)}
              selected={isCurrentPath(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main + '20',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '30',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isCurrentPath(item.path)
                    ? theme.palette.primary.main
                    : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: isCurrentPath(item.path)
                    ? theme.palette.primary.main
                    : 'inherit',
                }}
              />
            </ListItem>
            {item.text === 'Dashboard' && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;

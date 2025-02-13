import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)', // Account for AppBar height
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" color="primary" sx={{ mb: 2, fontSize: '6rem' }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/')}
        sx={{
          borderRadius: theme.shape.borderRadius,
          textTransform: 'none',
          px: 4,
          py: 1,
        }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;

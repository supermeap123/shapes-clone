import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapes } from '../../store/slices/shapesSlice';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shapes, loading } = useAppSelector((state) => state.shapes);

  useEffect(() => {
    dispatch(fetchShapes());
  }, [dispatch]);

  const handleShapeClick = (shapeId: string) => {
    navigate(`/shapes/${shapeId}/profile`);
  };

  const handleCreateShape = () => {
    // TODO: Implement shape creation
    console.log('Create new shape');
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading shapes...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Shapes Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateShape}
        >
          Create Shape
        </Button>
      </Box>

      <Grid container spacing={3}>
        {shapes.map((shape) => (
          <Grid item xs={12} sm={6} md={4} key={shape._id}>
            <Card
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease',
                },
              }}
              onClick={() => handleShapeClick(shape._id)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {shape.profile.nickname || 'Unnamed Shape'}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {shape.profile.description || 'No description'}
                </Typography>
                <Typography variant="body2">
                  AI Engine: {shape.aiEngine.primaryEngine || 'Not configured'}
                </Typography>
                <Typography variant="body2">
                  Voice: {shape.voiceEngine.voiceResponses ? 'Enabled' : 'Disabled'}
                </Typography>
                <Typography variant="body2">
                  Free Will: {shape.freeWill.levelOfFreeWill || 'Not set'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {shapes.length === 0 && (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                No Shapes Found
              </Typography>
              <Typography color="textSecondary" paragraph>
                Create your first AI personality to get started.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateShape}
              >
                Create Shape
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;

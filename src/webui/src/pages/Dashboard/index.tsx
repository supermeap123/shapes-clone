import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
} from '@mui/material';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapes, createShape } from '../../store/slices/shapesSlice';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shapes, loading } = useAppSelector((state) => state.shapes);

  useEffect(() => {
    dispatch(fetchShapes());
  }, [dispatch]);

  const handleCreateShape = async () => {
    try {
      const resultAction = await dispatch(createShape()).unwrap();
      console.log('Create shape response:', resultAction);

      // Check if resultAction is a promise rejection
      if (resultAction instanceof Error) {
        console.error('Failed to create shape:', resultAction.message);
        return;
      }
      
      // Extract the shape data from the response
      const shapeData = resultAction && typeof resultAction === 'object' ? resultAction : null;
      
      // Check if we have a valid shape with an _id
      if (shapeData && '_id' in shapeData) {
        // Ensure we have a string ID
        const shapeId = String(shapeData._id);
        navigate(`/shapes/${shapeId}/profile`);
      } else {
        console.error('Invalid shape response:', resultAction);
      }
    } catch (error) {
      console.error('Failed to create shape:', error);
    }
  };

  const handleShapeClick = (shapeId: string) => {
    if (shapeId) {
      navigate(`/shapes/${shapeId}/profile`);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Shapes Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateShape}
          disabled={loading}
        >
          Create Shape
        </Button>
      </Box>

      {shapes.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              No Shapes Found
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Create your first AI personality to get started.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateShape}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Create Shape
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {shapes.map((shape) => (
            <Grid item xs={12} sm={6} md={4} key={shape._id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
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
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;

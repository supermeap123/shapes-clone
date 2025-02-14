import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapeById, updateShape } from '../../store/slices/shapesSlice';

const imageEngines = [
  'stable-diffusion-xl',
  'dall-e-3',
  'midjourney',
];

const defaultSizes = [
  { width: 512, height: 512, format: 'png' },
  { width: 768, height: 768, format: 'png' },
  { width: 1024, height: 1024, format: 'png' },
];

const ImageEngine: React.FC = () => {
  const { shapeId } = useParams<{ shapeId: string }>();
  const dispatch = useDispatch();
  const { currentShape, loading } = useAppSelector((state) => state.shapes);
  const [textCommandPrefix, setTextCommandPrefix] = useState('!imagine');
  const [selectedEngine, setSelectedEngine] = useState('');
  const [imagePreset, setImagePreset] = useState('');
  const [imageSizes, setImageSizes] = useState(defaultSizes);

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [shapeId, dispatch]);

  useEffect(() => {
    if (currentShape) {
      setTextCommandPrefix(currentShape.imageEngine.textCommandPrefix || '!imagine');
      setSelectedEngine(currentShape.imageEngine.engine || '');
      setImagePreset(currentShape.imageEngine.preset || '');
      setImageSizes(currentShape.imageEngine.sizes ? defaultSizes.map(size => ({
        ...size,
        format: 'png'
      })) : defaultSizes);
    }
  }, [currentShape]);

  const handleSave = () => {
    if (shapeId && currentShape) {
      dispatch(updateShape({
        shapeId,
        updates: {
          imageEngine: {
            ...currentShape.imageEngine,
            textCommandPrefix,
            engine: selectedEngine,
            preset: imagePreset,
            sizes: imageSizes.map(size => `${size.width}x${size.height}`),
          }
        }
      }));
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Image Engine Settings
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Text Command Prefix"
              value={textCommandPrefix}
              onChange={(e) => setTextCommandPrefix(e.target.value)}
              helperText="Command used to generate images (e.g., !imagine)"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Image Engine</InputLabel>
              <Select
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value)}
                label="Image Engine"
              >
                {imageEngines.map((engine) => (
                  <MenuItem key={engine} value={engine}>
                    {engine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image Preset"
              value={imagePreset}
              onChange={(e) => setImagePreset(e.target.value)}
              multiline
              rows={4}
              helperText="Default prompt template for image generation"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Available Image Sizes
            </Typography>
            {imageSizes.map((size, index) => (
              <Typography key={index} variant="body1">
                {size.width}x{size.height} ({size.format})
              </Typography>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ImageEngine;

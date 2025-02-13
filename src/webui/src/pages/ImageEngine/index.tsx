import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapeById, updateShape } from '../../store/slices/shapesSlice';

const imageEngines = [
  'stable-diffusion-xl',
  'stable-diffusion-2.1',
  'dall-e-3',
  'dall-e-2',
  'midjourney',
];

const defaultSizes = [
  { width: 512, height: 512, format: 'png' },
  { width: 768, height: 768, format: 'png' },
  { width: 1024, height: 1024, format: 'png' },
  { width: 1024, height: 576, format: 'png' },
  { width: 576, height: 1024, format: 'png' },
];

interface SizeDialogState {
  open: boolean;
  size: {
    width: number;
    height: number;
    format: string;
  };
  isEdit: boolean;
  editIndex?: number;
}

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
  }, [dispatch, shapeId]);

  useEffect(() => {
    if (currentShape) {
      setTextCommandPrefix(currentShape.imageEngine.textCommandPrefix || '!imagine');
      setSelectedEngine(currentShape.imageEngine.imageEngine || '');
      setImagePreset(currentShape.imageEngine.imagePreset || '');
      setImageSizes(currentShape.imageEngine.imageSizeOptions || defaultSizes);
    }
  }, [currentShape]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (currentShape && shapeId) {
      dispatch(updateShape({
        shapeId,
        data: {
          imageEngine: {
            ...currentShape.imageEngine,
            textCommandPrefix,
            imageEngine: selectedEngine,
            imagePreset,
            imageSizeOptions: imageSizes,
          }
        }
      }));
    }
  };

  if (loading || !currentShape) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading image engine settings...</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Image Engine Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Basic Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Text Command Prefix"
                    value={textCommandPrefix}
                    onChange={(e) => setTextCommandPrefix(e.target.value)}
                    helperText="Command used to generate images (e.g., !imagine)"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Image Engine</InputLabel>
                    <Select
                      value={selectedEngine}
                      label="Image Engine"
                      onChange={(e) => setSelectedEngine(e.target.value)}
                    >
                      {imageEngines.map((engine) => (
                        <MenuItem key={engine} value={engine}>
                          {engine.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Image Preset */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6">
                  Image Preset
                </Typography>
                <Tooltip title="Custom prompt template used as a base for image generation">
                  <InfoIcon color="action" sx={{ fontSize: 20 }} />
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={imagePreset}
                onChange={(e) => setImagePreset(e.target.value)}
                placeholder="Enter a base prompt template for image generation..."
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Image Sizes */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Image Sizes
              </Typography>
              <List>
                {imageSizes.map((size, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={`${size.width}x${size.height}`}
                      secondary={`Format: ${size.format.toUpperCase()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="contained" color="primary" type="submit">
              Save Changes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageEngine;

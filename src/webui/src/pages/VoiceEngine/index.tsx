import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Tooltip,
  Alert,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapeById, updateShape } from '../../store/slices/shapesSlice';

const voiceEngines = [
  'elevenlabs',
  'amazon-polly',
  'google-cloud-tts',
  'azure-cognitive-services',
  'coqui-ai',
];

const voiceStyles = [
  'natural',
  'cheerful',
  'serious',
  'professional',
  'friendly',
  'casual',
];

const VoiceEngine: React.FC = () => {
  const { shapeId } = useParams<{ shapeId: string }>();
  const dispatch = useDispatch();
  const { currentShape, loading } = useAppSelector((state) => state.shapes);
  const [voiceResponses, setVoiceResponses] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [pitch, setPitch] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [stability, setStability] = useState(0.5);
  const [similarity, setSimilarity] = useState(0.75);

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [dispatch, shapeId]);

  useEffect(() => {
    if (currentShape) {
      setVoiceResponses(currentShape.voiceEngine.voiceResponses || false);
      // Additional voice settings could be added to the shape interface
      setSelectedEngine(currentShape.voiceEngine.engine || '');
      setSelectedStyle(currentShape.voiceEngine.style || '');
      setPitch(currentShape.voiceEngine.pitch || 1);
      setSpeed(currentShape.voiceEngine.speed || 1);
      setStability(currentShape.voiceEngine.stability || 0.5);
      setSimilarity(currentShape.voiceEngine.similarity || 0.75);
    }
  }, [currentShape]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (currentShape && shapeId) {
      dispatch(updateShape({
        shapeId,
        data: {
          voiceEngine: {
            ...currentShape.voiceEngine,
            voiceResponses,
            engine: selectedEngine,
            style: selectedStyle,
            pitch,
            speed,
            stability,
            similarity,
          }
        }
      }));
    }
  };

  if (loading || !currentShape) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading voice engine settings...</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Voice Engine Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Basic Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6">
                  Basic Settings
                </Typography>
                <Tooltip title="Configure voice response settings">
                  <InfoIcon color="action" sx={{ fontSize: 20 }} />
                </Tooltip>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={voiceResponses}
                        onChange={(e) => setVoiceResponses(e.target.checked)}
                      />
                    }
                    label="Enable Voice Responses"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Voice Engine</InputLabel>
                    <Select
                      value={selectedEngine}
                      label="Voice Engine"
                      onChange={(e) => setSelectedEngine(e.target.value)}
                      disabled={!voiceResponses}
                    >
                      {voiceEngines.map((engine) => (
                        <MenuItem key={engine} value={engine}>
                          {engine.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Voice Style</InputLabel>
                    <Select
                      value={selectedStyle}
                      label="Voice Style"
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      disabled={!voiceResponses}
                    >
                      {voiceStyles.map((style) => (
                        <MenuItem key={style} value={style}>
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Voice Parameters */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Voice Parameters
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Pitch</Typography>
                  <Slider
                    value={pitch}
                    onChange={(_, value) => setPitch(value as number)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    marks={[
                      { value: 0.5, label: '0.5x' },
                      { value: 1, label: '1x' },
                      { value: 2, label: '2x' },
                    ]}
                    valueLabelDisplay="auto"
                    disabled={!voiceResponses}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Speed</Typography>
                  <Slider
                    value={speed}
                    onChange={(_, value) => setSpeed(value as number)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    marks={[
                      { value: 0.5, label: '0.5x' },
                      { value: 1, label: '1x' },
                      { value: 2, label: '2x' },
                    ]}
                    valueLabelDisplay="auto"
                    disabled={!voiceResponses}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Stability</Typography>
                  <Slider
                    value={stability}
                    onChange={(_, value) => setStability(value as number)}
                    min={0}
                    max={1}
                    step={0.05}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 0.5, label: '0.5' },
                      { value: 1, label: '1' },
                    ]}
                    valueLabelDisplay="auto"
                    disabled={!voiceResponses}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Similarity</Typography>
                  <Slider
                    value={similarity}
                    onChange={(_, value) => setSimilarity(value as number)}
                    min={0}
                    max={1}
                    step={0.05}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 0.75, label: '0.75' },
                      { value: 1, label: '1' },
                    ]}
                    valueLabelDisplay="auto"
                    disabled={!voiceResponses}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Premium Notice */}
        <Grid item xs={12}>
          <Alert severity="info">
            Voice responses require a premium subscription. Make sure you have an active subscription
            to use this feature.
          </Alert>
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

export default VoiceEngine;

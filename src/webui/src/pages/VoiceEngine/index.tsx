import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  FormControlLabel,
  Switch,
  Slider,
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

const voiceEngines = [
  'elevenlabs',
  'azure-tts',
  'aws-polly',
];

const voiceStyles = [
  'natural',
  'formal',
  'casual',
  'cheerful',
  'serious',
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
  }, [shapeId, dispatch]);

  useEffect(() => {
    if (currentShape) {
      setVoiceResponses(currentShape.voiceEngine.voiceResponses || false);
      setSelectedEngine(currentShape.voiceEngine.engine || '');
      setSelectedStyle(currentShape.voiceEngine.style || '');
      setPitch(currentShape.voiceEngine.pitch || 1);
      setSpeed(currentShape.voiceEngine.speed || 1);
      setStability(currentShape.voiceEngine.stability || 0.5);
      setSimilarity(currentShape.voiceEngine.similarity || 0.75);
    }
  }, [currentShape]);

  const handleSave = () => {
    if (shapeId && currentShape) {
      dispatch(updateShape({
        shapeId,
        updates: {
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

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Voice Engine Settings
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
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

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Voice Engine</InputLabel>
              <Select
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value)}
                label="Voice Engine"
              >
                {voiceEngines.map((engine) => (
                  <MenuItem key={engine} value={engine}>
                    {engine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Voice Style</InputLabel>
              <Select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                label="Voice Style"
              >
                {voiceStyles.map((style) => (
                  <MenuItem key={style} value={style}>
                    {style}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Pitch</Typography>
            <Slider
              value={pitch}
              onChange={(_, value) => setPitch(value as number)}
              min={0.5}
              max={2}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Speed</Typography>
            <Slider
              value={speed}
              onChange={(_, value) => setSpeed(value as number)}
              min={0.5}
              max={2}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Stability</Typography>
            <Slider
              value={stability}
              onChange={(_, value) => setStability(value as number)}
              min={0}
              max={1}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Similarity</Typography>
            <Slider
              value={similarity}
              onChange={(_, value) => setSimilarity(value as number)}
              min={0}
              max={1}
              step={0.05}
              valueLabelDisplay="auto"
            />
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

export default VoiceEngine;

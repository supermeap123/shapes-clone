import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
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

const aiEngines = [
  'gpt-4-turbo',
  'gpt-4',
  'gpt-3.5-turbo',
  'claude-2',
  'claude-instant',
];

const languagePresets = [
  'casual',
  'formal',
  'roleplay',
  'technical',
  'creative',
];

const enginePresets = [
  'balanced',
  'creative',
  'precise',
  'fast',
];

const AIEngine: React.FC = () => {
  const { shapeId } = useParams<{ shapeId: string }>();
  const dispatch = useDispatch();
  const { currentShape, loading } = useAppSelector((state) => state.shapes);
  const [primaryEngine, setPrimaryEngine] = useState('');
  const [fallbackEngine, setFallbackEngine] = useState('');
  const [freeWillEngine, setFreeWillEngine] = useState('');
  const [selectedLanguagePreset, setSelectedLanguagePreset] = useState('');
  const [selectedEnginePreset, setSelectedEnginePreset] = useState('');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.9);
  const [maxResponseLength, setMaxResponseLength] = useState<number>(2000);
  const [contextWindow, setContextWindow] = useState<number>(4000);
  const [memorySettings, setMemorySettings] = useState({
    shortTerm: true,
    longTerm: true,
    generation: true,
    recall: true,
    sharing: false,
  });

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [shapeId, dispatch]);

  useEffect(() => {
    if (currentShape) {
      setPrimaryEngine(currentShape.aiEngine.primaryEngine || '');
      setFallbackEngine(currentShape.aiEngine.fallbackEngine || '');
      setFreeWillEngine(currentShape.aiEngine.freeWillEngine || '');
      setSelectedLanguagePreset(currentShape.aiEngine.languagePresets?.[0] || '');
      setSelectedEnginePreset(currentShape.aiEngine.enginePresets?.[0] || '');
      setTemperature(currentShape.aiEngine.temperature || 0.7);
      setTopP(currentShape.aiEngine.topP || 0.9);
      setMaxResponseLength(currentShape.aiEngine.maxResponseLength || 2000);
      setContextWindow(currentShape.aiEngine.contextWindow || 4000);
      setMemorySettings({
        ...memorySettings,
        ...currentShape.aiEngine.memorySettings,
      });
    }
  }, [currentShape]);

  const handleSave = () => {
    if (shapeId && currentShape) {
      dispatch(updateShape({
        shapeId,
        updates: {
          aiEngine: {
            ...currentShape.aiEngine,
            primaryEngine,
            fallbackEngine,
            freeWillEngine,
            languagePresets: [selectedLanguagePreset],
            enginePresets: [selectedEnginePreset],
            temperature,
            topP,
            maxResponseLength,
            contextWindow,
            memorySettings,
          }
        }
      }));
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        AI Engine Settings
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Primary AI Engine</InputLabel>
              <Select
                value={primaryEngine}
                onChange={(e) => setPrimaryEngine(e.target.value)}
                label="Primary AI Engine"
              >
                {aiEngines.map((engine) => (
                  <MenuItem key={engine} value={engine}>
                    {engine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Fallback AI Engine</InputLabel>
              <Select
                value={fallbackEngine}
                onChange={(e) => setFallbackEngine(e.target.value)}
                label="Fallback AI Engine"
              >
                {aiEngines.map((engine) => (
                  <MenuItem key={engine} value={engine}>
                    {engine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Free Will Engine</InputLabel>
              <Select
                value={freeWillEngine}
                onChange={(e) => setFreeWillEngine(e.target.value)}
                label="Free Will Engine"
              >
                {aiEngines.map((engine) => (
                  <MenuItem key={engine} value={engine}>
                    {engine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Language Preset</InputLabel>
              <Select
                value={selectedLanguagePreset}
                onChange={(e) => setSelectedLanguagePreset(e.target.value)}
                label="Language Preset"
              >
                {languagePresets.map((preset) => (
                  <MenuItem key={preset} value={preset}>
                    {preset}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Engine Preset</InputLabel>
              <Select
                value={selectedEnginePreset}
                onChange={(e) => setSelectedEnginePreset(e.target.value)}
                label="Engine Preset"
              >
                {enginePresets.map((preset) => (
                  <MenuItem key={preset} value={preset}>
                    {preset}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Temperature</Typography>
            <Slider
              value={temperature}
              onChange={(_, value) => setTemperature(value as number)}
              min={0}
              max={1.5}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Top P</Typography>
            <Slider
              value={topP}
              onChange={(_, value) => setTopP(value as number)}
              min={0}
              max={1}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Max Response Length</Typography>
            <Slider
              value={maxResponseLength}
              onChange={(_, value) => setMaxResponseLength(value as number)}
              min={100}
              max={4000}
              step={100}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Context Window</Typography>
            <Slider
              value={contextWindow}
              onChange={(_, value) => setContextWindow(value as number)}
              min={1000}
              max={8000}
              step={1000}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Memory Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={memorySettings.shortTerm}
                  onChange={(e) =>
                    setMemorySettings({
                      ...memorySettings,
                      shortTerm: e.target.checked,
                    })
                  }
                />
              }
              label="Short-Term Memory"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={memorySettings.longTerm}
                  onChange={(e) =>
                    setMemorySettings({
                      ...memorySettings,
                      longTerm: e.target.checked,
                    })
                  }
                />
              }
              label="Long-Term Memory"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={memorySettings.generation}
                  onChange={(e) =>
                    setMemorySettings({
                      ...memorySettings,
                      generation: e.target.checked,
                    })
                  }
                />
              }
              label="Memory Generation"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={memorySettings.recall}
                  onChange={(e) =>
                    setMemorySettings({
                      ...memorySettings,
                      recall: e.target.checked,
                    })
                  }
                />
              }
              label="Memory Recall"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={memorySettings.sharing}
                  onChange={(e) =>
                    setMemorySettings({
                      ...memorySettings,
                      sharing: e.target.checked,
                    })
                  }
                />
              }
              label="Memory Sharing"
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

export default AIEngine;

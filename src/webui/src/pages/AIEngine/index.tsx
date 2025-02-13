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
  Switch,
  FormControlLabel,
  Slider,
  Tooltip,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
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
  'academic',
  'creative',
  'technical',
];

const enginePresets = [
  'balanced',
  'creative',
  'precise',
  'fast',
  'efficient',
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
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [maxResponseLength, setMaxResponseLength] = useState(2000);
  const [contextWindow, setContextWindow] = useState(4000);
  const [memorySettings, setMemorySettings] = useState({
    shortTermEnabled: true,
    longTermEnabled: true,
    memoryGeneration: true,
    memoryRecall: true,
    memorySharing: false,
  });

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [dispatch, shapeId]);

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (currentShape && shapeId) {
      dispatch(updateShape({
        shapeId,
        data: {
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

  if (loading || !currentShape) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading AI engine settings...</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Engine Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Engine Selection */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Engine Selection
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Primary Engine</InputLabel>
                    <Select
                      value={primaryEngine}
                      label="Primary Engine"
                      onChange={(e) => setPrimaryEngine(e.target.value)}
                    >
                      {aiEngines.map((engine) => (
                        <MenuItem key={engine} value={engine}>
                          {engine}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Fallback Engine</InputLabel>
                    <Select
                      value={fallbackEngine}
                      label="Fallback Engine"
                      onChange={(e) => setFallbackEngine(e.target.value)}
                    >
                      {aiEngines.map((engine) => (
                        <MenuItem key={engine} value={engine}>
                          {engine}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Free Will Engine</InputLabel>
                    <Select
                      value={freeWillEngine}
                      label="Free Will Engine"
                      onChange={(e) => setFreeWillEngine(e.target.value)}
                    >
                      {aiEngines.map((engine) => (
                        <MenuItem key={engine} value={engine}>
                          {engine}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Presets */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Presets
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Language Preset</InputLabel>
                    <Select
                      value={selectedLanguagePreset}
                      label="Language Preset"
                      onChange={(e) => setSelectedLanguagePreset(e.target.value)}
                    >
                      {languagePresets.map((preset) => (
                        <MenuItem key={preset} value={preset}>
                          {preset.charAt(0).toUpperCase() + preset.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Engine Preset</InputLabel>
                    <Select
                      value={selectedEnginePreset}
                      label="Engine Preset"
                      onChange={(e) => setSelectedEnginePreset(e.target.value)}
                    >
                      {enginePresets.map((preset) => (
                        <MenuItem key={preset} value={preset}>
                          {preset.charAt(0).toUpperCase() + preset.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Advanced Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6">
                  Advanced Settings
                </Typography>
                <Tooltip title="These settings control the AI's response generation behavior">
                  <InfoIcon color="action" sx={{ fontSize: 20 }} />
                </Tooltip>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Temperature</Typography>
                  <Slider
                    value={temperature}
                    onChange={(_, value) => setTemperature(value as number)}
                    min={0}
                    max={1.5}
                    step={0.1}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 0.7, label: '0.7' },
                      { value: 1.5, label: '1.5' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Top P</Typography>
                  <Slider
                    value={topP}
                    onChange={(_, value) => setTopP(value as number)}
                    min={0}
                    max={1}
                    step={0.1}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 0.9, label: '0.9' },
                      { value: 1, label: '1' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Max Response Length</Typography>
                  <Slider
                    value={maxResponseLength}
                    onChange={(_, value) => setMaxResponseLength(value as number)}
                    min={100}
                    max={4000}
                    step={100}
                    marks={[
                      { value: 100, label: '100' },
                      { value: 2000, label: '2000' },
                      { value: 4000, label: '4000' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Context Window</Typography>
                  <Slider
                    value={contextWindow}
                    onChange={(_, value) => setContextWindow(value as number)}
                    min={1000}
                    max={8000}
                    step={1000}
                    marks={[
                      { value: 1000, label: '1K' },
                      { value: 4000, label: '4K' },
                      { value: 8000, label: '8K' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Memory Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Memory Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={memorySettings.shortTermEnabled}
                        onChange={(e) => setMemorySettings({
                          ...memorySettings,
                          shortTermEnabled: e.target.checked,
                        })}
                      />
                    }
                    label="Enable Short-Term Memory"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={memorySettings.longTermEnabled}
                        onChange={(e) => setMemorySettings({
                          ...memorySettings,
                          longTermEnabled: e.target.checked,
                        })}
                      />
                    }
                    label="Enable Long-Term Memory"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={memorySettings.memoryGeneration}
                        onChange={(e) => setMemorySettings({
                          ...memorySettings,
                          memoryGeneration: e.target.checked,
                        })}
                      />
                    }
                    label="Enable Memory Generation"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={memorySettings.memoryRecall}
                        onChange={(e) => setMemorySettings({
                          ...memorySettings,
                          memoryRecall: e.target.checked,
                        })}
                      />
                    }
                    label="Enable Memory Recall"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={memorySettings.memorySharing}
                        onChange={(e) => setMemorySettings({
                          ...memorySettings,
                          memorySharing: e.target.checked,
                        })}
                      />
                    }
                    label="Enable Memory Sharing"
                  />
                </Grid>
              </Grid>
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

export default AIEngine;

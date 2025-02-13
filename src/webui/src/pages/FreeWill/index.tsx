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
  Chip,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapeById, updateShape } from '../../store/slices/shapesSlice';
import { IFreeWill } from '../../types/shape';

type FreeWillLevel = NonNullable<IFreeWill['levelOfFreeWill']>;

const freeWillLevels: FreeWillLevel[] = [
  'strict',
  'semi-autonomous',
  'fully autonomous'
];

const FreeWill: React.FC = () => {
  const { shapeId } = useParams<{ shapeId: string }>();
  const dispatch = useDispatch();
  const { currentShape, loading } = useAppSelector((state) => state.shapes);
  const [level, setLevel] = useState<FreeWillLevel>('semi-autonomous');
  const [directMessages, setDirectMessages] = useState(false);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [numberOfMessages, setNumberOfMessages] = useState<number>(1);
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [dispatch, shapeId]);

  useEffect(() => {
    if (currentShape) {
      setLevel(currentShape.freeWill.levelOfFreeWill || 'semi-autonomous');
      setDirectMessages(currentShape.freeWill.directMessages || false);
      setTemperature(currentShape.freeWill.temperature || 0.7);
      setNumberOfMessages(currentShape.freeWill.numberOfMessages || 1);
      setKeywords(currentShape.freeWill.keywordsOfInterest || []);
    }
  }, [currentShape]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (currentShape && shapeId) {
      dispatch(updateShape({
        shapeId,
        data: {
          freeWill: {
            ...currentShape.freeWill,
            levelOfFreeWill: level,
            directMessages,
            temperature,
            numberOfMessages,
            keywordsOfInterest: keywords,
          }
        }
      }));
    }
  };

  const handleKeywordsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setKeywords(typeof value === 'string' ? value.split(',') : value);
  };

  if (loading || !currentShape) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading free will settings...</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Free Will Settings
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
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Level of Free Will</InputLabel>
                    <Select
                      value={level}
                      label="Level of Free Will"
                      onChange={(e) => setLevel(e.target.value as FreeWillLevel)}
                    >
                      {freeWillLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1).replace('-', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={directMessages}
                        onChange={(e) => setDirectMessages(e.target.checked)}
                      />
                    }
                    label="Allow Direct Messages"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Response Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Response Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography gutterBottom>Temperature (Creativity)</Typography>
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
                <Grid item xs={12}>
                  <Typography gutterBottom>Number of Messages</Typography>
                  <Slider
                    value={numberOfMessages}
                    onChange={(_, value) => setNumberOfMessages(value as number)}
                    min={1}
                    max={20}
                    step={1}
                    marks={[
                      { value: 1, label: '1' },
                      { value: 10, label: '10' },
                      { value: 20, label: '20' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Keywords and Instructions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Keywords and Instructions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Keywords of Interest</InputLabel>
                    <Select
                      multiple
                      value={keywords}
                      onChange={handleKeywordsChange}
                      input={<OutlinedInput label="Keywords of Interest" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {keywords.map((keyword) => (
                        <MenuItem key={keyword} value={keyword}>
                          {keyword}
                        </MenuItem>
                      ))}
                      <MenuItem value="add-new">
                        <em>Add new keyword...</em>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Server Instructions"
                    defaultValue={currentShape.freeWill.serverInstructions}
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="DM Instructions"
                    defaultValue={currentShape.freeWill.dmInstructions}
                    multiline
                    rows={4}
                    variant="outlined"
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

export default FreeWill;

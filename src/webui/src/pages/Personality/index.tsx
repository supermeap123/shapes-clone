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
  Chip,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapeById, updateShape } from '../../store/slices/shapesSlice';

const personalityTraits = [
  'Analytical', 'Creative', 'Empathetic', 'Formal',
  'Friendly', 'Humorous', 'Logical', 'Professional',
  'Witty', 'Casual', 'Serious', 'Technical'
];

const toneOptions = [
  'Professional', 'Casual', 'Friendly', 'Formal',
  'Technical', 'Conversational', 'Academic', 'Playful'
];

const Personality: React.FC = () => {
  const { shapeId } = useParams<{ shapeId: string }>();
  const dispatch = useDispatch();
  const { currentShape, loading } = useAppSelector((state) => state.shapes);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState<string>('');

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [dispatch, shapeId]);

  useEffect(() => {
    if (currentShape) {
      setSelectedTraits(currentShape.personality.personalityTraits || []);
      setSelectedTone(currentShape.personality.tone || '');
    }
  }, [currentShape]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (currentShape && shapeId) {
      dispatch(updateShape({
        shapeId,
        data: {
          personality: {
            ...currentShape.personality,
            personalityTraits: selectedTraits,
            tone: selectedTone,
          }
        }
      }));
    }
  };

  const handleTraitsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedTraits(typeof value === 'string' ? value.split(',') : value);
  };

  const handleToneChange = (event: SelectChangeEvent<string>) => {
    setSelectedTone(event.target.value);
  };

  if (loading || !currentShape) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading personality settings...</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Personality Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Basic Personality */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Personality
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nickname"
                    defaultValue={currentShape.personality.nickname}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Tone</InputLabel>
                    <Select
                      value={selectedTone}
                      label="Tone"
                      onChange={handleToneChange}
                    >
                      {toneOptions.map((tone) => (
                        <MenuItem key={tone} value={tone}>
                          {tone}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Personality Traits</InputLabel>
                    <Select
                      multiple
                      value={selectedTraits}
                      onChange={handleTraitsChange}
                      input={<OutlinedInput label="Personality Traits" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {personalityTraits.map((trait) => (
                        <MenuItem key={trait} value={trait}>
                          {trait}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Background */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Background
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Short Backstory"
                    defaultValue={currentShape.personality.shortBackstory}
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Likes"
                    defaultValue={currentShape.personality.likes}
                    multiline
                    rows={3}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Dislikes"
                    defaultValue={currentShape.personality.dislikes}
                    multiline
                    rows={3}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Conversation Style */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Conversation Style
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Conversational Goals"
                    defaultValue={currentShape.personality.conversationalGoals}
                    multiline
                    rows={3}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Conversational Examples"
                    defaultValue={currentShape.personality.conversationalExamples}
                    multiline
                    rows={4}
                    variant="outlined"
                    helperText="Provide example conversations to guide the AI's communication style"
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

export default Personality;

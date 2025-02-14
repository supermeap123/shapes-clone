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
  Chip,
  Box,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapeById, updateShape } from '../../store/slices/shapesSlice';

const personalityTraits = [
  'Analytical',
  'Creative',
  'Empathetic',
  'Formal',
  'Friendly',
  'Humorous',
  'Professional',
  'Witty',
];

const tones = [
  'Casual',
  'Formal',
  'Professional',
  'Friendly',
  'Technical',
  'Educational',
];

const Personality: React.FC = () => {
  const { shapeId } = useParams<{ shapeId: string }>();
  const dispatch = useDispatch();
  const { currentShape, loading } = useAppSelector((state) => state.shapes);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [age, setAge] = useState<number | ''>('');
  const [history, setHistory] = useState('');
  const [likes, setLikes] = useState('');
  const [dislikes, setDislikes] = useState('');
  const [conversationalGoals, setConversationalGoals] = useState('');
  const [conversationalExamples, setConversationalExamples] = useState('');

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [shapeId, dispatch]);

  useEffect(() => {
    if (currentShape) {
      setSelectedTraits(currentShape.personality.traits || []);
      setSelectedTone(currentShape.personality.tone || '');
      setAge(currentShape.personality.age || '');
      setHistory(currentShape.personality.history || '');
      setLikes(currentShape.personality.likes || '');
      setDislikes(currentShape.personality.dislikes || '');
      setConversationalGoals(currentShape.personality.conversationalGoals || '');
      setConversationalExamples(currentShape.personality.conversationalExamples || '');
    }
  }, [currentShape]);

  const handleSave = () => {
    if (shapeId && currentShape) {
      dispatch(updateShape({
        shapeId,
        updates: {
          personality: {
            ...currentShape.personality,
            traits: selectedTraits,
            tone: selectedTone,
            age: age || undefined,
            history,
            likes,
            dislikes,
            conversationalGoals,
            conversationalExamples,
          }
        }
      }));
    }
  };

  const handleTraitToggle = (trait: string) => {
    setSelectedTraits((prev) =>
      prev.includes(trait)
        ? prev.filter((t) => t !== trait)
        : [...prev, trait]
    );
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Personality Settings
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Personality Traits
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {personalityTraits.map((trait) => (
                <Chip
                  key={trait}
                  label={trait}
                  onClick={() => handleTraitToggle(trait)}
                  color={selectedTraits.includes(trait) ? 'primary' : 'default'}
                  variant={selectedTraits.includes(trait) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Tone</InputLabel>
              <Select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                label="Tone"
              >
                {tones.map((tone) => (
                  <MenuItem key={tone} value={tone}>
                    {tone}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="History"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Likes"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Dislikes"
              value={dislikes}
              onChange={(e) => setDislikes(e.target.value)}
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Conversational Goals"
              value={conversationalGoals}
              onChange={(e) => setConversationalGoals(e.target.value)}
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Conversational Examples"
              value={conversationalExamples}
              onChange={(e) => setConversationalExamples(e.target.value)}
              multiline
              rows={4}
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

export default Personality;

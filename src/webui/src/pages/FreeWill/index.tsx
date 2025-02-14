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
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapeById, updateShape } from '../../store/slices/shapesSlice';
import { IFreeWill } from '../../types/shape';

type FreeWillLevel = NonNullable<IFreeWill['levelOfFreeWill']>;

const freeWillLevels = [
  'strict',
  'semi-autonomous',
  'fully-autonomous'
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
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [shapeId, dispatch]);

  useEffect(() => {
    if (currentShape) {
      setLevel(currentShape.freeWill.levelOfFreeWill);
      setDirectMessages(currentShape.freeWill.directMessages || false);
      setTemperature(currentShape.freeWill.temperature || 0.7);
      setNumberOfMessages(currentShape.freeWill.numberOfMessages || 1);
      setKeywords(currentShape.freeWill.keywordsOfInterest || []);
    }
  }, [currentShape]);

  const handleSave = () => {
    if (shapeId && currentShape) {
      dispatch(updateShape({
        shapeId,
        updates: {
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

  const handleAddKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword('');
    }
  };

  const handleDeleteKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Free Will Settings
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Level of Free Will
            </Typography>
            {freeWillLevels.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Switch
                    checked={level === option}
                    onChange={() => setLevel(option as FreeWillLevel)}
                  />
                }
                label={option}
              />
            ))}
          </Grid>

          <Grid item xs={12}>
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
            <Typography gutterBottom>Number of Messages</Typography>
            <Slider
              value={numberOfMessages}
              onChange={(_, value) => setNumberOfMessages(value as number)}
              min={1}
              max={20}
              step={1}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Keywords of Interest</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add keyword"
                size="small"
              />
              <IconButton onClick={handleAddKeyword} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => handleDeleteKeyword(keyword)}
                />
              ))}
            </Box>
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

export default FreeWill;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapeById, updateShape } from '../../store/slices/shapesSlice';

interface ConversationDialogState {
  open: boolean;
  snippet: string;
}

const Training: React.FC = () => {
  const { shapeId } = useParams<{ shapeId: string }>();
  const dispatch = useDispatch();
  const { currentShape, loading } = useAppSelector((state) => state.shapes);
  const [snippets, setSnippets] = useState<string[]>([]);
  const [dialogState, setDialogState] = useState<ConversationDialogState>({
    open: false,
    snippet: '',
  });

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [shapeId, dispatch]);

  useEffect(() => {
    if (currentShape) {
      setSnippets(currentShape.training.conversationSnippets || []);
    }
  }, [currentShape]);

  const handleSave = () => {
    if (shapeId && currentShape) {
      dispatch(updateShape({
        shapeId,
        updates: {
          training: {
            ...currentShape.training,
            conversationSnippets: snippets,
          }
        }
      }));
    }
  };

  const handleAddSnippet = () => {
    if (dialogState.snippet) {
      setSnippets([...snippets, dialogState.snippet]);
      setDialogState({ open: false, snippet: '' });
    }
  };

  const handleRemoveSnippet = (index: number) => {
    setSnippets(snippets.filter((_, i) => i !== index));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Training Data
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Conversation Snippets
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setDialogState({ ...dialogState, open: true })}
            >
              Add Conversation Snippet
            </Button>
            <Box sx={{ mt: 2 }}>
              {snippets.map((snippet, index) => (
                <Chip
                  key={index}
                  label={snippet.substring(0, 50) + (snippet.length > 50 ? '...' : '')}
                  onDelete={() => handleRemoveSnippet(index)}
                  sx={{ m: 0.5 }}
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

      <Dialog
        open={dialogState.open}
        onClose={() => setDialogState({ ...dialogState, open: false })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Conversation Snippet</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={dialogState.snippet}
            onChange={(e) =>
              setDialogState({ ...dialogState, snippet: e.target.value })
            }
            placeholder="Enter a conversation example..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogState({ ...dialogState, open: false })}
          >
            Cancel
          </Button>
          <Button onClick={handleAddSnippet} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Training;

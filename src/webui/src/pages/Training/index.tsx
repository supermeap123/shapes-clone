import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
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

interface ConversationDialogState {
  open: boolean;
  snippet: string;
  isEdit: boolean;
  editIndex?: number;
}

const Training: React.FC = () => {
  const { shapeId } = useParams<{ shapeId: string }>();
  const dispatch = useDispatch();
  const { currentShape, loading } = useAppSelector((state) => state.shapes);
  const [snippets, setSnippets] = useState<string[]>([]);
  const [dialogState, setDialogState] = useState<ConversationDialogState>({
    open: false,
    snippet: '',
    isEdit: false,
  });

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [dispatch, shapeId]);

  useEffect(() => {
    if (currentShape) {
      setSnippets(currentShape.training.conversationSnippets || []);
    }
  }, [currentShape]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (currentShape && shapeId) {
      dispatch(updateShape({
        shapeId,
        data: {
          training: {
            ...currentShape.training,
            conversationSnippets: snippets,
          }
        }
      }));
    }
  };

  const handleAddSnippet = () => {
    setDialogState({
      open: true,
      snippet: '',
      isEdit: false,
    });
  };

  const handleEditSnippet = (index: number) => {
    setDialogState({
      open: true,
      snippet: snippets[index],
      isEdit: true,
      editIndex: index,
    });
  };

  const handleDeleteSnippet = (index: number) => {
    const newSnippets = [...snippets];
    newSnippets.splice(index, 1);
    setSnippets(newSnippets);
  };

  const handleSaveSnippet = () => {
    if (dialogState.isEdit && typeof dialogState.editIndex === 'number') {
      const newSnippets = [...snippets];
      newSnippets[dialogState.editIndex] = dialogState.snippet;
      setSnippets(newSnippets);
    } else {
      setSnippets([...snippets, dialogState.snippet]);
    }
    setDialogState({ ...dialogState, open: false });
  };

  if (loading || !currentShape) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading training settings...</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Training Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Conversation Snippets */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">
                    Conversation Snippets
                  </Typography>
                  <Tooltip title="Add example conversations to train the AI's communication style and behavior patterns">
                    <InfoIcon color="action" sx={{ fontSize: 20 }} />
                  </Tooltip>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddSnippet}
                >
                  Add Snippet
                </Button>
              </Box>
              <List>
                {snippets.map((snippet, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={snippet.length > 100 ? `${snippet.substring(0, 100)}...` : snippet}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleEditSnippet(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDeleteSnippet(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                {snippets.length === 0 && (
                  <ListItem>
                    <ListItemText
                      secondary="No conversation snippets added yet. Add example conversations to train the AI's behavior."
                    />
                  </ListItem>
                )}
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

      {/* Snippet Dialog */}
      <Dialog
        open={dialogState.open}
        onClose={() => setDialogState({ ...dialogState, open: false })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogState.isEdit ? 'Edit Conversation Snippet' : 'Add Conversation Snippet'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={8}
              value={dialogState.snippet}
              onChange={(e) => setDialogState({
                ...dialogState,
                snippet: e.target.value
              })}
              placeholder="Enter an example conversation to train the AI's behavior..."
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogState({ ...dialogState, open: false })}>
            Cancel
          </Button>
          <Button onClick={handleSaveSnippet} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Training;

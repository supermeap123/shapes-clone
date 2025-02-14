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

interface CommandDialogState {
  open: boolean;
  name: string;
  response: string;
}

const Knowledge: React.FC = () => {
  const { shapeId } = useParams<{ shapeId: string }>();
  const dispatch = useDispatch();
  const { currentShape, loading } = useAppSelector((state) => state.shapes);
  const [generalKnowledge, setGeneralKnowledge] = useState<string[]>([]);
  const [commands, setCommands] = useState<Array<{ name: string; response: string }>>([]);
  const [newKnowledge, setNewKnowledge] = useState('');
  const [commandDialog, setCommandDialog] = useState<CommandDialogState>({
    open: false,
    name: '',
    response: '',
  });

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [shapeId, dispatch]);

  useEffect(() => {
    if (currentShape) {
      setGeneralKnowledge(currentShape.knowledge.generalKnowledge || []);
      setCommands(currentShape.knowledge.commands || []);
    }
  }, [currentShape]);

  const handleSave = () => {
    if (shapeId && currentShape) {
      dispatch(updateShape({
        shapeId,
        updates: {
          knowledge: {
            ...currentShape.knowledge,
            generalKnowledge,
            commands,
          }
        }
      }));
    }
  };

  const handleAddKnowledge = () => {
    if (newKnowledge && !generalKnowledge.includes(newKnowledge)) {
      setGeneralKnowledge([...generalKnowledge, newKnowledge]);
      setNewKnowledge('');
    }
  };

  const handleRemoveKnowledge = (knowledge: string) => {
    setGeneralKnowledge(generalKnowledge.filter((k) => k !== knowledge));
  };

  const handleAddCommand = () => {
    if (commandDialog.name && commandDialog.response) {
      setCommands([
        ...commands,
        { name: commandDialog.name, response: commandDialog.response },
      ]);
      setCommandDialog({ open: false, name: '', response: '' });
    }
  };

  const handleRemoveCommand = (name: string) => {
    setCommands(commands.filter((c) => c.name !== name));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Knowledge Base
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              General Knowledge
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                value={newKnowledge}
                onChange={(e) => setNewKnowledge(e.target.value)}
                placeholder="Add knowledge"
                size="small"
              />
              <IconButton onClick={handleAddKnowledge} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {generalKnowledge.map((knowledge, index) => (
                <Chip
                  key={index}
                  label={knowledge}
                  onDelete={() => handleRemoveKnowledge(knowledge)}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Commands
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setCommandDialog({ ...commandDialog, open: true })}
            >
              Add Command
            </Button>
            <Box sx={{ mt: 2 }}>
              {commands.map((command, index) => (
                <Chip
                  key={index}
                  label={`${command.name}: ${command.response}`}
                  onDelete={() => handleRemoveCommand(command.name)}
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
        open={commandDialog.open}
        onClose={() => setCommandDialog({ ...commandDialog, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Command</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Command Name"
                value={commandDialog.name}
                onChange={(e) =>
                  setCommandDialog({ ...commandDialog, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Response"
                value={commandDialog.response}
                onChange={(e) =>
                  setCommandDialog({ ...commandDialog, response: e.target.value })
                }
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCommandDialog({ ...commandDialog, open: false })}
          >
            Cancel
          </Button>
          <Button onClick={handleAddCommand} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Knowledge;

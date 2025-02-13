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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapeById, updateShape } from '../../store/slices/shapesSlice';

interface CommandDialogState {
  open: boolean;
  command: {
    name: string;
    response: string;
  };
  isEdit: boolean;
  editIndex?: number;
}

const Knowledge: React.FC = () => {
  const { shapeId } = useParams<{ shapeId: string }>();
  const dispatch = useDispatch();
  const { currentShape, loading } = useAppSelector((state) => state.shapes);
  const [generalKnowledge, setGeneralKnowledge] = useState<string[]>([]);
  const [commands, setCommands] = useState<Array<{ name: string; response: string }>>([]);
  const [commandDialog, setCommandDialog] = useState<CommandDialogState>({
    open: false,
    command: { name: '', response: '' },
    isEdit: false,
  });

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [dispatch, shapeId]);

  useEffect(() => {
    if (currentShape) {
      setGeneralKnowledge(currentShape.knowledge.generalKnowledge || []);
      setCommands(currentShape.knowledge.commands || []);
    }
  }, [currentShape]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (currentShape && shapeId) {
      dispatch(updateShape({
        shapeId,
        data: {
          knowledge: {
            ...currentShape.knowledge,
            generalKnowledge,
            commands,
          }
        }
      }));
    }
  };

  const handleAddCommand = () => {
    setCommandDialog({
      open: true,
      command: { name: '', response: '' },
      isEdit: false,
    });
  };

  const handleEditCommand = (index: number) => {
    setCommandDialog({
      open: true,
      command: commands[index],
      isEdit: true,
      editIndex: index,
    });
  };

  const handleDeleteCommand = (index: number) => {
    const newCommands = [...commands];
    newCommands.splice(index, 1);
    setCommands(newCommands);
  };

  const handleSaveCommand = () => {
    if (commandDialog.isEdit && typeof commandDialog.editIndex === 'number') {
      const newCommands = [...commands];
      newCommands[commandDialog.editIndex] = commandDialog.command;
      setCommands(newCommands);
    } else {
      setCommands([...commands, commandDialog.command]);
    }
    setCommandDialog({ ...commandDialog, open: false });
  };

  if (loading || !currentShape) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading knowledge settings...</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Knowledge Settings
      </Typography>

      <Grid container spacing={3}>
        {/* General Knowledge */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Knowledge
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                placeholder="Enter general knowledge about the shape's personality, background, or special knowledge..."
                value={generalKnowledge.join('\n')}
                onChange={(e) => setGeneralKnowledge(e.target.value.split('\n').filter(Boolean))}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Commands */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Commands
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddCommand}
                >
                  Add Command
                </Button>
              </Box>
              <List>
                {commands.map((command, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={command.name}
                      secondary={command.response}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleEditCommand(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDeleteCommand(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
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

      {/* Command Dialog */}
      <Dialog open={commandDialog.open} onClose={() => setCommandDialog({ ...commandDialog, open: false })}>
        <DialogTitle>
          {commandDialog.isEdit ? 'Edit Command' : 'Add Command'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Command Name"
              value={commandDialog.command.name}
              onChange={(e) => setCommandDialog({
                ...commandDialog,
                command: { ...commandDialog.command, name: e.target.value }
              })}
            />
            <TextField
              fullWidth
              label="Response"
              multiline
              rows={4}
              value={commandDialog.command.response}
              onChange={(e) => setCommandDialog({
                ...commandDialog,
                command: { ...commandDialog.command, response: e.target.value }
              })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommandDialog({ ...commandDialog, open: false })}>
            Cancel
          </Button>
          <Button onClick={handleSaveCommand} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Knowledge;

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapeById, updateShape } from '../../store/slices/shapesSlice';

interface UserDialogState {
  open: boolean;
  username: string;
  isEdit: boolean;
  editIndex?: number;
}

const Settings: React.FC = () => {
  const { shapeId } = useParams<{ shapeId: string }>();
  const dispatch = useDispatch();
  const { currentShape, loading } = useAppSelector((state) => state.shapes);
  const [shapeOwners, setShapeOwners] = useState<string[]>([]);
  const [serverListVisibility, setServerListVisibility] = useState(false);
  const [dmResponseSettings, setDmResponseSettings] = useState({
    enabled: false,
    allowlist: [] as string[],
    blocklist: [] as string[],
  });
  const [ignoreList, setIgnoreList] = useState<string[]>([]);
  const [customMessages, setCustomMessages] = useState({
    wackMessage: '',
    errorMessage: '',
    sleepMessage: '',
    serverJoinMessage: '',
  });
  const [userDialog, setUserDialog] = useState<UserDialogState>({
    open: false,
    username: '',
    isEdit: false,
  });

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [dispatch, shapeId]);

  useEffect(() => {
    if (currentShape) {
      setShapeOwners(currentShape.settings.shapeOwners || []);
      setServerListVisibility(currentShape.settings.privacySettings?.serverListVisibility || false);
      setDmResponseSettings({
        enabled: currentShape.settings.privacySettings?.dmResponseSettings.enabled || false,
        allowlist: currentShape.settings.privacySettings?.dmResponseSettings.allowlist || [],
        blocklist: currentShape.settings.privacySettings?.dmResponseSettings.blocklist || [],
      });
      setIgnoreList(currentShape.settings.privacySettings?.ignoreList || []);
      setCustomMessages({
        wackMessage: currentShape.settings.customMessages?.wackMessage || '',
        errorMessage: currentShape.settings.customMessages?.errorMessage || '',
        sleepMessage: currentShape.settings.customMessages?.sleepMessage || '',
        serverJoinMessage: currentShape.settings.customMessages?.serverJoinMessage || '',
      });
    }
  }, [currentShape]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (currentShape && shapeId) {
      dispatch(updateShape({
        shapeId,
        data: {
          settings: {
            ...currentShape.settings,
            shapeOwners,
            privacySettings: {
              serverListVisibility,
              dmResponseSettings,
              ignoreList,
            },
            customMessages,
          }
        }
      }));
    }
  };

  const handleAddOwner = () => {
    setUserDialog({
      open: true,
      username: '',
      isEdit: false,
    });
  };

  const handleSaveUser = () => {
    if (userDialog.username) {
      if (userDialog.isEdit && typeof userDialog.editIndex === 'number') {
        const newOwners = [...shapeOwners];
        newOwners[userDialog.editIndex] = userDialog.username;
        setShapeOwners(newOwners);
      } else {
        setShapeOwners([...shapeOwners, userDialog.username]);
      }
    }
    setUserDialog({ ...userDialog, open: false });
  };

  const handleDeleteOwner = (index: number) => {
    const newOwners = [...shapeOwners];
    newOwners.splice(index, 1);
    setShapeOwners(newOwners);
  };

  if (loading || !currentShape) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading settings...</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Shape Owners */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Shape Owners
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddOwner}
                >
                  Add Owner
                </Button>
              </Box>
              <List>
                {shapeOwners.map((owner, index) => (
                  <ListItem key={index} divider>
                    <ListItemText primary={owner} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleDeleteOwner(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Privacy Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={serverListVisibility}
                        onChange={(e) => setServerListVisibility(e.target.checked)}
                      />
                    }
                    label="Show in Server List"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={dmResponseSettings.enabled}
                        onChange={(e) => setDmResponseSettings({
                          ...dmResponseSettings,
                          enabled: e.target.checked,
                        })}
                      />
                    }
                    label="Enable DM Responses"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    DM Allowlist
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {dmResponseSettings.allowlist.map((user, index) => (
                      <Chip
                        key={index}
                        label={user}
                        onDelete={() => {
                          const newAllowlist = [...dmResponseSettings.allowlist];
                          newAllowlist.splice(index, 1);
                          setDmResponseSettings({
                            ...dmResponseSettings,
                            allowlist: newAllowlist,
                          });
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    DM Blocklist
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {dmResponseSettings.blocklist.map((user, index) => (
                      <Chip
                        key={index}
                        label={user}
                        onDelete={() => {
                          const newBlocklist = [...dmResponseSettings.blocklist];
                          newBlocklist.splice(index, 1);
                          setDmResponseSettings({
                            ...dmResponseSettings,
                            blocklist: newBlocklist,
                          });
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Custom Messages */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Custom Messages
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Wack Message"
                    value={customMessages.wackMessage}
                    onChange={(e) => setCustomMessages({
                      ...customMessages,
                      wackMessage: e.target.value,
                    })}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Error Message"
                    value={customMessages.errorMessage}
                    onChange={(e) => setCustomMessages({
                      ...customMessages,
                      errorMessage: e.target.value,
                    })}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Sleep Message"
                    value={customMessages.sleepMessage}
                    onChange={(e) => setCustomMessages({
                      ...customMessages,
                      sleepMessage: e.target.value,
                    })}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Server Join Message"
                    value={customMessages.serverJoinMessage}
                    onChange={(e) => setCustomMessages({
                      ...customMessages,
                      serverJoinMessage: e.target.value,
                    })}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Danger Zone */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'error.main', color: 'error.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WarningIcon />
                <Typography variant="h6">
                  Danger Zone
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    color="inherit"
                    fullWidth
                    sx={{ color: 'error.main' }}
                  >
                    Reset Bot Token
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    color="inherit"
                    fullWidth
                    sx={{ color: 'error.main' }}
                  >
                    Delete Shape
                  </Button>
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

      {/* User Dialog */}
      <Dialog
        open={userDialog.open}
        onClose={() => setUserDialog({ ...userDialog, open: false })}
      >
        <DialogTitle>
          {userDialog.isEdit ? 'Edit User' : 'Add User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Discord Username"
              value={userDialog.username}
              onChange={(e) => setUserDialog({
                ...userDialog,
                username: e.target.value,
              })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialog({ ...userDialog, open: false })}>
            Cancel
          </Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;

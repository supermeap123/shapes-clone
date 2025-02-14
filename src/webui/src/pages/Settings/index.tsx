import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControlLabel,
  Switch,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapeById, updateShape } from '../../store/slices/shapesSlice';

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
  const [newOwner, setNewOwner] = useState('');
  const [newIgnoredUser, setNewIgnoredUser] = useState('');
  const [newAllowedUser, setNewAllowedUser] = useState('');
  const [newBlockedUser, setNewBlockedUser] = useState('');

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [shapeId, dispatch]);

  useEffect(() => {
    if (currentShape) {
      setShapeOwners(currentShape.settings.shapeOwners || []);
      setServerListVisibility(currentShape.settings.privacySettings?.serverListVisibility || false);
      setDmResponseSettings({
        enabled: currentShape.settings.privacySettings?.dmResponseSettings?.enabled || false,
        allowlist: currentShape.settings.privacySettings?.dmResponseSettings?.allowlist || [],
        blocklist: currentShape.settings.privacySettings?.dmResponseSettings?.blocklist || [],
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

  const handleSave = () => {
    if (shapeId && currentShape) {
      dispatch(updateShape({
        shapeId,
        updates: {
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
    if (newOwner && !shapeOwners.includes(newOwner)) {
      setShapeOwners([...shapeOwners, newOwner]);
      setNewOwner('');
    }
  };

  const handleRemoveOwner = (owner: string) => {
    setShapeOwners(shapeOwners.filter((o) => o !== owner));
  };

  const handleAddIgnoredUser = () => {
    if (newIgnoredUser && !ignoreList.includes(newIgnoredUser)) {
      setIgnoreList([...ignoreList, newIgnoredUser]);
      setNewIgnoredUser('');
    }
  };

  const handleRemoveIgnoredUser = (user: string) => {
    setIgnoreList(ignoreList.filter((u) => u !== user));
  };

  const handleAddAllowedUser = () => {
    if (newAllowedUser && !dmResponseSettings.allowlist.includes(newAllowedUser)) {
      setDmResponseSettings({
        ...dmResponseSettings,
        allowlist: [...dmResponseSettings.allowlist, newAllowedUser],
      });
      setNewAllowedUser('');
    }
  };

  const handleRemoveAllowedUser = (user: string) => {
    setDmResponseSettings({
      ...dmResponseSettings,
      allowlist: dmResponseSettings.allowlist.filter((u) => u !== user),
    });
  };

  const handleAddBlockedUser = () => {
    if (newBlockedUser && !dmResponseSettings.blocklist.includes(newBlockedUser)) {
      setDmResponseSettings({
        ...dmResponseSettings,
        blocklist: [...dmResponseSettings.blocklist, newBlockedUser],
      });
      setNewBlockedUser('');
    }
  };

  const handleRemoveBlockedUser = (user: string) => {
    setDmResponseSettings({
      ...dmResponseSettings,
      blocklist: dmResponseSettings.blocklist.filter((u) => u !== user),
    });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Shape Owners
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                placeholder="Add owner"
                size="small"
              />
              <IconButton onClick={handleAddOwner} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {shapeOwners.map((owner) => (
                <Chip
                  key={owner}
                  label={owner}
                  onDelete={() => handleRemoveOwner(owner)}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Privacy Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={serverListVisibility}
                  onChange={(e) => setServerListVisibility(e.target.checked)}
                />
              }
              label="Show in Server List"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={dmResponseSettings.enabled}
                  onChange={(e) =>
                    setDmResponseSettings({
                      ...dmResponseSettings,
                      enabled: e.target.checked,
                    })
                  }
                />
              }
              label="Allow DM Responses"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              DM Response Settings
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                value={newAllowedUser}
                onChange={(e) => setNewAllowedUser(e.target.value)}
                placeholder="Add allowed user"
                size="small"
              />
              <IconButton onClick={handleAddAllowedUser} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {dmResponseSettings.allowlist.map((user) => (
                <Chip
                  key={user}
                  label={user}
                  onDelete={() => handleRemoveAllowedUser(user)}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                value={newBlockedUser}
                onChange={(e) => setNewBlockedUser(e.target.value)}
                placeholder="Add blocked user"
                size="small"
              />
              <IconButton onClick={handleAddBlockedUser} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {dmResponseSettings.blocklist.map((user) => (
                <Chip
                  key={user}
                  label={user}
                  onDelete={() => handleRemoveBlockedUser(user)}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Ignore List
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                value={newIgnoredUser}
                onChange={(e) => setNewIgnoredUser(e.target.value)}
                placeholder="Add ignored user"
                size="small"
              />
              <IconButton onClick={handleAddIgnoredUser} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {ignoreList.map((user) => (
                <Chip
                  key={user}
                  label={user}
                  onDelete={() => handleRemoveIgnoredUser(user)}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Custom Messages
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Wack Message"
                  value={customMessages.wackMessage}
                  onChange={(e) =>
                    setCustomMessages({
                      ...customMessages,
                      wackMessage: e.target.value,
                    })
                  }
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Error Message"
                  value={customMessages.errorMessage}
                  onChange={(e) =>
                    setCustomMessages({
                      ...customMessages,
                      errorMessage: e.target.value,
                    })
                  }
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sleep Message"
                  value={customMessages.sleepMessage}
                  onChange={(e) =>
                    setCustomMessages({
                      ...customMessages,
                      sleepMessage: e.target.value,
                    })
                  }
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Server Join Message"
                  value={customMessages.serverJoinMessage}
                  onChange={(e) =>
                    setCustomMessages({
                      ...customMessages,
                      serverJoinMessage: e.target.value,
                    })
                  }
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
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

export default Settings;

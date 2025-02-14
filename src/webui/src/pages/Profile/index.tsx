import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { fetchShapeById, updateShape } from '../../store/slices/shapesSlice';

const Profile: React.FC = () => {
  const { shapeId } = useParams<{ shapeId: string }>();
  const dispatch = useDispatch();
  const { currentShape, loading } = useAppSelector((state) => state.shapes);
  const [profile, setProfile] = useState({
    nickname: '',
    description: '',
    avatar: '',
    banner: '',
    vanityUrl: '',
    appearance: '',
    initialMessage: '',
    discordName: '',
    bio: '',
  });

  useEffect(() => {
    if (shapeId) {
      dispatch(fetchShapeById(shapeId));
    }
  }, [shapeId, dispatch]);

  useEffect(() => {
    if (currentShape) {
      setProfile({
        nickname: currentShape.profile.nickname || '',
        description: currentShape.profile.description || '',
        avatar: currentShape.profile.avatar || '',
        banner: currentShape.profile.banner || '',
        vanityUrl: currentShape.profile.vanityUrl || '',
        appearance: currentShape.profile.appearance || '',
        initialMessage: currentShape.profile.initialMessage || '',
        discordName: currentShape.profile.discordName || '',
        bio: currentShape.profile.bio || '',
      });
    }
  }, [currentShape]);

  const handleSave = () => {
    if (shapeId && currentShape) {
      dispatch(updateShape({
        shapeId,
        updates: {
          profile: {
            ...currentShape.profile,
            ...profile,
          }
        }
      }));
    }
  };

  const handleChange = (field: keyof typeof profile) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nickname"
              value={profile.nickname}
              onChange={handleChange('nickname')}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={profile.description}
              onChange={handleChange('description')}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Avatar URL"
              value={profile.avatar}
              onChange={handleChange('avatar')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Banner URL"
              value={profile.banner}
              onChange={handleChange('banner')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vanity URL"
              value={profile.vanityUrl}
              onChange={handleChange('vanityUrl')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Discord Name"
              value={profile.discordName}
              onChange={handleChange('discordName')}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Appearance"
              value={profile.appearance}
              onChange={handleChange('appearance')}
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Initial Message"
              value={profile.initialMessage}
              onChange={handleChange('initialMessage')}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              value={profile.bio}
              onChange={handleChange('bio')}
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={loading}
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;

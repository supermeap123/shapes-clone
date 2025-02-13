import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useAppSelector } from '../../store';
import { login } from '../../store/slices/authSlice';

const Login: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(login(credentials)).unwrap();
      navigate('/');
    } catch (error) {
      // Error is handled by the auth slice
      console.error('Login failed:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Shapes Admin
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sign in to manage your AI personalities
          </Typography>
        </Box>

        <Card
          sx={{
            width: '100%',
            boxShadow: theme.shadows[3],
          }}
        >
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={credentials.email}
                onChange={(e) => setCredentials({
                  ...credentials,
                  email: e.target.value,
                })}
                disabled={loading}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={(e) => setCredentials({
                  ...credentials,
                  password: e.target.value,
                })}
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Need help? Contact your system administrator.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;

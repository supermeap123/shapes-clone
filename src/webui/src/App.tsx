import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import theme from './theme';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Personality from './pages/Personality';
import FreeWill from './pages/FreeWill';
import Knowledge from './pages/Knowledge';
import Training from './pages/Training';
import AIEngine from './pages/AIEngine';
import ImageEngine from './pages/ImageEngine';
import VoiceEngine from './pages/VoiceEngine';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.ui);

  const currentTheme = {
    ...theme,
    palette: {
      ...theme.palette,
      mode: darkMode ? 'dark' : 'light',
    },
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="/shapes/:shapeId/profile" element={<Profile />} />
                    <Route path="/shapes/:shapeId/personality" element={<Personality />} />
                    <Route path="/shapes/:shapeId/freewill" element={<FreeWill />} />
                    <Route path="/shapes/:shapeId/knowledge" element={<Knowledge />} />
                    <Route path="/shapes/:shapeId/training" element={<Training />} />
                    <Route path="/shapes/:shapeId/ai-engine" element={<AIEngine />} />
                    <Route path="/shapes/:shapeId/image-engine" element={<ImageEngine />} />
                    <Route path="/shapes/:shapeId/voice-engine" element={<VoiceEngine />} />
                    <Route path="/shapes/:shapeId/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './theme';

// Layout
import Layout from './components/Layout';

// Pages
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

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/shapes/:shapeId">
                <Route path="profile" element={<Profile />} />
                <Route path="personality" element={<Personality />} />
                <Route path="freewill" element={<FreeWill />} />
                <Route path="knowledge" element={<Knowledge />} />
                <Route path="training" element={<Training />} />
                <Route path="ai-engine" element={<AIEngine />} />
                <Route path="image-engine" element={<ImageEngine />} />
                <Route path="voice-engine" element={<VoiceEngine />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

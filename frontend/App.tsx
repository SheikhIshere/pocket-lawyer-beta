import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';

console.log('App.tsx: Starting App component...');

const App: React.FC = () => {
  console.log('App.tsx: Rendering App component...');

  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

// Separate component to use auth context
const AppContent: React.FC = () => {
  const { isInitializing } = useAuth();

  // Show loading screen during initialization
  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          
          {/* Fallback to Landing Page for other routes */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AuthParams from './pages/Auth.jsx';
import Layout from './components/Layout.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    // If user refreshes, wipe the session mapping to log them down to landing
    const handleUnload = () => {
      localStorage.removeItem('userInfo');
    };
    
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return (
    <Router>
      <CustomCursor />
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthParams />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

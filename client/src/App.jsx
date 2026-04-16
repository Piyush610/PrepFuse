import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import DSATracker from './pages/DSATracker';
import InterviewSim from './pages/InterviewSim';
import InterviewHistory from './pages/InterviewHistory';
import Navbar from './components/shared/Navbar';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
            <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <DSATracker /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
            <Route path="/interview" element={user ? <InterviewSim /> : <Navigate to="/auth" />} />
            <Route path="/history" element={user ? <InterviewHistory /> : <Navigate to="/auth" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

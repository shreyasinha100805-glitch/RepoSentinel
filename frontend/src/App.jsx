import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [theme, setTheme] = useState(() => localStorage.getItem('reposentinel-theme') || 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('reposentinel-theme', theme);
  }, [theme]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen app-surface text-slate-100 flex flex-col font-sans">
          <Navbar
            selectedModel={selectedModel}
            onModelSelect={(m) => setSelectedModel(m)}
            theme={theme}
            onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
          <main className="flex-1 relative">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/create-account" element={<CreateAccountPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage selectedModel={selectedModel} />} />
                <Route path="/scan/:scanId" element={<DashboardPage selectedModel={selectedModel} />} />
                <Route path="/history" element={<HistoryPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="border-t border-slate-800/80 bg-[#090c13] py-5 text-center text-xs text-slate-500">
            <p>RepoSentinel - Autonomous AI Security Engineer - Powered by Google Gemini 3.5 & Google ADK Multi-Agent Architecture</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

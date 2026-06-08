// import React, { useState } from 'react';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import Chat from './pages/Chat';

// function App() {
//     const [page, setPage] = useState('login');
//     const [token, setToken] = useState(localStorage.getItem('token'));
//     const [chatDocId, setChatDocId] = useState(null);

//     const handleLogin = () => {
//         setToken(localStorage.getItem('token'));
//         setPage('dashboard');
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         setToken(null);
//         setPage('login');
//     };

//     const handleChat = (docId) => {
//         setChatDocId(docId);
//         setPage('chat');
//     };

//     if (page === 'login') return <Login onLogin={handleLogin} onRegister={() => setPage('register')} />;
//     if (page === 'register') return <Register onRegister={() => setPage('login')} />;
//     if (page === 'dashboard') return <Dashboard token={token} onLogout={handleLogout} onChat={handleChat} />;
//     if (page === 'chat') return <Chat token={token} docId={chatDocId} onBack={() => setPage('dashboard')} />;
// }

// export default App;

import React, { useState, createContext, useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';

export const ThemeContext = createContext();

const themes = {
  dark: {
    name: 'Dark',
    bg: '#0f0f0f',
    sidebar: '#1a1a1a',
    card: '#1e1e1e',
    cardHover: '#252525',
    border: '#2a2a2a',
    text: '#e8e8e8',
    textMuted: '#888',
    textSecondary: '#aaa',
    accent: '#6c63ff',
    accentHover: '#5a52e0',
    accentSoft: 'rgba(108,99,255,0.15)',
    success: '#00d68f',
    danger: '#ff4d6d',
    warning: '#ffd166',
    inputBg: '#252525',
    shadow: '0 4px 20px rgba(0,0,0,0.5)',
    userBubble: '#6c63ff',
    aiBubble: '#252525',
  },
  black: {
    name: 'Obsidian',
    bg: '#000000',
    sidebar: '#0a0a0a',
    card: '#111111',
    cardHover: '#161616',
    border: '#1f1f1f',
    text: '#f0f0f0',
    textMuted: '#555',
    textSecondary: '#888',
    accent: '#00ff87',
    accentHover: '#00e07a',
    accentSoft: 'rgba(0,255,135,0.1)',
    success: '#00ff87',
    danger: '#ff3860',
    warning: '#ffdd57',
    inputBg: '#111',
    shadow: '0 4px 20px rgba(0,0,0,0.8)',
    userBubble: '#00ff87',
    aiBubble: '#111111',
  },
  brown: {
    name: 'Mocha',
    bg: '#1c1410',
    sidebar: '#231a14',
    card: '#2a1f17',
    cardHover: '#33261c',
    border: '#3d2e22',
    text: '#e8d5c0',
    textMuted: '#8c7060',
    textSecondary: '#b09070',
    accent: '#d4845a',
    accentHover: '#c07040',
    accentSoft: 'rgba(212,132,90,0.15)',
    success: '#7ab648',
    danger: '#e05c5c',
    warning: '#e8b84b',
    inputBg: '#33261c',
    shadow: '0 4px 20px rgba(0,0,0,0.4)',
    userBubble: '#d4845a',
    aiBubble: '#33261c',
  },
  light: {
    name: 'Light',
    bg: '#f5f5f0',
    sidebar: '#ffffff',
    card: '#ffffff',
    cardHover: '#f8f8f5',
    border: '#e8e8e0',
    text: '#1a1a1a',
    textMuted: '#999',
    textSecondary: '#555',
    accent: '#5046e4',
    accentHover: '#3d35c0',
    accentSoft: 'rgba(80,70,228,0.08)',
    success: '#00b377',
    danger: '#e53e3e',
    warning: '#d97706',
    inputBg: '#f0f0ec',
    shadow: '0 4px 20px rgba(0,0,0,0.08)',
    userBubble: '#5046e4',
    aiBubble: '#f0f0ec',
  },
};

export function useTheme() {
  return useContext(ThemeContext);
}

function App() {
  const [page, setPage] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [chatDocId, setChatDocId] = useState(null);
  const [chatDocName, setChatDocName] = useState('');
  const [themeName, setThemeName] = useState('dark');
  const [chatHistory, setChatHistory] = useState([]);

  const theme = themes[themeName];

  const handleLogin = () => {
    setToken(localStorage.getItem('token'));
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPage('login');
    setChatHistory([]);
  };

  const handleChat = (docId, docName) => {
    setChatDocId(docId);
    setChatDocName(docName || 'Document');
    // Add to chat history if not already there
    setChatHistory(prev => {
      const exists = prev.find(h => h.docId === docId);
      if (!exists) {
        return [{ docId, docName: docName || 'Document', time: new Date().toLocaleTimeString() }, ...prev];
      }
      return prev;
    });
    setPage('chat');
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName, themes }}>
      <div style={{ background: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
        {page === 'login' && <Login onLogin={handleLogin} onRegister={() => setPage('register')} />}
        {page === 'register' && <Register onRegister={() => setPage('login')} />}
        {page === 'dashboard' && (
          <Dashboard
            token={token}
            onLogout={handleLogout}
            onChat={handleChat}
            chatHistory={chatHistory}
          />
        )}
        {page === 'chat' && (
          <Chat
            token={token}
            docId={chatDocId}
            docName={chatDocName}
            onBack={() => setPage('dashboard')}
            chatHistory={chatHistory}
            onSelectChat={(id, name) => handleChat(id, name)}
          />
        )}
      </div>
    </ThemeContext.Provider>
  );
}

export default App;

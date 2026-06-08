import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';

function App() {
    const [page, setPage] = useState('login');
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [chatDocId, setChatDocId] = useState(null);

    const handleLogin = () => {
        setToken(localStorage.getItem('token'));
        setPage('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setPage('login');
    };

    const handleChat = (docId) => {
        setChatDocId(docId);
        setPage('chat');
    };

    if (page === 'login') return <Login onLogin={handleLogin} onRegister={() => setPage('register')} />;
    if (page === 'register') return <Register onRegister={() => setPage('login')} />;
    if (page === 'dashboard') return <Dashboard token={token} onLogout={handleLogout} onChat={handleChat} />;
    if (page === 'chat') return <Chat token={token} docId={chatDocId} onBack={() => setPage('dashboard')} />;
}

export default App;
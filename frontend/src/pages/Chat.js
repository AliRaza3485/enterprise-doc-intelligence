import React, { useState } from 'react';
import { askQuestion } from '../services/api';

function Chat({ token, docId, onBack }) {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        if (!question.trim()) return;
        
        const userMsg = { role: 'user', text: question };
        setMessages(prev => [...prev, userMsg]);
        setQuestion('');
        setLoading(true);

        try {
            const response = await askQuestion(docId, question, token);
            const aiMsg = { role: 'ai', text: response.data.answer };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            const errMsg = { role: 'ai', text: 'Error getting answer!' };
            setMessages(prev => [...prev, errMsg]);
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.backBtn} onClick={onBack}>← Back</button>
                <h2>Chat with Document</h2>
            </div>

            <div style={styles.messages}>
                {messages.map((msg, i) => (
                    <div key={i} style={msg.role === 'user' ? styles.userMsg : styles.aiMsg}>
                        <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
                    </div>
                ))}
                {loading && <div style={styles.aiMsg}>AI is thinking...</div>}
            </div>

            <div style={styles.inputArea}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Ask a question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                />
                <button style={styles.sendBtn} onClick={handleAsk}>Send</button>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px', maxWidth: '800px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column' },
    header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' },
    backBtn: { padding: '8px 16px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    messages: { flex: 1, overflowY: 'auto', background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    userMsg: { background: '#667eea', color: 'white', padding: '10px 15px', borderRadius: '10px', marginBottom: '10px', maxWidth: '70%', marginLeft: 'auto' },
    aiMsg: { background: '#f0f2f5', padding: '10px 15px', borderRadius: '10px', marginBottom: '10px', maxWidth: '70%' },
    inputArea: { display: 'flex', gap: '10px' },
    input: { flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' },
    sendBtn: { padding: '12px 24px', background: '#2ed573', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Chat;
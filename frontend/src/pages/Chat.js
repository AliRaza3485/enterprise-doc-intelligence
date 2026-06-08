// import React, { useState } from 'react';
// import { askQuestion } from '../services/api';

// function Chat({ token, docId, onBack }) {
//     const [question, setQuestion] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const handleAsk = async () => {
//         if (!question.trim()) return;
        
//         const userMsg = { role: 'user', text: question };
//         setMessages(prev => [...prev, userMsg]);
//         setQuestion('');
//         setLoading(true);

//         try {
//             const response = await askQuestion(docId, question, token);
//             const aiMsg = { role: 'ai', text: response.data.answer };
//             setMessages(prev => [...prev, aiMsg]);
//         } catch (err) {
//             const errMsg = { role: 'ai', text: 'Error getting answer!' };
//             setMessages(prev => [...prev, errMsg]);
//         }
//         setLoading(false);
//     };

//     return (
//         <div style={styles.container}>
//             <div style={styles.header}>
//                 <button style={styles.backBtn} onClick={onBack}>← Back</button>
//                 <h2>Chat with Document</h2>
//             </div>

//             <div style={styles.messages}>
//                 {messages.map((msg, i) => (
//                     <div key={i} style={msg.role === 'user' ? styles.userMsg : styles.aiMsg}>
//                         <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
//                     </div>
//                 ))}
//                 {loading && <div style={styles.aiMsg}>AI is thinking...</div>}
//             </div>

//             <div style={styles.inputArea}>
//                 <input
//                     style={styles.input}
//                     type="text"
//                     placeholder="Ask a question..."
//                     value={question}
//                     onChange={(e) => setQuestion(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
//                 />
//                 <button style={styles.sendBtn} onClick={handleAsk}>Send</button>
//             </div>
//         </div>
//     );
// }

// const styles = {
//     container: { padding: '20px', maxWidth: '800px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column' },
//     header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' },
//     backBtn: { padding: '8px 16px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
//     messages: { flex: 1, overflowY: 'auto', background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
//     userMsg: { background: '#667eea', color: 'white', padding: '10px 15px', borderRadius: '10px', marginBottom: '10px', maxWidth: '70%', marginLeft: 'auto' },
//     aiMsg: { background: '#f0f2f5', padding: '10px 15px', borderRadius: '10px', marginBottom: '10px', maxWidth: '70%' },
//     inputArea: { display: 'flex', gap: '10px' },
//     input: { flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' },
//     sendBtn: { padding: '12px 24px', background: '#2ed573', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
// };

// export default Chat;

import React, { useState, useRef, useEffect } from 'react';
import { askQuestion } from '../services/api';
import { useTheme } from '../App';

function Chat({ token, docId, docName, onBack, chatHistory, onSelectChat }) {
  const { theme, themeName, setThemeName, themes } = useTheme();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim() || loading) return;
    const userMsg = { role: 'user', text: question, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);
    try {
      const response = await askQuestion(docId, question, token);
      setMessages(prev => [...prev, { role: 'ai', text: response.data.answer, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error getting answer. Please try again.', time: '' }]);
    }
    setLoading(false);
  };

  const ThemePicker = () => (
    <div style={{ display: 'flex', gap: '6px' }}>
      {Object.entries(themes).map(([key, t]) => (
        <button key={key} title={t.name} onClick={() => setThemeName(key)} style={{
          width: '20px', height: '20px', borderRadius: '50%', background: t.accent,
          border: themeName === key ? `2px solid ${theme.text}` : '2px solid transparent',
          cursor: 'pointer', transition: 'all 0.2s', transform: themeName === key ? 'scale(1.2)' : 'scale(1)',
        }} />
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'DM Sans', sans-serif", background: theme.bg }}>

      {/* Sidebar */}
      <div style={{ width: '240px', background: theme.sidebar, borderRight: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📄</div>
            <div style={{ color: theme.text, fontWeight: '700', fontSize: '13px' }}>DocIntel</div>
          </div>
        </div>

        {/* Back button */}
        <div style={{ padding: '12px 12px 0' }}>
          <button onClick={onBack} style={{
            width: '100%', padding: '10px 12px', background: theme.accentSoft,
            border: 'none', borderRadius: '8px', color: theme.accent,
            cursor: 'pointer', fontSize: '13px', fontWeight: '600', textAlign: 'left',
          }}>← Back to Docs</button>
        </div>

        {/* Chat History */}
        <div style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
          <div style={{ color: theme.textMuted, fontSize: '10px', fontWeight: '600', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '4px' }}>RECENT CHATS</div>
          {chatHistory.length === 0 ? (
            <div style={{ color: theme.textMuted, fontSize: '12px', textAlign: 'center', padding: '12px' }}>No history yet</div>
          ) : (
            chatHistory.map((h, i) => (
              <div key={i} onClick={() => onSelectChat(h.docId, h.docName)}
                style={{
                  padding: '10px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px',
                  background: h.docId === docId ? theme.accentSoft : 'transparent',
                  border: h.docId === docId ? `1px solid ${theme.accent}40` : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (h.docId !== docId) e.currentTarget.style.background = theme.cardHover; }}
                onMouseLeave={e => { if (h.docId !== docId) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ color: h.docId === docId ? theme.accent : theme.text, fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  💬 {h.docName}
                </div>
                <div style={{ color: theme.textMuted, fontSize: '10px', marginTop: '2px' }}>{h.time}</div>
              </div>
            ))
          )}
        </div>

        {/* Theme */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${theme.border}` }}>
          <div style={{ color: theme.textMuted, fontSize: '10px', fontWeight: '600', letterSpacing: '1px', marginBottom: '8px' }}>THEME</div>
          <ThemePicker />
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${theme.border}`, background: theme.sidebar, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: theme.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📄</div>
          <div>
            <div style={{ color: theme.text, fontWeight: '700', fontSize: '15px' }}>{docName}</div>
            <div style={{ color: theme.success, fontSize: '12px' }}>● Active</div>
          </div>
          <div style={{ marginLeft: 'auto', color: theme.textMuted, fontSize: '13px' }}>{messages.length} messages</div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', margin: 'auto', color: theme.textMuted }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: theme.textSecondary, marginBottom: '8px' }}>Start a conversation</div>
              <div style={{ fontSize: '13px' }}>Ask anything about your document</div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.role === 'user' ? theme.accent : theme.card, border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div style={{ maxWidth: '65%' }}>
                <div style={{
                  padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  background: msg.role === 'user' ? theme.userBubble : theme.aiBubble,
                  color: msg.role === 'user' ? '#fff' : theme.text,
                  border: `1px solid ${msg.role === 'user' ? 'transparent' : theme.border}`,
                  fontSize: '14px', lineHeight: '1.6',
                }}>
                  {msg.text}
                </div>
                {msg.time && <div style={{ color: theme.textMuted, fontSize: '11px', marginTop: '4px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.time}</div>}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: theme.card, border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🤖</div>
              <div style={{ padding: '12px 18px', background: theme.aiBubble, borderRadius: '4px 16px 16px 16px', border: `1px solid ${theme.border}` }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: theme.accent, animation: `bounce 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${theme.border}`, background: theme.sidebar }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: theme.inputBg, borderRadius: '12px', padding: '6px 6px 6px 16px', border: `1px solid ${theme.border}` }}>
            <input
              type="text" placeholder="Ask anything about your document..."
              value={question} onChange={e => setQuestion(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAsk()}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: theme.text, fontSize: '14px', padding: '8px 0' }}
            />
            <button onClick={handleAsk} disabled={loading || !question.trim()} style={{
              padding: '10px 20px', background: loading || !question.trim() ? theme.border : theme.accent,
              color: loading || !question.trim() ? theme.textMuted : '#fff',
              border: 'none', borderRadius: '8px', cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: '600', transition: 'all 0.2s',
            }}>Send</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

export default Chat;

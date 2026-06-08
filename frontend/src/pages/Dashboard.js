// import React, { useState, useEffect } from 'react';
// import { listDocuments, uploadDocument, processDocument } from '../services/api';

// function Dashboard({ token, onLogout, onChat }) {
//     const [documents, setDocuments] = useState([]);
//     const [uploading, setUploading] = useState(false);
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//     fetchDocuments();
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     const fetchDocuments = async () => {
//         try {
//             const response = await listDocuments(token);
//             setDocuments(response.data.documents);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const handleUpload = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         setUploading(true);
//         try {
//             await uploadDocument(file, token);
//             setMessage('File uploaded successfully!');
//             fetchDocuments();
//         } catch (err) {
//             setMessage('Upload failed!');
//         }
//         setUploading(false);
//     };

//     const handleProcess = async (docId) => {
//         try {
//             setMessage('Processing document...');
//             await processDocument(docId, token);
//             setMessage('Document processed! Ready to chat!');
//             fetchDocuments();
//         } catch (err) {
//             setMessage('Processing failed!');
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <div style={styles.header}>
//                 <h1 style={styles.title}>Enterprise Doc Intelligence</h1>
//                 <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
//             </div>

//             <div style={styles.uploadSection}>
//                 <h2>Upload Document</h2>
//                 <input type="file" accept=".pdf,.txt,.docx" onChange={handleUpload} />
//                 {uploading && <p>Uploading...</p>}
//                 {message && <p style={styles.message}>{message}</p>}
//             </div>

//             <div style={styles.docList}>
//                 <h2>Your Documents</h2>
//                 {documents.map(doc => (
//                     <div key={doc.id} style={styles.docCard}>
//                         <span>{doc.filename}</span>
//                         <span style={styles.status}>{doc.status}</span>
//                         <div>
//                             {doc.status !== 'processed' && (
//                                 <button style={styles.processBtn} onClick={() => handleProcess(doc.id)}>
//                                     Process
//                                 </button>
//                             )}
//                             {doc.status === 'processed' && (
//                                 <button style={styles.chatBtn} onClick={() => onChat(doc.id)}>
//                                     Chat
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// const styles = {
//     container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
//     header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
//     title: { color: '#333' },
//     logoutBtn: { padding: '8px 16px', background: '#ff4757', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
//     uploadSection: { background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
//     docList: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
//     docCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' },
//     status: { color: '#667eea', fontWeight: 'bold' },
//     processBtn: { padding: '8px 16px', background: '#ffa502', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' },
//     chatBtn: { padding: '8px 16px', background: '#2ed573', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
//     message: { color: 'green', marginTop: '10px' }
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { listDocuments, uploadDocument, processDocument } from '../services/api';
import { useTheme } from '../App';

const ThemePicker = ({ theme, themeName, setThemeName, themes }) => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    {Object.entries(themes).map(([key, t]) => (
      <button
        key={key}
        title={t.name}
        onClick={() => setThemeName(key)}
        style={{
          width: '22px', height: '22px', borderRadius: '50%',
          background: t.accent, border: themeName === key ? `2px solid ${theme.text}` : '2px solid transparent',
          cursor: 'pointer', transition: 'all 0.2s', transform: themeName === key ? 'scale(1.2)' : 'scale(1)',
        }}
      />
    ))}
  </div>
);

function Dashboard({ token, onLogout, onChat, chatHistory }) {
  const { theme, themeName, setThemeName, themes } = useTheme();
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => { fetchDocuments(); }, []); // eslint-disable-line

  const fetchDocuments = async () => {
    try {
      const response = await listDocuments(token);
      setDocuments(response.data.documents);
    } catch (err) { console.error(err); }
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg); setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadDocument(file, token);
      showMessage('✓ File uploaded successfully!', 'success');
      fetchDocuments();
    } catch (err) { showMessage('✗ Upload failed!', 'error'); }
    setUploading(false);
  };

  const handleProcess = async (docId) => {
    try {
      showMessage('⟳ Processing document...', 'info');
      await processDocument(docId, token);
      showMessage('✓ Ready to chat!', 'success');
      fetchDocuments();
    } catch (err) { showMessage('✗ Processing failed!', 'error'); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const msgColor = messageType === 'success' ? theme.success : messageType === 'error' ? theme.danger : theme.accent;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: '260px', background: theme.sidebar, borderRight: `1px solid ${theme.border}`,
        display: 'flex', flexDirection: 'column', padding: '0', flexShrink: 0,
        boxShadow: theme.shadow,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📄</div>
            <div>
              <div style={{ color: theme.text, fontWeight: '700', fontSize: '14px', letterSpacing: '-0.3px' }}>DocIntel</div>
              <div style={{ color: theme.textMuted, fontSize: '11px' }}>Enterprise AI</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: '16px 12px' }}>
          <div style={{ color: theme.textMuted, fontSize: '10px', fontWeight: '600', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '8px' }}>NAVIGATION</div>
          <div style={{ background: theme.accentSoft, borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>🗂️</span>
            <span style={{ color: theme.accent, fontSize: '14px', fontWeight: '600' }}>Documents</span>
          </div>
        </div>

        {/* Chat History */}
        <div style={{ padding: '0 12px', flex: 1, overflowY: 'auto' }}>
          <div style={{ color: theme.textMuted, fontSize: '10px', fontWeight: '600', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '8px' }}>RECENT CHATS</div>
          {chatHistory.length === 0 ? (
            <div style={{ color: theme.textMuted, fontSize: '12px', padding: '8px', textAlign: 'center' }}>No chats yet</div>
          ) : (
            chatHistory.map((h, i) => (
              <div key={i}
                onClick={() => onChat(h.docId, h.docName)}
                style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = theme.cardHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ color: theme.text, fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>💬 {h.docName}</div>
                <div style={{ color: theme.textMuted, fontSize: '11px', marginTop: '2px' }}>{h.time}</div>
              </div>
            ))
          )}
        </div>

        {/* Theme Picker + Logout */}
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${theme.border}` }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: theme.textMuted, fontSize: '10px', fontWeight: '600', letterSpacing: '1px', marginBottom: '8px' }}>THEME</div>
            <ThemePicker theme={theme} themeName={themeName} setThemeName={setThemeName} themes={themes} />
          </div>
          <button onClick={onLogout} style={{
            width: '100%', padding: '10px', background: 'transparent',
            border: `1px solid ${theme.border}`, borderRadius: '8px',
            color: theme.danger, cursor: 'pointer', fontSize: '13px', fontWeight: '600',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = theme.danger; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme.danger; }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto', background: theme.bg }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ color: theme.text, fontSize: '26px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>Document Intelligence</h1>
            <p style={{ color: theme.textMuted, margin: '6px 0 0', fontSize: '14px' }}>Upload, process, and chat with your documents</p>
          </div>

          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            style={{
              background: dragOver ? theme.accentSoft : theme.card,
              border: `2px dashed ${dragOver ? theme.accent : theme.border}`,
              borderRadius: '14px', padding: '32px', textAlign: 'center',
              marginBottom: '24px', transition: 'all 0.2s', cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{uploading ? '⏳' : '📂'}</div>
            <div style={{ color: theme.text, fontWeight: '600', fontSize: '15px', marginBottom: '6px' }}>
              {uploading ? 'Uploading...' : 'Drop your file here'}
            </div>
            <div style={{ color: theme.textMuted, fontSize: '13px', marginBottom: '16px' }}>PDF, TXT, DOCX supported</div>
            <label style={{
              padding: '10px 24px', background: theme.accent, color: '#fff',
              borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
              display: 'inline-block', transition: 'background 0.2s',
            }}>
              Browse File
              <input type="file" accept=".pdf,.txt,.docx" onChange={e => handleUpload(e.target.files[0])} style={{ display: 'none' }} />
            </label>
            {message && (
              <div style={{ marginTop: '14px', color: msgColor, fontSize: '14px', fontWeight: '500' }}>{message}</div>
            )}
          </div>

          {/* Documents List */}
          <div style={{ background: theme.card, borderRadius: '14px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: theme.text, margin: 0, fontSize: '16px', fontWeight: '700' }}>Your Documents</h2>
              <span style={{ color: theme.textMuted, fontSize: '13px' }}>{documents.length} files</span>
            </div>

            {documents.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: theme.textMuted }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                <div>No documents yet. Upload one above!</div>
              </div>
            ) : (
              documents.map((doc, i) => (
                <div key={doc.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 24px', borderBottom: i < documents.length - 1 ? `1px solid ${theme.border}` : 'none',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = theme.cardHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: theme.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                      {doc.filename.endsWith('.pdf') ? '📕' : doc.filename.endsWith('.docx') ? '📘' : '📄'}
                    </div>
                    <div>
                      <div style={{ color: theme.text, fontSize: '14px', fontWeight: '500' }}>{doc.filename}</div>
                      <div style={{ color: doc.status === 'processed' ? theme.success : theme.warning, fontSize: '12px', marginTop: '2px', textTransform: 'capitalize' }}>
                        {doc.status === 'processed' ? '✓ Ready' : '○ ' + doc.status}
                      </div>
                    </div>
                  </div>
                  <div>
                    {doc.status !== 'processed' ? (
                      <button onClick={() => handleProcess(doc.id)} style={{
                        padding: '8px 18px', background: theme.warning, color: '#1a1a1a',
                        border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                      }}>Process</button>
                    ) : (
                      <button onClick={() => onChat(doc.id, doc.filename)} style={{
                        padding: '8px 18px', background: theme.accent, color: '#fff',
                        border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                      }}>💬 Chat</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

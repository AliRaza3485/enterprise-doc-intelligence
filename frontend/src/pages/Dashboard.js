import React, { useState, useEffect } from 'react';
import { listDocuments, uploadDocument, processDocument } from '../services/api';

function Dashboard({ token, onLogout, onChat }) {
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
    fetchDocuments();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchDocuments = async () => {
        try {
            const response = await listDocuments(token);
            setDocuments(response.data.documents);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            await uploadDocument(file, token);
            setMessage('File uploaded successfully!');
            fetchDocuments();
        } catch (err) {
            setMessage('Upload failed!');
        }
        setUploading(false);
    };

    const handleProcess = async (docId) => {
        try {
            setMessage('Processing document...');
            await processDocument(docId, token);
            setMessage('Document processed! Ready to chat!');
            fetchDocuments();
        } catch (err) {
            setMessage('Processing failed!');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Enterprise Doc Intelligence</h1>
                <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
            </div>

            <div style={styles.uploadSection}>
                <h2>Upload Document</h2>
                <input type="file" accept=".pdf,.txt,.docx" onChange={handleUpload} />
                {uploading && <p>Uploading...</p>}
                {message && <p style={styles.message}>{message}</p>}
            </div>

            <div style={styles.docList}>
                <h2>Your Documents</h2>
                {documents.map(doc => (
                    <div key={doc.id} style={styles.docCard}>
                        <span>{doc.filename}</span>
                        <span style={styles.status}>{doc.status}</span>
                        <div>
                            {doc.status !== 'processed' && (
                                <button style={styles.processBtn} onClick={() => handleProcess(doc.id)}>
                                    Process
                                </button>
                            )}
                            {doc.status === 'processed' && (
                                <button style={styles.chatBtn} onClick={() => onChat(doc.id)}>
                                    Chat
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { color: '#333' },
    logoutBtn: { padding: '8px 16px', background: '#ff4757', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    uploadSection: { background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    docList: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    docCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' },
    status: { color: '#667eea', fontWeight: 'bold' },
    processBtn: { padding: '8px 16px', background: '#ffa502', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' },
    chatBtn: { padding: '8px 16px', background: '#2ed573', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    message: { color: 'green', marginTop: '10px' }
};

export default Dashboard;
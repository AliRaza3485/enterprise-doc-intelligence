import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://52.66.42.176:8000'
});

export const register = (data) => 
    API.post('/auth/register', data);

export const login = (data) => 
    API.post('/auth/login', data);

export const uploadDocument = (file, token) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post(`/documents/upload?token=${token}`, formData);
};

export const listDocuments = (token) => 
    API.get(`/documents/list?token=${token}`);

export const processDocument = (docId, token) => 
    API.post(`/chat/process/${docId}?token=${token}`);

export const askQuestion = (docId, question, token) => 
    API.post(`/chat/ask?token=${token}`, { doc_id: docId, question });
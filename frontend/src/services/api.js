import axios from 'axios';
import { getStoredToken, writeStoredSession } from './authStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      writeStoredSession(null);
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export const register = async (details) => {
  const res = await api.post('/auth/register', details);
  return res.data;
};

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const logout = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export const startScan = async (repositoryUrl) => {
  const res = await api.post('/scan', { repositoryUrl });
  return res.data;
};

export const getScan = async (scanId) => {
  const res = await api.get(`/scan/${scanId}`);
  return res.data;
};

export const getFindings = async (scanId) => {
  const res = await api.get(`/findings/${scanId}`);
  return res.data;
};

export const getAgentActivity = async (scanId) => {
  const res = await api.get(`/agent-activity/${scanId}`);
  return res.data;
};

export const generateRemediation = async (scanId, findingId, file, requestedModel = 'gemini-3.5-flash') => {
  const res = await api.post(`/remediation/${scanId}`, { findingId, file, requestedModel });
  return res.data;
};

export const createPullRequest = async (scanId, patchDetails) => {
  const res = await api.post(`/github/create-pr/${scanId}`, patchDetails);
  return res.data;
};

export const getScanHistory = async () => {
  const res = await api.get('/history');
  return res.data;
};

export const downloadReport = async (scanId) => {
  const res = await api.get(`/export-report/${scanId}`, { responseType: 'blob' });
  const blobUrl = URL.createObjectURL(res.data);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `RepoSentinel_Audit_${scanId}.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
};

export const askAssistant = async ({ question, scan, selectedModel }) => {
  const res = await api.post('/assistant', { question, scan, selectedModel });
  return res.data;
};

export default api;

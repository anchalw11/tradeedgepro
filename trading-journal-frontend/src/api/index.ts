import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/journal';

// This is a dummy enterprise token for development.
// In a real application, this would be handled via a proper authentication flow.
const DUMMY_ENTERPRISE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY3OTg1ODQyMywianRpIjoiZGUzYjJlYjYtYjM4Yi00M2RkLThjYjctZGIyZGI3YjZlYjYwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNjc5ODU4NDIzLCJleHAiOjE2Nzk4NjIwMjN9.4a-G4z-Y4Z-Y4z-Y4z-Y4z-Y4z-Y4z-Y4z-Y';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || DUMMY_ENTERPRISE_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getDashboardStats = () => apiClient.get('/dashboard');
export const getTrades = (params = {}) => apiClient.get('/filter', { params });
interface TradeData {
  date: string;
  asset: string;
  direction: 'buy' | 'sell';
  entry_price: number;
  exit_price: number;
  sl?: number;
  tp?: number;
  lot_size: number;
  notes?: string;
  outcome: 'win' | 'loss';
  strategy_tag?: string;
  prop_firm?: string;
}

interface ImageData {
  trade_id: number;
  image: string;
}

export const addTrade = (tradeData: TradeData) => apiClient.post('/add-trade', tradeData);
export const uploadScreenshot = (imageData: ImageData) => apiClient.post('/upload-screenshot', imageData);
export const exportTrades = (format = 'csv') => apiClient.get('/export', { params: { format }, responseType: 'blob' });

export default apiClient;

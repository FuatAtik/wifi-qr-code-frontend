import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://wifi-qr-code-backend.vercel.app';

export interface WiFiQRCode {
  id: string;
  label: string;           // Network Name
  ssid: string;           // Network SSID
  password: string;       // Network Password
  securityType: string;   // WPA/WPA2
  isHidden: boolean;      // Hidden Network
  description?: string;   // Optional Description
  qrCode: string;        // Generated QR Code
  createdAt: string;
  updatedAt: string;
  createdBy: string;     // user id
}

interface QRCodeState {
  qrCodes: WiFiQRCode[];
  isLoading: boolean;
  error: string | null;
  fetchQRCodes: () => Promise<void>;
  addQRCode: (qrCode: Omit<WiFiQRCode, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'qrCode'>) => Promise<void>;
  updateQRCode: (id: string, qrCode: Partial<WiFiQRCode>) => Promise<void>;
  deleteQRCode: (id: string) => Promise<void>;
  getQRCodeById: (id: string) => WiFiQRCode | undefined;
}

export const useQRCodeStore = create<QRCodeState>()((set, get) => ({
  qrCodes: [],
  isLoading: false,
  error: null,
  
  fetchQRCodes: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/api/qrcodes`);
      set({ qrCodes: response.data, isLoading: false });
    } catch (error) {
      console.error('Fetch QR codes error:', error);
      set({ error: 'Failed to fetch QR codes', isLoading: false });
    }
  },
  
  addQRCode: async (qrCode) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/api/qrcodes`, qrCode);
      set((state) => ({
        qrCodes: [response.data, ...state.qrCodes],
        isLoading: false
      }));
    } catch (error) {
      console.error('Add QR code error:', error);
      set({ error: 'Failed to add QR code', isLoading: false });
      throw error;
    }
  },
  
  updateQRCode: async (id, updatedQRCode) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.put(`${API_URL}/api/qrcodes/${id}`, updatedQRCode);
      set((state) => ({
        qrCodes: state.qrCodes.map((qrCode) => 
          qrCode.id === id ? response.data : qrCode
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Update QR code error:', error);
      set({ error: 'Failed to update QR code', isLoading: false });
      throw error;
    }
  },
  
  deleteQRCode: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`${API_URL}/api/qrcodes/${id}`);
      set((state) => ({
        qrCodes: state.qrCodes.filter((qrCode) => qrCode.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('Delete QR code error:', error);
      set({ error: 'Failed to delete QR code', isLoading: false });
      throw error;
    }
  },
  
  getQRCodeById: (id) => {
    return get().qrCodes.find((qrCode) => qrCode.id === id);
  },
}));

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Wifi, ShieldCheck, 
  Copy, TrashIcon, Download, QrCode, Eye, 
  X, Clock, ArrowLeft, CheckCheck
} from 'lucide-react';
import { useQRCodeStore, WiFiQRCode } from '../store/qrcode';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { qrCodes, deleteQRCode, fetchQRCodes, isLoading, error } = useQRCodeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQRCodes, setFilteredQRCodes] = useState<WiFiQRCode[]>([]);
  const [selectedQRCode, setSelectedQRCode] = useState<WiFiQRCode | null>(null);
  const [copiedText, setCopiedText] = useState('');
  
  // Get query params
  const queryParams = new URLSearchParams(location.search);
  const selectedId = queryParams.get('id');
  
  // Fetch QR codes on mount
  useEffect(() => {
    fetchQRCodes();
  }, [fetchQRCodes]);
  
  // Generate WiFi QR code content
  const generateWiFiQRContent = (qrCode: WiFiQRCode) => {
    return `WIFI:T:${qrCode.securityType};S:${qrCode.ssid};P:${qrCode.password};H:${qrCode.isHidden ? 'true' : 'false'};;`;
  };
  
  // Handle filtering based on search
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const filtered = qrCodes.filter(
      (qrCode) =>
        qrCode.label.toLowerCase().includes(lowerSearchTerm) ||
        qrCode.ssid.toLowerCase().includes(lowerSearchTerm) ||
        qrCode.description?.toLowerCase().includes(lowerSearchTerm)
    );
    
    setFilteredQRCodes(filtered);
  }, [searchTerm, qrCodes]);
  
  // Set selected QR code from URL query parameter
  useEffect(() => {
    if (selectedId) {
      const code = qrCodes.find(code => code.id === selectedId);
      if (code) {
        setSelectedQRCode(code);
      }
    }
  }, [selectedId, qrCodes]);
  
  // Handle copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };
  
  // Handle QR code download
  const downloadQRCode = () => {
    if (!selectedQRCode) return;
    
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `wifi-qr-${selectedQRCode.label.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Handle delete QR code
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this QR code?')) {
      try {
        await deleteQRCode(id);
        if (selectedQRCode?.id === id) {
          closeDetail();
        }
      } catch (error) {
        console.error('Failed to delete QR code:', error);
      }
    }
  };
  
  // Close detail panel
  const closeDetail = () => {
    setSelectedQRCode(null);
    navigate('/qrcodes', { replace: true });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-[80vh]">
      {/* QR code list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`space-y-6 ${selectedQRCode ? 'md:mr-96' : ''}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">QR Codes</h1>
            <p className="text-slate-600 mt-1">
              Manage your WiFi QR codes collection
            </p>
          </div>
          
          <button
            onClick={() => navigate('/create')}
            className="btn-primary"
          >
            <QrCode className="h-5 w-5" />
            Create New QR Code
          </button>
        </div>
        
        {/* Search and filters */}
        <div className="glass-card flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or SSID..."
              className="glass-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="btn-secondary">
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>
        
        {/* QR codes grid */}
        {filteredQRCodes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQRCodes.map((qrCode) => (
              <motion.div
                key={qrCode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card cursor-pointer hover:shadow-xl transition-all duration-300 border-2 ${
                  selectedQRCode?.id === qrCode.id ? 'border-cyan-400' : 'border-transparent'
                }`}
                onClick={() => {
                  setSelectedQRCode(qrCode);
                  navigate(`/qrcodes?id=${qrCode.id}`, { replace: true });
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{qrCode.label}</h3>
                    <p className="text-slate-600 text-sm mt-1">{qrCode.ssid}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleDelete(qrCode.id, e)}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQRCode(qrCode);
                        navigate(`/qrcodes?id=${qrCode.id}`, { replace: true });
                      }}
                      className="p-1.5 rounded-lg hover:bg-cyan-100 text-cyan-500"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-center p-4 bg-white rounded-lg">
                  <QRCodeCanvas
                    value={generateWiFiQRContent(qrCode)}
                    size={120}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <ShieldCheck className="h-3 w-3" />
                      {qrCode.securityType}
                    </span>
                    
                    {qrCode.isHidden && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        Hidden
                      </span>
                    )}
                  </div>
                  
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(qrCode.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card py-12 text-center">
            <QrCode className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800">No QR Codes Found</h3>
            <p className="text-slate-600 mt-2 max-w-md mx-auto">
              {searchTerm ? 'Try a different search term or' : 'Get started by'} creating your first WiFi QR code.
            </p>
            <button
              onClick={() => navigate('/create')}
              className="btn-primary mx-auto mt-6"
            >
              Create New QR Code
            </button>
          </div>
        )}
      </motion.div>
      
      {/* QR code detail panel */}
      {selectedQRCode && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="glass-card fixed right-0 top-0 bottom-0 w-full md:w-96 z-40 md:z-30 overflow-auto md:mt-16 md:mr-4 md:mb-4 md:rounded-xl"
        >
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <button
                onClick={closeDetail}
                className="btn-secondary p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-semibold text-slate-900">QR Code Details</h2>
              
              <button
                onClick={closeDetail}
                className="md:hidden p-2 rounded-full hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="flex items-center justify-center p-6 bg-white rounded-xl">
              <QRCodeCanvas
                id="qr-canvas"
                value={generateWiFiQRContent(selectedQRCode)}
                size={200}
                level="M"
                includeMargin
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Network Name
                </label>
                <div className="flex items-center justify-between bg-white/70 rounded-lg px-4 py-3 border border-white/60">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-cyan-500" />
                    <span className="font-medium">{selectedQRCode.label}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedQRCode.label, 'label')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    {copiedText === 'label' ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  SSID
                </label>
                <div className="flex items-center justify-between bg-white/70 rounded-lg px-4 py-3 border border-white/60">
                  <span>{selectedQRCode.ssid}</span>
                  <button
                    onClick={() => copyToClipboard(selectedQRCode.ssid, 'ssid')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    {copiedText === 'ssid' ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="flex items-center justify-between bg-white/70 rounded-lg px-4 py-3 border border-white/60">
                  <span>{selectedQRCode.password}</span>
                  <button
                    onClick={() => copyToClipboard(selectedQRCode.password, 'password')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    {copiedText === 'password' ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Security
                  </label>
                  <div className="bg-white/70 rounded-lg px-4 py-3 border border-white/60">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <ShieldCheck className="h-3 w-3" />
                      {selectedQRCode.securityType}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Hidden Network
                  </label>
                  <div className="bg-white/70 rounded-lg px-4 py-3 border border-white/60">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                        ${selectedQRCode.isHidden ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}
                    >
                      {selectedQRCode.isHidden ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
              
              {selectedQRCode.description && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <div className="bg-white/70 rounded-lg px-4 py-3 border border-white/60 min-h-[60px]">
                    {selectedQRCode.description}
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={downloadQRCode}
                  className="btn-primary"
                >
                  <Download className="h-5 w-5" />
                  Download QR Code
                </button>
                
                <button
                  onClick={() => handleDelete(selectedQRCode.id, new MouseEvent('click') as any)}
                  className="btn-secondary bg-white/50 text-red-600 hover:bg-red-50 border-red-100"
                >
                  <TrashIcon className="h-5 w-5" />
                  Delete QR Code
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QRCodeList;

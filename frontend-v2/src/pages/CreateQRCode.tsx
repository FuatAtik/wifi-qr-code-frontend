import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wifi, ShieldCheck, Eye, EyeOff, Save,
  QrCode, ArrowLeft, Download, RefreshCw
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useQRCodeStore } from '../store/qrcode';

const CreateQRCode: React.FC = () => {
  const navigate = useNavigate();
  const { addQRCode } = useQRCodeStore();
  
  // Form state
  const [label, setLabel] = useState('');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [securityType, setSecurityType] = useState('WPA');
  const [isHidden, setIsHidden] = useState(false);
  const [description, setDescription] = useState('');
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Generate WiFi QR code content
  const generateWiFiQRContent = () => {
    return `WIFI:T:${securityType};S:${ssid};P:${password};H:${isHidden ? 'true' : 'false'};;`;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: Record<string, string> = {};
    
    if (!label.trim()) {
      errors.label = 'Network name is required';
    }
    
    if (!ssid.trim()) {
      errors.ssid = 'SSID is required';
    }
    
    if (securityType !== 'nopass' && !password.trim()) {
      errors.password = 'Password is required for secure networks';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      // Create new QR code
      await addQRCode({
        label,
        ssid,
        password,
        securityType,
        isHidden,
        description: description.trim() || undefined,
      });
      
      navigate('/qrcodes');
    } catch (error) {
      console.error('Failed to create QR code:', error);
      setFormErrors({ submit: 'Failed to create QR code. Please try again.' });
    }
  };
  
  // Handle QR code download
  const downloadQRCode = () => {
    const canvas = document.getElementById('preview-qr-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `wifi-qr-${label.replace(/\s+/g, '-').toLowerCase() || 'new'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Reset form state
  const resetForm = () => {
    setLabel('');
    setSsid('');
    setPassword('');
    setSecurityType('WPA');
    setIsHidden(false);
    setDescription('');
    setFormErrors({});
  };
  
  // Preview is valid when we have at least the SSID
  const previewIsValid = ssid.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create QR Code</h1>
          <p className="text-slate-600 mt-1">
            Create a new WiFi QR code that users can scan to connect
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="glass-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {formErrors.submit && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {formErrors.submit}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="label" className="block text-sm font-medium text-slate-700 mb-1">
                    Network Name (Label)
                  </label>
                  <input
                    id="label"
                    type="text"
                    value={label}
                    onChange={(e) => {
                      setLabel(e.target.value);
                      if (formErrors.label) {
                        setFormErrors({ ...formErrors, label: '' });
                      }
                    }}
                    placeholder="e.g. Office WiFi"
                    className={`glass-input ${formErrors.label ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {formErrors.label && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.label}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="ssid" className="block text-sm font-medium text-slate-700 mb-1">
                    SSID (Network Name)
                  </label>
                  <input
                    id="ssid"
                    type="text"
                    value={ssid}
                    onChange={(e) => {
                      setSsid(e.target.value);
                      if (formErrors.ssid) {
                        setFormErrors({ ...formErrors, ssid: '' });
                      }
                    }}
                    placeholder="e.g. MyWiFiNetwork"
                    className={`glass-input ${formErrors.ssid ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {formErrors.ssid && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.ssid}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (formErrors.password) {
                          setFormErrors({ ...formErrors, password: '' });
                        }
                      }}
                      placeholder="WiFi password"
                      className={`glass-input ${formErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      disabled={securityType === 'nopass'}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="securityType" className="block text-sm font-medium text-slate-700 mb-1">
                      Security Type
                    </label>
                    <select
                      id="securityType"
                      value={securityType}
                      onChange={(e) => setSecurityType(e.target.value)}
                      className="glass-input"
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-5 flex items-center mt-8">
                      <input
                        id="isHidden"
                        type="checkbox"
                        checked={isHidden}
                        onChange={(e) => setIsHidden(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="isHidden" className="text-sm font-medium text-slate-700">
                        Hidden Network
                      </label>
                      <p className="text-xs text-slate-500">This network doesn't broadcast its SSID</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Add some notes about this network..."
                    className="glass-input"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  <Save className="h-5 w-5" />
                  Save QR Code
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                >
                  <RefreshCw className="h-5 w-5" />
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="glass-card space-y-6">
            <h3 className="text-xl font-semibold text-slate-900">QR Code Preview</h3>
            
            {previewIsValid ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center p-6 bg-white rounded-xl">
                  <QRCodeCanvas
                    id="preview-qr-canvas"
                    value={generateWiFiQRContent()}
                    size={200}
                    level="M"
                    includeMargin
                  />
                </div>
                
                <div className="space-y-4">
                  {label && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Network Name
                      </label>
                      <div className="flex items-center gap-2 bg-white/70 rounded-lg px-4 py-3 border border-white/60">
                        <Wifi className="h-5 w-5 text-cyan-500" />
                        <span className="font-medium">{label}</span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      SSID
                    </label>
                    <div className="bg-white/70 rounded-lg px-4 py-3 border border-white/60">
                      {ssid}
                    </div>
                  </div>
                  
                  {securityType !== 'nopass' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Security
                      </label>
                      <div className="bg-white/70 rounded-lg px-4 py-3 border border-white/60">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <ShieldCheck className="h-3 w-3" />
                          {securityType}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={downloadQRCode}
                    className="btn-secondary w-full"
                    disabled={!previewIsValid}
                  >
                    <Download className="h-5 w-5" />
                    Download Preview
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <QrCode className="h-16 w-16 text-slate-300 mb-4" />
                <h4 className="text-lg font-medium text-slate-700">QR Code Preview</h4>
                <p className="text-slate-500 mt-2 max-w-xs">
                  Fill out at least the SSID field to see a preview of your QR code.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateQRCode;

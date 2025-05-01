import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, QrCode, Users, Clock, Wifi, 
  ShieldCheck, BarChart3, TrendingUp 
} from 'lucide-react';
import { useQRCodeStore } from '../store/qrcode';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { qrCodes } = useQRCodeStore();
  
  // Calculate dashboard statistics
  const totalQRCodes = qrCodes.length;
  const recentQRCodes = qrCodes
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
    
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome to your WiFi QR code management system
          </p>
        </div>
        
        <motion.button
          variants={itemVariants}
          onClick={() => navigate('/create')}
          className="btn-primary"
        >
          <PlusCircle className="h-5 w-5" />
          Create New QR Code
        </motion.button>
      </div>
      
      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center">
            <QrCode className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-600 text-sm">Total QR Codes</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalQRCodes}</h3>
          </div>
        </div>
        
        <div className="glass-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-600 text-sm">Active Users</p>
            <h3 className="text-2xl font-bold text-slate-900">24</h3>
          </div>
        </div>
        
        <div className="glass-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-600 text-sm">Scans Today</p>
            <h3 className="text-2xl font-bold text-slate-900">143</h3>
          </div>
        </div>
        
        <div className="glass-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-600 text-sm">Secure Networks</p>
            <h3 className="text-2xl font-bold text-slate-900">
              {qrCodes.filter(qr => qr.encryption !== 'nopass').length}
            </h3>
          </div>
        </div>
      </motion.div>
      
      {/* Activity Chart */}
      <motion.div variants={itemVariants} className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">QR Code Activity</h2>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm py-1">Weekly</button>
            <button className="btn-secondary text-sm py-1 bg-white/40">Monthly</button>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-2 pt-8 px-4">
          {/* Simplified chart visualization */}
          {Array.from({ length: 7 }).map((_, i) => {
            const height = Math.floor(Math.random() * 60) + 20;
            return (
              <div key={i} className="relative group w-full">
                <div 
                  className="bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-t-md hover:from-cyan-500 hover:to-cyan-400 transition-all duration-300"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs text-center mt-2 text-slate-600">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {Math.floor(height * 2)} scans
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Latest QR Codes */}
      <motion.div variants={itemVariants} className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Recently Created QR Codes</h2>
          <button 
            onClick={() => navigate('/qrcodes')}
            className="text-cyan-600 hover:text-cyan-700 text-sm font-medium flex items-center gap-1"
          >
            View All
          </button>
        </div>
        
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">SSID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Security</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Created</th>
                </tr>
              </thead>
              <tbody>
                {recentQRCodes.map((qrCode) => (
                  <tr 
                    key={qrCode.id}
                    className="border-b border-slate-100 hover:bg-white/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/qrcodes?id=${qrCode.id}`)}
                  >
                    <td className="px-4 py-3 text-sm text-slate-800 font-medium">
                      <div className="flex items-center gap-3">
                        <Wifi className="h-4 w-4 text-cyan-500" />
                        {qrCode.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{qrCode.ssid}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                        ${qrCode.encryption === 'WPA' ? 'bg-green-100 text-green-700' : 
                          qrCode.encryption === 'WEP' ? 'bg-amber-100 text-amber-700' : 
                          'bg-red-100 text-red-700'}`}
                      >
                        <ShieldCheck className="h-3 w-3" />
                        {qrCode.encryption}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {new Date(qrCode.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {recentQRCodes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No QR codes found. Create your first one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
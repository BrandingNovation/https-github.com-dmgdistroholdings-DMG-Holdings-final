
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (password: string) => Promise<boolean> | boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
      const result = await onLogin(password);
      if (result) {
        setError(false);
      } else {
        setError(true);
        setPassword('');
      }
    } catch (err) {
      setError(true);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm mx-auto mb-6">
            <span className="text-black font-black text-lg">D</span>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">Admin Authentication</h2>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-widest">DMG Distribution Holdings // Secure Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest block">Access Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-black/40 border ${error ? 'border-red-500' : 'border-white/10'} p-4 text-sm rounded-xl focus:outline-none focus:border-white transition-all text-white`}
              placeholder="••••••••"
              autoFocus
            />
            {error && <p className="text-[10px] text-red-500 uppercase font-bold tracking-wider">Invalid credentials. Access denied.</p>}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Authorize Session'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

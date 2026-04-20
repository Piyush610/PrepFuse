import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { GitBranch, Phone, Mail, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input, Label } from '../ui/Input';

const AuthModal = () => {
  const { login, register } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('email');
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('github_status') === 'success') {
       // Since this is a demo, we mock the github token retrieval if needed.
       // A real app would use the token passed in URL or cookie.
       setError('GitHub login mock success. (Local session not linked).');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
    setLoading(false);
  };

  const handleGithubAuth = () => {
    window.location.href = 'http://localhost:5000/api/auth/github';
  };

  const sendOtp = () => {
    if (!phone) {
       setError('Please enter a valid phone number');
       return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
       setOtpSent(true);
       setLoading(false);
    }, 1500); // simulate sending SMS
  };

  const verifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
       setError('Firebase configured but credentials missing. OTP mocked failure.');
       setLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-zinc-800">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2 flex items-center justify-center gap-2">
          Verify Identity
        </h2>
        <p className="text-zinc-400 text-sm">Join PrepFusion to fast-track your placement.</p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-zinc-800 mb-6 relative">
        {['email', 'github', 'phone'].map((tab) => (
          <button
            key={tab}
            className={`flex-1 pb-3 font-medium text-sm flex items-center justify-center gap-2 transition-colors relative z-10 ${
              activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            onClick={() => {
               setActiveTab(tab);
               setError('');
               setOtpSent(false);
            }}
          >
            {tab === 'email' && <Mail className="w-4 h-4" />}
            {tab === 'github' && <GitBranch className="w-4 h-4" />}
            {tab === 'phone' && <Phone className="w-4 h-4" />}
            <span className="capitalize">{tab}</span>
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm">{error}</div>}

          {activeTab === 'email' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              
              <Button type="submit" variant="primary" className="w-full mt-6" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
              
              <p className="text-center text-sm text-zinc-500 mt-6">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button" 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </form>
          )}

          {activeTab === 'github' && (
            <div className="text-center py-6 space-y-4">
              <p className="text-sm text-zinc-400 mb-4">Link your GitHub to showcase your repositories immediately.</p>
              <Button onClick={handleGithubAuth} variant="secondary" className="w-full gap-2 text-white border-zinc-700 hover:bg-zinc-800">
                <GitBranch className="w-5 h-5" />
                Continue with GitHub
              </Button>
            </div>
          )}

          {activeTab === 'phone' && (
            <div className="text-center py-6 space-y-4">
              <p className="text-sm text-zinc-400 mb-6">Use your phone number to receive a secure OTP code via Firebase.</p>
              {!otpSent ? (
                <div className="space-y-4 text-left">
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <Button onClick={sendOtp} variant="outline" className="w-full gap-2 border-zinc-700 hover:bg-zinc-800" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Phone className="w-5 h-5" /> Send OTP via SMS</>}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div>
                    <Label>Verification Code</Label>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                    />
                  </div>
                  <Button onClick={verifyOtp} variant="primary" className="w-full" disabled={loading}>
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                  </Button>
                  <button onClick={() => setOtpSent(false)} className="text-xs text-zinc-500 hover:text-white mt-2 underline w-full text-center">Change Phone Number</button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

export default AuthModal;

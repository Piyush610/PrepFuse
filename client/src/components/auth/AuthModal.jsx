import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { GitBranch, Phone, Mail } from 'lucide-react';

const AuthModal = () => {
  const { login, register } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('email');
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="w-full max-w-md bg-card rounded-2xl shadow-xl overflow-hidden border">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome to PrepFusion</h2>
        
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`flex-1 pb-3 font-medium text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'email' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('email')}
          >
            <Mail className="w-4 h-4" /> Email
          </button>
          <button
            className={`flex-1 pb-3 font-medium text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'github' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('github')}
          >
            <GitBranch className="w-4 h-4" /> GitHub
          </button>
          <button
             className={`flex-1 pb-3 font-medium text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'phone' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('phone')}
          >
            <Phone className="w-4 h-4" /> Phone
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md text-sm">{error}</div>}

        {activeTab === 'email' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors mt-2"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </form>
        )}

        {/* Placeholder logic for future OAuth/OTP implementation in phase 2 */}
        {activeTab === 'github' && (
          <div className="text-center py-6">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 border rounded-md bg-[#24292e] text-white hover:bg-[#2c3137] transition-colors">
              <GitBranch className="w-5 h-5" />
              Continue with GitHub
            </button>
            <p className="text-xs text-muted-foreground mt-4">GitHub integration coming in Phase 2</p>
          </div>
        )}

        {activeTab === 'phone' && (
          <div className="text-center py-6">
             <button className="w-full flex items-center justify-center gap-2 py-2.5 border rounded-md hover:bg-muted transition-colors font-medium">
              <Phone className="w-5 h-5" />
              Send OTP via SMS
            </button>
            <p className="text-xs text-muted-foreground mt-4">Firebase OTP coming in Phase 2</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthModal;

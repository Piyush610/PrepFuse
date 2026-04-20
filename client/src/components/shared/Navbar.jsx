import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, User, Activity, Sparkles, History } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!user) return null;

  const NavLink = ({ to, label, icon: Icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
          isActive 
            ? 'bg-indigo-500/10 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
            : 'text-zinc-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-container rounded-[1.5rem] inner-glow px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tighter text-white">PrepFuse</span>
          </Link>
          
          <div className="hidden md:flex space-x-1">
            <NavLink to="/dashboard" label="DSA Tracker" icon={Activity} />
            <NavLink to="/interview" label="AI Interview" icon={Activity} />
            <NavLink to="/history" label="History" icon={History} />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/profile" className="flex items-center gap-3 group px-2 py-1 rounded-full hover:bg-white/5 transition-colors">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-none">{user.name}</p>
              <p className="text-[10px] text-zinc-500 font-medium mt-1">Premium Member</p>
            </div>
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-full border-2 border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 flex justify-center items-center font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
          
          <button 
            onClick={logout} 
            className="text-zinc-500 hover:text-red-400 transition-all p-2 rounded-xl hover:bg-red-400/10"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

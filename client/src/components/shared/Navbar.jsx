import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Sun, Moon, LogOut, User, Activity, Code2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  if (!user) return null;

  const NavLink = ({ to, label, icon: Icon }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${location.pathname === to ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-xl font-bold text-primary flex items-center gap-2">
              <Code2 className="w-6 h-6" />
              PrepFusion
            </Link>
            
            <div className="hidden md:flex space-x-2">
              <NavLink to="/dashboard" label="DSA Tracker" icon={Activity} />
              <NavLink to="/interview" label="AI Interview" icon={User} />
              <NavLink to="/history" label="History" icon={Activity} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-4 pl-4 border-l">
              <Link to="/profile" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                 {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border" />
                 ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex justify-center items-center font-bold">
                       {user.name.charAt(0).toUpperCase()}
                    </div>
                 )}
                 <span className="hidden sm:inline">{user.name}</span>
              </Link>
              
              <button 
                onClick={logout} 
                className="text-muted-foreground hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

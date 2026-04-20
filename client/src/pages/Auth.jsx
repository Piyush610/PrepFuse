import React from 'react';
import { motion } from 'framer-motion';
import AuthModal from '../components/auth/AuthModal';

const Auth = () => {
  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-zinc-950">
      {/* Left Decoration / Split Screen */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 relative overflow-hidden bg-zinc-900 border-r border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/20 to-zinc-900 z-0"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg mx-auto text-left"
        >
          <h1 className="text-5xl font-extrabold text-white mb-6">Gain the Developer Edge.</h1>
          <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
            Upload your resume, track your data structures mastery, and nail your interviews with real-time AI feedback. Prepfusion unlocks your hiring potential.
          </p>
          
          <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30 text-purple-400 font-bold">
                A+
              </div>
              <div>
                <h4 className="text-white font-semibold">Perfect Score AI Evaluation</h4>
                <p className="text-zinc-400 text-sm">"Clear communication of LIFO principles."</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
         <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
         <AuthModal />
      </div>
    </div>
  );
};

export default Auth;

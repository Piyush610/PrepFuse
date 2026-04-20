import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, BarChart3, ShieldCheck, ArrowRight, Play } from 'lucide-react';

const Landing = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-4 overflow-hidden">
      {/* Background Orbs */}
      <div className="bg-orb orb-indigo" />
      <div className="bg-orb orb-violet" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 glass-container border-b-0 m-6 rounded-[2rem] inner-glow max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">PrepFuse</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/auth" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors hidden md:block">Features</Link>
          <Link to="/auth" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors hidden md:block">Pricing</Link>
          <Link 
            to="/auth" 
            className="px-6 py-2.5 bg-white text-black font-black rounded-full hover:bg-zinc-200 transition-all text-sm shadow-xl shadow-white/5"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl w-full pt-40 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-container p-12 md:p-20 rounded-[3.5rem] inner-glow relative overflow-hidden mb-16"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-30" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Now with Gemini 1.5 Pro
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1] text-white">
            Master the <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300">
              Technical Interview
            </span>
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            The intelligent preparation platform that adapts to your performance. 
            PrepFuse identifies your gaps and drills you with AI simulations.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link 
              to="/auth" 
              className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-2xl shadow-indigo-500/30 group"
            >
              Start Free Training <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-white" /> Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {[
            { 
              icon: <BrainCircuit className="w-7 h-7 text-indigo-400" />, 
              title: "Adaptive AI", 
              desc: "Dynamic questions that evolve based on your resume and performance." 
            },
            { 
              icon: <BarChart3 className="w-7 h-7 text-purple-400" />, 
              title: "Topic Radar", 
              desc: "Interactive charts and heatmaps to visualize your technical mastery." 
            },
            { 
              icon: <ShieldCheck className="w-7 h-7 text-emerald-400" />, 
              title: "Graded Prep", 
              desc: "Get instant grades on clarity, relevance, and technical depth." 
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
              className="glass-container p-10 rounded-[2.5rem] inner-glow gradient-border text-left hover:bg-white/[0.04] transition-all"
            >
              <div className="mb-6 p-4 bg-white/5 rounded-2xl inline-block">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 text-zinc-600 text-xs font-bold uppercase tracking-[0.3em]">
        &copy; {new Date().getFullYear()} PrepFuse System. Secured & Encrypted.
      </footer>
    </div>
  );
};

export default Landing;

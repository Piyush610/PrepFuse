import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-4">
      {/* Background Orbs */}
      <div className="bg-orb orb-indigo" />
      <div className="bg-orb orb-violet" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 glass-container border-b-0 m-4 rounded-2xl inner-glow">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tighter">PrepFuse</span>
        </div>
        <Link 
          to="/auth" 
          className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-all text-sm shadow-xl shadow-white/10"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl w-full pt-32 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-container p-12 rounded-[2.5rem] inner-glow relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50" />
          
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight leading-[1.1]">
            Ace Your Next <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Technical Interview
            </span>
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The intelligent preparation platform that adapts to your performance. 
            PrepFuse identifies your gaps in DSA and drills you with AI-powered simulations.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              to="/auth" 
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-2xl shadow-indigo-500/40 group"
            >
              Start Free Training <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold rounded-2xl transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full">
          {[
            { 
              icon: <BrainCircuit className="w-6 h-6 text-indigo-400" />, 
              title: "Adaptive AI", 
              desc: "Dynamic questions that evolve based on your resume and weak topics." 
            },
            { 
              icon: <BarChart3 className="w-6 h-6 text-purple-400" />, 
              title: "Real-time Analytics", 
              desc: "Radar charts and heatmaps to visualize your technical proficiency." 
            },
            { 
              icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />, 
              title: "Skill Verification", 
              desc: "Get graded on clarity, relevance, and technical depth for every answer." 
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
              className="glass-container p-8 rounded-3xl inner-glow gradient-border text-left hover:scale-[1.02] transition-transform"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-zinc-600 text-sm">
        &copy; {new Date().getFullYear()} PrepFuse. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;

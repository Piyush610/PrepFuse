import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Code2, LineChart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse animation-delay-4000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center space-x-2 text-blue-400 font-semibold mb-6 tracking-wide uppercase text-sm"
          >
            <Sparkles className="w-5 h-5" />
            <span>AI-Powered Placement Prep</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white"
          >
            Fuse Your Preparation. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Crack Your Placement.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 max-w-md mx-auto text-xl text-zinc-400 sm:text-2xl md:mt-5 md:max-w-3xl"
          >
            Track your DSA progress, practice with personalized AI interviews, and get placement-ready faster.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4"
          >
            <Button size="lg" variant="primary" onClick={() => navigate('/auth')}>
              Get Started for Free
            </Button>
            <Button size="lg" variant="glass" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
              Learn More
            </Button>
          </motion.div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
          <FeatureCard 
            delay={0.5}
            icon={<Code2 className="w-8 h-8 text-blue-400" />}
            title="DSA Tracker" 
            desc="Log problems from LeetCode & Codeforces. Visualize your strengths and uncover weak topics." 
          />
          <FeatureCard 
            delay={0.6}
            icon={<BrainCircuit className="w-8 h-8 text-purple-400" />}
            title="AI Interviewer" 
            desc="Simulate real technical interviews. The AI dynamically adapts questions to your weak DSA topics." 
          />
          <FeatureCard 
            delay={0.7}
            icon={<LineChart className="w-8 h-8 text-indigo-400" />}
            title="Smart Analytics" 
            desc="Get detailed feedback on clarity and relevance to master behavioral and technical rounds." 
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    <Card className="h-full flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
      <CardHeader>
        <div className="mb-4 mx-auto p-4 bg-zinc-800/50 rounded-2xl shadow-inner inline-flex border border-zinc-700/50">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardDescription className="text-zinc-400 leading-relaxed text-base">
        {desc}
      </CardDescription>
    </Card>
  </motion.div>
);

export default Landing;

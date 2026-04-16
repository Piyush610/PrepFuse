import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Code2, LineChart } from 'lucide-react';

const Landing = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Master the Interview with <br />
          <span className="text-primary">PrepFusion</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-xl text-muted-foreground sm:text-2xl md:mt-5 md:max-w-3xl">
          Track your DSA progress, practice with personalized AI interviews, and get placement-ready faster.
        </p>
        <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4">
          <Link to="/auth" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 md:py-4 md:text-lg sm:w-auto transition-colors">
            Get Started
          </Link>
        </div>
      </div>

      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <FeatureCard 
          icon={<Code2 className="w-10 h-10 text-primary" />}
          title="DSA Tracker" 
          desc="Log problems from LeetCode & Codeforces. Visualize your strengths and uncover weak topics." 
        />
        <FeatureCard 
          icon={<BrainCircuit className="w-10 h-10 text-primary" />}
          title="AI Interviewer" 
          desc="Simulate real technical interviews. The AI dynamically adapts questions to your weak DSA topics." 
        />
        <FeatureCard 
          icon={<LineChart className="w-10 h-10 text-primary" />}
          title="Smart Analytics" 
          desc="Get detailed feedback on clarity and relevance to master behavioral and technical rounds." 
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }) => (
  <div className="p-6 bg-card border rounded-2xl shadow-sm flex flex-col items-center text-center">
    <div className="mb-4 p-3 bg-muted rounded-full">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{desc}</p>
  </div>
);

export default Landing;

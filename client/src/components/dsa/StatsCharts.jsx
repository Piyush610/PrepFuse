import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { Target, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const StatsCharts = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dsa/insights');
      setStats(data);
    } catch (error) {
      console.error('Error fetching DSA stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Card className="glass-container h-64 flex items-center justify-center animate-pulse"><p className="text-zinc-500">Loading mastery data...</p></Card>;
  }

  const radarData = Object.keys(stats?.topicCounts || {}).map(key => ({
    topic: key,
    solved: stats.topicCounts[key],
  }));

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Mastery Radar */}
      <Card className="glass-container border-0 rounded-[2rem] inner-glow h-[450px] flex flex-col overflow-hidden">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" /> Topic Mastery
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 pt-6">
          {radarData.length >= 3 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="topic" fontSize={10} tick={{ fill: '#888' }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar 
                  name="Solved" 
                  dataKey="solved" 
                  stroke="#6366f1" 
                  fill="#6366f1" 
                  fillOpacity={0.3} 
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-zinc-500 flex-col">
                <BrainCircuit className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Solve 3+ categories to visualize.</p>
             </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insights Card */}
      <Card className="glass-container border-0 rounded-[2rem] inner-glow overflow-hidden">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-indigo-400">
            <BrainCircuit className="w-5 h-5" /> AI Personalized Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {stats?.weakTopics && stats.weakTopics.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                   <h4 className="font-bold text-indigo-400 flex items-center gap-2 mb-2">
                     <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span> Analysis Focus
                   </h4>
                   <p className="text-zinc-300 text-xs leading-relaxed">System has identified <strong className="text-white">{stats.weakTopics[0]}</strong> as a growth opportunity. Expect tailored interview questions in this vector.</p>
                </div>
                {stats.weakTopics[1] && (
                  <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-2xl text-xs">
                    <p className="text-zinc-400 font-medium italic">Secondary focus: {stats.weakTopics[1]}</p>
                  </div>
                )}
              </div>
          ) : (
              <div className="text-center text-zinc-600 py-8 text-sm">
                 Complete more submissions to unlock AI analysis.
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCharts;

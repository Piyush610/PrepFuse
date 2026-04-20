import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { Flame, BrainCircuit, Target } from 'lucide-react';
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
    return <Card className="h-64 flex items-center justify-center animate-pulse"><p className="text-zinc-500">Loading your mastery data...</p></Card>;
  }

  // Transform topic counts for Recharts
  const radarData = Object.keys(stats?.topicCounts || {}).map(key => ({
    topic: key,
    solved: stats.topicCounts[key],
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="flex items-center gap-4 hover:-translate-y-1 transition-transform border-orange-500/20">
            <div className="p-4 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20 shadow-inner">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium">Activity Streak</p>
              <p className="text-3xl font-extrabold text-white">{stats?.streak?.current || 0} <span className="text-lg text-zinc-500 font-normal">Days</span></p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="flex items-center gap-4 hover:-translate-y-1 transition-transform border-blue-500/20">
            <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shadow-inner">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium">Problems Solved</p>
              <p className="text-3xl font-extrabold text-white">{stats?.totalSolved || 0}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="flex items-center gap-4 hover:-translate-y-1 transition-transform border-red-500/20">
            <div className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 shadow-inner">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-zinc-400 font-medium">Weakest Topic</p>
              <p className="text-2xl font-bold text-white truncate">{stats?.weakTopics?.[0] || 'N/A'}</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Topic Mastery Radar</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            {radarData.length > 2 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#3f3f46" />
                  <PolarAngleAxis dataKey="topic" fontSize={12} tick={{ fill: '#a1a1aa' }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar name="Solved" dataKey="solved" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-zinc-500 flex-col">
                  <Target className="w-12 h-12 mb-3 opacity-20" />
                  <p>Solve topics in at least 3 categories to chart.</p>
               </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="mb-2">AI Personalized Insights</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.weakTopics && stats.weakTopics.length > 0 ? (
                  <div className="w-full space-y-4">
                    <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
                       <h4 className="font-bold text-red-400 flex items-center gap-2 mb-2">
                         <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Priority Focus Area
                       </h4>
                       <p className="text-white text-sm leading-relaxed">You are struggling with <strong className="text-red-300">{stats.weakTopics[0]}</strong>. Our AI Interviewer will heavily target this topic to build your confidence.</p>
                    </div>
                    {stats.weakTopics[1] && (
                        <div className="p-5 bg-orange-500/10 border border-orange-500/30 rounded-xl backdrop-blur-sm">
                        <h4 className="font-bold text-orange-400 flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500"></span> Needs Improvement
                        </h4>
                        <p className="text-white text-sm leading-relaxed"><strong className="text-orange-300">{stats.weakTopics[1]}</strong> questions are slowing you down. Practice more medium-level problems.</p>
                     </div>
                    )}
                  </div>
              ) : (
                  <div className="text-center text-zinc-500 py-12">
                     Integrate more problems to unlock real-time AI insights.
                  </div>
              )}
            </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default StatsCharts;

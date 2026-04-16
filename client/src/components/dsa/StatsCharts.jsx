import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '../../services/api';
import { Flame, BrainCircuit, Target } from 'lucide-react';

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
    return <div className="h-64 flex items-center justify-center animate-pulse bg-muted rounded-xl">Loading stats...</div>;
  }

  // Transform topic counts for Recharts
  const radarData = Object.keys(stats?.topicCounts || {}).map(key => ({
    topic: key,
    solved: stats.topicCounts[key],
  }));

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-lg">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-2xl font-bold">{stats?.streak?.current || 0} Days</p>
          </div>
        </div>
        
        <div className="bg-card border p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-lg">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Solved</p>
            <p className="text-2xl font-bold">{stats?.totalSolved || 0}</p>
          </div>
        </div>

        <div className="bg-card border p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-lg">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Weakest Topic</p>
            <p className="text-xl font-bold truncate">{stats?.weakTopics?.[0] || 'None yet'}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6 h-[400px]">
          <h3 className="font-semibold mb-4 text-lg">Topic Mastery Radar</h3>
          {radarData.length > 2 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="topic" fontSize={12} />
                <PolarRadiusAxis />
                <Radar name="Solved" dataKey="solved" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-muted-foreground flex-col">
                <Target className="w-12 h-12 mb-3 opacity-20" />
                <p>Solve topics in at least 3 categories</p>
             </div>
          )}
        </div>

        <div className="bg-card border rounded-xl p-6 flex flex-col items-center justify-center">
            <h3 className="font-semibold mb-4 text-lg text-center w-full">Personalized Insights</h3>
            {stats?.weakTopics && stats.weakTopics.length > 0 ? (
                <div className="w-full space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg">
                     <p className="text-sm font-semibold text-red-600 dark:text-red-400">⚠️ Priority Focus Area</p>
                     <p className="mt-1">You are struggling with <strong>{stats.weakTopics[0]}</strong>. Our AI Interviewer will heavily target this topic.</p>
                  </div>
                  {stats.weakTopics[1] && (
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900 rounded-lg">
                      <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">⚡ Needs Improvement</p>
                      <p className="mt-1"><strong>{stats.weakTopics[1]}</strong> questions are slowing you down. Practice more medium-level problems.</p>
                   </div>
                  )}
                </div>
            ) : (
                <div className="text-center text-muted-foreground w-full py-12">
                   Add more problems to generate AI insights.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;

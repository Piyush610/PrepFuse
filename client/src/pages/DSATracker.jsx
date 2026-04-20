import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trophy, Flame, Target, ChevronRight, Search, Filter, LayoutGrid } from 'lucide-react';
import StatsCharts from '../components/dsa/StatsCharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';

const DSATracker = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [problems, setProblems] = useState([
    { id: 1, title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', status: 'Solved', date: '2024-03-20' },
    { id: 2, title: 'Longest Substring', difficulty: 'Medium', topic: 'Strings', status: 'Solved', date: '2024-03-19' },
    { id: 3, title: 'Merge K Sorted Lists', difficulty: 'Hard', topic: 'Heaps', status: 'In Progress', date: '2024-03-18' },
  ]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8 relative">
      {/* Background Accents */}
      <div className="bg-orb orb-indigo opacity-10" />
      <div className="bg-orb orb-violet opacity-5" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">My Prep Dashboard</h1>
          <p className="text-zinc-500 font-medium text-sm flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" /> Comprehensive tracking of your technical progress.
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/10 rounded-2xl px-8 py-6 font-bold transition-all"
        >
          <Plus className="w-5 h-5 mr-1" /> New Entry
        </Button>
      </div>

      {/* Stats Cards - Horizontal Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Flame className="w-5 h-5 text-orange-500" />, label: "Daily Streak", value: "12 Days", trend: "+15%" },
          { icon: <Trophy className="w-5 h-5 text-yellow-500" />, label: "Total Solved", value: "248", trend: "+3 this week" },
          { icon: <Target className="w-5 h-5 text-indigo-500" />, label: "Accuracy Rate", value: "76%", trend: "Top Tier" }
        ].map((stat, idx) => (
          <Card key={idx} className="glass-container border-0 rounded-3xl inner-glow group hover:scale-[1.02] transition-all">
            <CardContent className="pt-8 pb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-indigo-500/10 transition-colors">{stat.icon}</div>
                <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">{stat.trend}</span>
              </div>
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
              <p className="text-4xl font-black text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-container border-0 rounded-[2.5rem] inner-glow overflow-hidden relative p-2">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
               <CardContent className="pt-8">
                  <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] ml-1">Problem Title</Label>
                      <Input placeholder="Two Sum" className="bg-white/[0.03] border-white/10 rounded-2xl h-12 focus:bg-white/[0.06] transition-all" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] ml-1">Topic</Label>
                      <Input placeholder="Arrays" className="bg-white/[0.03] border-white/10 rounded-2xl h-12 focus:bg-white/[0.06] transition-all" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] ml-1">Difficulty</Label>
                      <select className="w-full h-12 px-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white">
                        <option className="bg-[#0a0a0c]">Easy</option>
                        <option className="bg-[#0a0a0c]">Medium</option>
                        <option className="bg-[#0a0a0c]">Hard</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full h-12 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all">Submit Entry</Button>
                    </div>
                  </form>
               </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Table Section - Now span 8 columns */}
        <div className="xl:col-span-8 space-y-6">
          <Card className="glass-container border-0 rounded-[2.5rem] inner-glow overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.01]">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-zinc-500" /> Recent Activity
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-xl"><Search className="w-4 h-4 text-zinc-500" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-xl"><Filter className="w-4 h-4 text-zinc-500" /></Button>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-5 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em]">Title</th>
                    <th className="px-8 py-5 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em]">Topic</th>
                    <th className="px-8 py-5 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em]">Level</th>
                    <th className="px-8 py-5 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-5 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {problems.map((prob) => (
                    <tr key={prob.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-bold text-white group-hover:text-indigo-400 transition-all">{prob.title}</p>
                        <p className="text-[10px] text-zinc-600 font-bold mt-1 uppercase tracking-widest">{prob.date}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-zinc-400 border border-white/5 uppercase">{prob.topic}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          prob.difficulty === 'Easy' ? 'text-emerald-500' : 
                          prob.difficulty === 'Medium' ? 'text-orange-500' : 'text-red-500'
                        }`}>
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${prob.status === 'Solved' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-zinc-700'}`} />
                           <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{prob.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-white/5 rounded-xl transition-all">
                          <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Charts Section - Now span 4 columns */}
        <div className="xl:col-span-4 h-full">
          <StatsCharts />
        </div>
      </div>
    </div>
  );
};

export default DSATracker;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trophy, Flame, Target, ChevronRight, Search, Filter } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative">
      {/* Background Accents for inner pages */}
      <div className="bg-orb orb-indigo opacity-20" />
      <div className="bg-orb orb-violet opacity-10" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Performance Dashboard</h1>
          <p className="text-zinc-500 font-medium text-sm">Welcome back, track your progress and crush your goals.</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 rounded-2xl px-6 py-6 gap-2"
        >
          <Plus className="w-5 h-5" /> Log New Submission
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Flame className="w-5 h-5 text-orange-500" />, label: "Current Streak", value: "12 Days", sub: "+2 from yesterday" },
          { icon: <Trophy className="w-5 h-5 text-yellow-500" />, label: "Problems Solved", value: "248", sub: "Top 5% this week" },
          { icon: <Target className="w-5 h-5 text-indigo-500" />, label: "Success Rate", value: "76%", sub: "Improving steadily" }
        ].map((stat, idx) => (
          <Card key={idx} className="glass-container border-0 rounded-3xl inner-glow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/5 rounded-xl">{stat.icon}</div>
                <span className="text-zinc-500 text-sm font-semibold">{stat.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{stat.value}</span>
                <span className="text-xs text-emerald-500 font-bold">{stat.sub}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="glass-container border-0 rounded-[2rem] inner-glow mb-8 overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
               <CardHeader>
                  <CardTitle className="text-2xl font-bold">New Problem Entry</CardTitle>
               </CardHeader>
               <CardContent>
                  <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                      <Label className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Problem Title</Label>
                      <Input placeholder="e.g. Binary Tree Level Order" className="bg-white/5 border-white/10 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Category</Label>
                      <Input placeholder="e.g. Trees" className="bg-white/5 border-white/10 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Difficulty</Label>
                      <select className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white">
                        <option className="bg-zinc-950">Easy</option>
                        <option className="bg-zinc-950">Medium</option>
                        <option className="bg-zinc-950">Hard</option>
                      </select>
                    </div>
                    <Button className="bg-white text-black font-bold hover:bg-zinc-200 rounded-xl h-10">Add Problem</Button>
                  </form>
               </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-container border-0 rounded-[2rem] inner-glow overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
              <CardTitle className="text-xl font-bold">Recent Submissions</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="hover:bg-white/5 rounded-xl"><Filter className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" className="hover:bg-white/5 rounded-xl"><Search className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Problem</th>
                    <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Topic</th>
                    <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Difficulty</th>
                    <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {problems.map((prob) => (
                    <tr key={prob.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{prob.title}</p>
                        <p className="text-[10px] text-zinc-600 font-medium mt-1 uppercase tracking-tighter">{prob.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-zinc-400">{prob.topic}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-black ${
                          prob.difficulty === 'Easy' ? 'text-emerald-400' : 
                          prob.difficulty === 'Medium' ? 'text-orange-400' : 'text-red-400'
                        }`}>
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${prob.status === 'Solved' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-orange-500 animate-pulse'}`} />
                           <span className="text-xs font-bold text-zinc-300">{prob.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                          <ChevronRight className="w-4 h-4 text-zinc-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="lg:col-span-1">
          <StatsCharts />
        </div>
      </div>
    </div>
  );
};

export default DSATracker;

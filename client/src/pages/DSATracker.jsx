import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatsCharts from '../components/dsa/StatsCharts';
import { Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const TOPICS = ['Array', 'String', 'LinkedList', 'Tree', 'Graph', 'DP', 'Heap', 'Stack', 'Recursion', 'Sorting', 'Searching', 'Other'];
const PLATFORMS = ['LeetCode', 'Codeforces', 'GeeksForGeeks', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const DSATracker = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', platform: 'LeetCode', difficulty: 'Easy', topic: 'Array', link: '' });
  const [refreshStats, setRefreshStats] = useState(0); 

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const { data } = await api.get('/dsa/problems');
      setProblems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/dsa/problems', formData);
      setProblems([data, ...problems]);
      setShowForm(false);
      setFormData({ name: '', platform: 'LeetCode', difficulty: 'Easy', topic: 'Array', link: '' });
      setRefreshStats(prev => prev + 1); 
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding problem');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this problem?")) return;
    try {
      await api.delete(`/dsa/problems/${id}`);
      setProblems(problems.filter(p => p._id !== id));
      setRefreshStats(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const getDifficultyBadge = (level) => {
    const map = { Easy: 'success', Medium: 'warning', Hard: 'danger' };
    return <Badge variant={map[level]}>{level}</Badge>;
  };

  const selectStyles = "flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors appearance-none";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Background Ambience */}
      <div className="absolute top-40 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-4xl font-extrabold text-white tracking-tight">DSA Dashboard</h1>
           <p className="text-zinc-400 mt-2">Log submissions to build the intelligence of your AI Interviewer.</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'}
          onClick={() => setShowForm(!showForm)}
          className="shrink-0 gap-2"
        >
          {showForm ? <><X className="w-5 h-5"/> Cancel</> : <><Plus className="w-5 h-5"/> Log Submission</>}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            className="mb-8"
          >
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleAddProblem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-end">
                  <div className="lg:col-span-2">
                    <Label>Problem Name</Label>
                    <Input required type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} placeholder="e.g. Reverse Linked List" />
                  </div>
                  <div>
                    <Label>Platform</Label>
                    <select value={formData.platform} onChange={(e)=>setFormData({...formData, platform: e.target.value})} className={selectStyles}>
                      {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Topic Focus</Label>
                    <select value={formData.topic} onChange={(e)=>setFormData({...formData, topic: e.target.value})} className={selectStyles}>
                      {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                   <div>
                    <Label>Difficulty Level</Label>
                    <select value={formData.difficulty} onChange={(e)=>setFormData({...formData, difficulty: e.target.value})} className={selectStyles}>
                      {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <Button type="submit" variant="primary" className="w-full">Save Entry</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-12">
         <StatsCharts key={refreshStats} />
      </div>

      <Card className="overflow-hidden p-0 bg-zinc-900 border-zinc-800 shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-800/80 border-b border-zinc-800 text-zinc-300 uppercase text-xs font-bold tracking-wider">
                    <tr>
                        <th className="px-6 py-5">Problem Details</th>
                        <th className="px-6 py-5">Classification</th>
                        <th className="px-6 py-5">Difficulty</th>
                        <th className="px-6 py-5 hidden sm:table-cell">Date Cleared</th>
                        <th className="px-6 py-5 text-right">Settings</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                    {loading ? (
                        <tr><td colSpan="5" className="text-center py-12">Loading problem history...</td></tr>
                    ) : problems.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-16 text-zinc-500 font-medium text-base">Your history is clear. Complete a problem and log it to build traction!</td></tr>
                    ) : (
                        problems.map((p) => (
                            <tr key={p._id} className="hover:bg-zinc-800/50 transition-colors group">
                                <td className="px-6 py-5 font-semibold text-white">
                                  {p.name}
                                </td>
                                <td className="px-6 py-5">
                                  <Badge variant="default" className="text-zinc-400 bg-zinc-800">{p.topic}</Badge>
                                </td>
                                <td className="px-6 py-5">
                                  {getDifficultyBadge(p.difficulty)}
                                </td>
                                <td className="px-6 py-5 hidden sm:table-cell text-zinc-500">
                                   {new Date(p.solvedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button onClick={() => handleDelete(p._id)} className="text-zinc-600 hover:text-red-400 p-2 rounded-md hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};

export default DSATracker;

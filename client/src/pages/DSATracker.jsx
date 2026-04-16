import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatsCharts from '../components/dsa/StatsCharts';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

const TOPICS = ['Array', 'String', 'LinkedList', 'Tree', 'Graph', 'DP', 'Heap', 'Stack', 'Recursion', 'Sorting', 'Searching', 'Other'];
const PLATFORMS = ['LeetCode', 'Codeforces', 'GeeksForGeeks', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const DSATracker = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', platform: 'LeetCode', difficulty: 'Easy', topic: 'Array', link: '' });
  const [refreshStats, setRefreshStats] = useState(0); // crude trigger to reload StatsCharts

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
      setRefreshStats(prev => prev + 1); // Ping stats component
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

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">DSA Progress Tracker</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition"
        >
          {showForm ? 'Cancel' : <><Plus className="w-5 h-5"/> Log Problem</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddProblem} className="bg-card border p-6 rounded-xl mb-8 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-1">Problem Name</label>
            <input required type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary bg-background" placeholder="Two Sum" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Platform</label>
            <select value={formData.platform} onChange={(e)=>setFormData({...formData, platform: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary bg-background">
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Topic</label>
            <select value={formData.topic} onChange={(e)=>setFormData({...formData, topic: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary bg-background">
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <select value={formData.difficulty} onChange={(e)=>setFormData({...formData, difficulty: e.target.value})} className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary bg-background">
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <button type="submit" className="w-full py-2 bg-foreground text-background font-medium rounded-md hover:opacity-90 transition">Save</button>
          </div>
        </form>
      )}

      {/* Analytics Dashboard injected here */}
      <div className="mb-12">
         <StatsCharts key={refreshStats} />
      </div>

      {/* Problems Table */}
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
                    <tr>
                        <th className="px-6 py-4">Problem Name</th>
                        <th className="px-6 py-4">Topic</th>
                        <th className="px-6 py-4">Difficulty</th>
                        <th className="px-6 py-4">Date Solved</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {loading ? (
                        <tr><td colSpan="5" className="text-center py-8 text-muted-foreground">Loading problems...</td></tr>
                    ) : problems.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-12 text-muted-foreground text-base">You haven't logged any problems yet. Keep grinding!</td></tr>
                    ) : (
                        problems.map((p) => (
                            <tr key={p._id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 font-medium flex items-center gap-2">
                                  {p.name}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{p.topic}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${difficultyColors[p.difficulty]}`}>
                                    {p.difficulty}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{new Date(p.solvedAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default DSATracker;

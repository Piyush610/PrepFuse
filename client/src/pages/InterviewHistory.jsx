import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { History, Target, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const InterviewHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/interview/history');
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse text-muted-foreground">Loading history...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><History className="w-8 h-8 text-primary"/> Interview History</h1>
        <Link to="/interview" className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition">
           Start New Session
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {sessions.length === 0 ? (
            <div className="col-span-full py-16 text-center border-2 border-dashed rounded-2xl">
               <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
               <p className="text-lg font-medium text-muted-foreground">No interview sessions found</p>
               <p className="text-sm text-muted-foreground mt-1">Start a session to get AI feedback.</p>
            </div>
         ) : (
            sessions.map((sess) => (
              <div key={sess._id} className="bg-card border rounded-2xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
                {sess.status === 'In Progress' && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider uppercase">Incomplete</div>
                )}
                
                <h3 className="text-xl font-bold mb-4">{sess.type} Interview</h3>
                
                <div className="space-y-3 mb-6">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4"/> {new Date(sess.createdAt).toLocaleDateString()}
                   </div>
                   <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Target className="w-4 h-4 mt-0.5 shrink-0"/> 
                      <span className="line-clamp-2">Focused: {sess.weakTopicsFocused?.length ? sess.weakTopicsFocused.join(', ') : 'General'}</span>
                   </div>
                </div>

                <div className="flex items-end justify-between border-t pt-4">
                   <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Overall Score</p>
                      <p className="text-2xl font-bold text-primary">{sess.totalScore ? sess.totalScore.toFixed(1) : '-'}/10</p>
                   </div>
                   {sess.status === 'Completed' ? (
                     <span className="text-sm font-medium text-muted-foreground cursor-pointer hover:underline">View Details →</span>
                   ) : (
                     <Link to="/interview" className="text-sm font-medium text-orange-500 hover:underline">Continue Session</Link>
                   )}
                </div>
              </div>
            ))
         )}
      </div>
    </div>
  );
};

export default InterviewHistory;

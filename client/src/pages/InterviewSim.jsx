import React, { useState } from 'react';
import api from '../services/api';
import { Send, IterationCcw, CheckCircle2, Bot, BrainCircuit, Code2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const InterviewSim = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const startInterview = async (type) => {
    setLoading(true);
    try {
      const { data } = await api.post('/interview/start', { type, questionCount: 3 });
      setSession(data);
      setCurrentQ(0);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to start interview');
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const questionId = session.questions[currentQ]._id;
      const { data } = await api.post(`/interview/${session._id}/submit`, { questionId, answer });
      
      setSession(data);
      setAnswer('');
      if (currentQ < 4) { // 5 questions total, index 0-4
          setCurrentQ(currentQ + 1);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting answer');
    }
    setSubmitting(false);
  };

  if (!session) {
    return (
      <div className="relative max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
         {/* Background Orbs */}
        <div className="absolute top-10 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-20 pointer-events-none"></div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-10">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-6 border border-blue-500/20">
            <Bot className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4 text-white tracking-tight">AI Interview Simulator</h1>
          <p className="text-zinc-400 text-xl mb-16 max-w-2xl mx-auto leading-relaxed">
            Start with basic questions and level up as you perform better. Our AI engine targets your weak DSA topics to forge placement readiness into your profile.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
            <Card 
              onClick={() => startInterview('Technical')}
              className="cursor-pointer hover:-translate-y-2 transition-transform duration-300 border-indigo-500/20 hover:border-indigo-500/50 bg-zinc-900/50 group text-left p-8"
              glass={true}
            >
              <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center font-bold text-xl mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform shadow-inner">
                <Code2 className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Technical Round</h2>
              <p className="text-zinc-400 leading-relaxed">Purely algorithmic focuses from DSA fundamentals to advanced System Design architecture.</p>
              <div className="mt-6 flex gap-2">
                <Badge variant="primary">Algorithms</Badge>
                <Badge variant="warning">Data Structures</Badge>
              </div>
            </Card>

            <Card 
              onClick={() => startInterview('Mixed')}
              className="cursor-pointer hover:-translate-y-2 transition-transform duration-300 border-purple-500/20 hover:border-purple-500/50 bg-zinc-900/50 group text-left p-8"
              glass={true}
            >
              <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center font-bold text-xl mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform shadow-inner">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Comprehensive</h2>
              <p className="text-zinc-400 leading-relaxed">Adaptive blend of HR behavioral questions combined with dynamic Technical assessments.</p>
               <div className="mt-6 flex gap-2">
                <Badge variant="primary">Behavioral</Badge>
                <Badge variant="success">Adaptive</Badge>
              </div>
            </Card>
          </div>
          
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 flex flex-col items-center justify-center text-blue-400 gap-3">
                 <Loader2 className="w-8 h-8 animate-spin" />
                 <p className="font-medium tracking-wider uppercase text-sm">Spinning up adaptive session kernel...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  const isCompleted = session.status === 'Completed';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-800">
        <div>
           <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-extrabold text-white">Simulation Active</h1>
              <Badge variant={session.difficulty === 'Easy' ? 'success' : session.difficulty === 'Medium' ? 'warning' : 'danger'}>
                {session.difficulty} Mode
              </Badge>
           </div>
           <p className="text-zinc-400 text-sm font-medium flex gap-6 tracking-wide">
              <span>Type: <span className="text-white">{session.type}</span></span>
              <span>Progression: <span className="text-white">Q {currentQ + 1} / 5</span></span>
           </p>
        </div>
        {isCompleted && (
           <div className="text-right p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-inner">
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Final Vector</p>
              <p className="text-4xl font-extrabold text-blue-400">{session.totalScore?.toFixed(1)} <span className="text-xl text-zinc-600">/ 10</span></p>
           </div>
        )}
      </div>

      {!isCompleted ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 md:p-12 shadow-2xl relative overflow-hidden border-zinc-700/50" glass={true}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl mix-blend-screen pointer-events-none"></div>
              
              <div className="flex items-center gap-2 mb-8 text-sm font-bold text-blue-400 tracking-wider uppercase">
                  <CheckCircle2 className="w-5 h-5" /> 
                  <span>Targeting Vector: {session.weakTopicsFocused?.[0] || 'General Fundamentals'}</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-10 text-white leading-relaxed">
                {session.questions[currentQ].question}
              </h2>

              <div className="space-y-6 relative z-10">
                <textarea 
                  className="w-full h-48 p-5 border border-zinc-700 bg-zinc-900/80 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none resize-none font-medium leading-relaxed shadow-inner placeholder:text-zinc-600 transition-colors"
                  placeholder="Draft your response block..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={submitting}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={submitAnswer}
                    disabled={submitting || !answer.trim()}
                    variant="primary"
                    size="lg"
                    className="gap-2 shadow-blue-500/20"
                  >
                    {submitting ? (
                       <><Loader2 className="w-5 h-5 animate-spin"/> Analyzing Output...</>
                    ) : (
                       <><Send className="w-5 h-5"/> Transmit Answer</>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
           <div className="p-5 border border-green-500/30 bg-green-500/10 rounded-xl flex items-center justify-between shadow-inner backdrop-blur-sm">
             <div className="flex items-center gap-3 text-green-400 font-bold text-lg">
               <CheckCircle2 className="w-7 h-7" /> Assessment Completed & Indexed
             </div>
             <span className="text-xs font-bold uppercase tracking-wider text-green-600">Saved to Cloud</span>
           </div>

           {session.questions.map((q, idx) => (
             <Card key={q._id || idx} className="overflow-hidden p-0 border-zinc-800 shadow-xl">
               <div className="p-8 border-b border-zinc-800 bg-zinc-900/50">
                 <div className="flex justify-between items-start mb-6 gap-4">
                    <h3 className="font-bold text-xl text-white leading-relaxed">
                       <span className="text-zinc-500 mr-2">Q{idx+1}.</span>{q.question}
                    </h3>
                    <Badge variant={q.level === 'Easy' ? 'success' : q.level === 'Medium' ? 'warning' : 'danger'} className="shrink-0">
                       {q.level}
                    </Badge>
                 </div>
                 <div className="p-5 border border-zinc-800 bg-zinc-950 rounded-xl text-zinc-400 italic text-sm leading-relaxed shadow-inner">
                   "{q.userAnswer}"
                 </div>
               </div>

               {q.aiFeedback && (
                 <div className="p-8 bg-zinc-900/30">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                         <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Relevance</span>
                         <span className="text-2xl font-extrabold text-white">{q.aiFeedback.relevanceScore}<span className="text-sm text-zinc-600">/10</span></span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                         <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Clarity</span>
                         <span className="text-2xl font-extrabold text-white">{q.aiFeedback.clarityScore}<span className="text-sm text-zinc-600">/10</span></span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                         <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Technical</span>
                         <span className="text-2xl font-extrabold text-white">{q.aiFeedback.technicalScore}<span className="text-sm text-zinc-600">/10</span></span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 shadow-inner">
                         <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Overall</span>
                         <span className="text-2xl font-extrabold text-blue-400">{q.aiFeedback.overallScore}<span className="text-sm text-blue-800">/10</span></span>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <h4 className="flex items-center gap-2 font-bold text-green-400 uppercase tracking-wider text-xs mb-4">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Identified Strengths
                           </h4>
                           <ul className="space-y-3">
                              {q.aiFeedback.strengths?.map((s, i) => (
                                <li key={i} className="flex items-start text-sm text-zinc-300">
                                  <span className="text-green-500 mr-2 mt-0.5">✓</span>{s}
                                </li>
                              ))}
                           </ul>
                        </div>
                        <div>
                           <h4 className="flex items-center gap-2 font-bold text-red-400 uppercase tracking-wider text-xs mb-4">
                             <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Areas to Optimize
                           </h4>
                           <ul className="space-y-3">
                              {q.aiFeedback.weaknesses?.map((w, i) => (
                                 <li key={i} className="flex items-start text-sm text-zinc-300">
                                   <span className="text-red-500 mr-2 mt-0.5">✗</span>{w}
                                 </li>
                              ))}
                           </ul>
                        </div>
                      </div>

                      <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <BrainCircuit className="w-24 h-24 text-blue-400" />
                        </div>
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4 relative z-10">Perfect Vector Output</h4>
                        <p className="text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap relative z-10">{q.aiFeedback.suggestedAnswer}</p>
                        
                        <div className="mt-6 pt-5 border-t border-blue-500/20 relative z-10">
                           <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Refinement Data</span>
                           <div className="flex flex-wrap gap-2">
                              {q.aiFeedback.suggestions?.map((s, i) => (
                                <span key={i} className="text-[11px] font-medium px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300">{s}</span>
                              ))}
                           </div>
                        </div>
                      </div>
                    </div>
                 </div>
               )}
             </Card>
           ))}

           <div className="flex justify-center mt-12 pb-12">
              <Button size="lg" variant="primary" onClick={() => window.location.reload()} className="gap-3 shadow-xl shadow-blue-500/20">
                <IterationCcw className="w-5 h-5"/> Initiate New Kernel Instance
              </Button>
           </div>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewSim;

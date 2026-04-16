import React, { useState } from 'react';
import api from '../services/api';
import { Send, IterationCcw, CheckCircle2 } from 'lucide-react';

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
      
      // Update local session state
      const updatedQs = [...session.questions];
      updatedQs[currentQ].userAnswer = answer;
      updatedQs[currentQ].aiFeedback = data.feedback;
      
      setSession({ ...session, questions: updatedQs, status: data.sessionStatus, totalScore: data.totalScore });
      setAnswer('');
      if (currentQ < session.questions.length - 1) {
          setCurrentQ(currentQ + 1);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting answer');
    }
    setSubmitting(false);
  };

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">AI Interview Simulator</h1>
        <p className="text-muted-foreground text-lg mb-12 text-center max-w-2xl">
          Get personalized questions based on your resume and your weakest DSA topics. Refine your answers with AI feedback.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button 
            onClick={() => startInterview('Technical')}
            disabled={loading}
            className="p-8 border rounded-2xl bg-card hover:border-primary transition-colors text-left flex flex-col gap-3 disabled:opacity-50 group"
          >
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-xl mb-2 group-hover:scale-110 transition-transform">T</div>
            <h2 className="text-2xl font-bold">Technical Round</h2>
            <p className="text-muted-foreground">Focuses purely on DSA, System Design, and your chosen tech stack.</p>
          </button>

          <button 
            onClick={() => startInterview('Mixed')}
            disabled={loading}
            className="p-8 border rounded-2xl bg-card hover:border-primary transition-colors text-left flex flex-col gap-3 disabled:opacity-50 group"
          >
             <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center font-bold text-xl mb-2 group-hover:scale-110 transition-transform">M</div>
            <h2 className="text-2xl font-bold">Mixed Format</h2>
            <p className="text-muted-foreground">A realistic blend of behavioral HR questions and technical deep dives.</p>
          </button>
        </div>
        {loading && <p className="mt-8 animate-pulse text-primary font-medium">Generating your personalized questions...</p>}
      </div>
    );
  }

  const isCompleted = session.status === 'Completed';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
           <h1 className="text-2xl font-bold">Session ID: {session._id.slice(-6)}</h1>
           <p className="text-muted-foreground text-sm flex gap-4 mt-1">
              <span>Type: {session.type}</span>
              <span>Status: <strong className={isCompleted ? 'text-green-500' : 'text-orange-500'}>{session.status}</strong></span>
           </p>
        </div>
        {isCompleted && (
           <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Average Score</p>
              <p className="text-3xl font-bold text-primary">{session.totalScore?.toFixed(1)} / 10</p>
           </div>
        )}
      </div>

      {!isCompleted ? (
        <div className="bg-card border rounded-2xl p-8 shadow-sm">
           <div className="flex justify-between mb-6 text-sm font-medium text-muted-foreground">
             <span>Question {currentQ + 1} of {session.questions.length}</span>
           </div>
           
           <h2 className="text-2xl font-semibold mb-8 text-foreground leading-snug">
             {session.questions[currentQ].question}
           </h2>

           <div className="space-y-4">
             <textarea 
               className="w-full h-48 p-4 border rounded-xl bg-background focus:ring-2 focus:ring-primary outline-none resize-none font-medium leading-relaxed"
               placeholder="Type your answer here as if you were speaking to the interviewer..."
               value={answer}
               onChange={(e) => setAnswer(e.target.value)}
             />
             <div className="flex justify-end">
               <button 
                 onClick={submitAnswer}
                 disabled={submitting || !answer.trim()}
                 className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition"
               >
                 {submitting ? 'Evaluating...' : <><Send className="w-4 h-4"/> Submit Answer</>}
               </button>
             </div>
           </div>
        </div>
      ) : (
        <div className="space-y-8">
           <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 font-medium">
             <CheckCircle2 className="w-6 h-6" /> Interview completed! Review your feedback below.
           </div>

           {session.questions.map((q, idx) => (
             <div key={q._id || idx} className="border rounded-2xl bg-card overflow-hidden">
               <div className="p-6 border-b bg-muted/30">
                 <h3 className="font-semibold text-lg mb-2">Q{idx+1}: {q.question}</h3>
                 <div className="p-4 bg-background border rounded-lg text-muted-foreground italic text-sm">
                   "{q.userAnswer}"
                 </div>
               </div>
               {q.aiFeedback && (
                 <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="md:col-span-1 border-r pr-6 space-y-4">
                     <div>
                       <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Clarity</span>
                       <span className="text-2xl font-bold">{q.aiFeedback.clarityScore}/10</span>
                     </div>
                     <div>
                       <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Relevance</span>
                       <span className="text-2xl font-bold">{q.aiFeedback.relevanceScore}/10</span>
                     </div>
                      <div>
                       <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Overall</span>
                       <span className="text-2xl font-bold text-primary">{q.aiFeedback.overallScore}/10</span>
                     </div>
                   </div>
                   <div className="md:col-span-2">
                     <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">AI Suggestions</span>
                     <ul className="space-y-2">
                       {q.aiFeedback.suggestions.map((s, i) => (
                         <li key={i} className="flex gap-2 text-sm text-muted-foreground items-start">
                           <span className="text-primary font-bold mt-0.5">•</span> {s}
                         </li>
                       ))}
                     </ul>
                   </div>
                 </div>
               )}
             </div>
           ))}

           <div className="flex justify-center mt-8">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-6 py-3 border font-medium rounded-lg hover:bg-muted transition"
              >
                <IterationCcw className="w-5 h-5"/> Start Another Session
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSim;

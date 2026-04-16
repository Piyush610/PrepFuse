/**
 * Analyzes problems and returns weak topics.
 * Formula: Low total solved count + high ratio of 'Easy' problems penalizes the score.
 */
export const detectWeakTopics = (problems) => {
    const topicMap = {};
    
    // Group by topic
    problems.forEach(p => {
      if (!topicMap[p.topic]) {
        topicMap[p.topic] = { easy: 0, medium: 0, hard: 0, total: 0 };
      }
      topicMap[p.topic][p.difficulty.toLowerCase()]++;
      topicMap[p.topic].total++;
    });
  
    // Calculate strength score for each topic
    // Easy gives 0.5 points, Medium 1.5 points, Hard 3 points
    const scored = Object.entries(topicMap).map(([topic, data]) => {
      const score = (data.easy * 0.5) + (data.medium * 1.5) + (data.hard * 3);
      return {
        topic,
        score,
        total: data.total
      };
    });
  
    // We consider it a completely weak topic if score is < 5 (e.g. less than ~3 mediums or 10 easys)
    // Return the top 3 weakest topics
    return scored
      .filter(t => t.score < 5)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map(t => t.topic);
  };
  
  /**
   * Calculates the current and longest streak from problem log.
   */
  export const calculateStreak = (problems) => {
    if (!problems || problems.length === 0) return { current: 0, longest: 0, lastActivity: null };
  
    // Sort descending by date
    const sorted = problems.sort((a, b) => new Date(b.solvedAt) - new Date(a.solvedAt));
    
    // Extract unique dates as YYYY-MM-DD
    const uniqueDates = [...new Set(sorted.map(p => new Date(p.solvedAt).toISOString().split('T')[0]))];
  
    let current = 1;
    let longest = 1;
  
    for (let i = 0; i < uniqueDates.length - 1; i++) {
        const d1 = new Date(uniqueDates[i]);
        const d2 = new Date(uniqueDates[i+1]);
        
        // Difference in days
        const diffTime = Math.abs(d1 - d2);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
        if (diffDays === 1) {
            current++;
            if (current > longest) longest = current;
        } else {
            // Broken streak, current stops counting backwards
            // But we must continue loop to find the actual longest streak historically
            current = 1; 
        }
    }
  
    // If user missed today and yesterday entirely, current streak is 0.
    const lastDate = new Date(uniqueDates[0]);
    const today = new Date();
    const diffFromToday = Math.ceil(Math.abs(today - lastDate) / (1000 * 60 * 60 * 24));
  
    return {
        current: diffFromToday > 1 ? 0 : current,
        longest,
        lastActivity: uniqueDates[0]
    };
  };

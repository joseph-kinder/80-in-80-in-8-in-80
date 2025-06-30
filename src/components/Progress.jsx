import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import './Progress.css';

function Progress({ progress, curriculum }) {
  // Prepare data for the chart
  const chartData = Object.entries(progress)
    .filter(([key, data]) => data.score !== undefined)
    .map(([key, data]) => ({
      day: key.startsWith('mock') ? 'Mock' : `Day ${key}`,
      score: data.score,
      date: new Date(data.date).toLocaleDateString()
    }))
    .sort((a, b) => {
      if (a.day === 'Mock' && b.day === 'Mock') return 0;
      if (a.day === 'Mock') return 1;
      if (b.day === 'Mock') return -1;
      return parseInt(a.day.split(' ')[1]) - parseInt(b.day.split(' ')[1]);
    });

  // Calculate statistics
  const completedDays = Object.keys(progress).filter(key => !key.startsWith('mock') && progress[key].completed).length;
  const mockTests = Object.keys(progress).filter(key => key.startsWith('mock')).length;
  const scores = chartData.map(d => d.score);
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const latestScore = scores.length > 0 ? scores[scores.length - 1] : 0;

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>Your Progress</h1>
        <p>Track your journey to mastering the 80 in 8 challenge</p>
      </div>
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>Days Completed</h3>
            <p className="stat-value">{completedDays} / 80</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <h3>Average Score</h3>
            <p className="stat-value">{averageScore} / 80</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <h3>Highest Score</h3>
            <p className="stat-value">{highestScore} / 80</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Latest Score</h3>
            <p className="stat-value">{latestScore} / 80</p>
          </div>
        </div>
      </div>
      {chartData.length > 0 && (
        <div className="progress-chart card">
          <h2>Score Progression</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 80]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey={() => 80} 
                stroke="#10b981" 
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="detailed-progress card">
        <h2>Detailed History</h2>
        <div className="progress-list">
          {Object.entries(progress)
            .filter(([key, data]) => data.completed || data.score)
            .sort((a, b) => new Date(b[1].date) - new Date(a[1].date))
            .map(([key, data]) => (
              <div key={key} className="progress-item">
                <div className="progress-item-header">
                  <h4>{key.startsWith('mock') ? 'Mock Test' : `Day ${key}`}</h4>
                  <span className="date">{new Date(data.date).toLocaleDateString()}</span>
                </div>                {data.score !== undefined && (
                  <div className="progress-item-score">
                    <span>Score: {data.score}/80</span>
                    {data.time && <span>Time: {Math.floor(data.time / 1000)}s</span>}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {mockTests > 0 && (
        <div className="mock-test-summary card">
          <h2>Mock Test Performance</h2>
          <p>You've completed {mockTests} mock test{mockTests > 1 ? 's' : ''}.</p>
          {highestScore >= 70 && (
            <p className="achievement">🎉 Great job! You're approaching mastery level!</p>
          )}
          {highestScore >= 80 && (
            <p className="achievement">[ACHIEVEMENT] Congratulations! You've achieved the target score!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Progress;
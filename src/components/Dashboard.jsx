import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Target, TrendingUp, Award, ChevronRight, Check, X, Lock } from 'lucide-react';
import DailyTasks from './DailyTasks';
import { isDayUnlocked } from '../data/curriculum';
import './Dashboard.css';

function Dashboard({ user, progress, curriculum, updateProgress, gamificationData }) {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  
  const currentDay = user?.currentDay || 1;
  const todaysCurriculum = curriculum?.days.find(d => d.day === currentDay);
  const dayUnlocked = isDayUnlocked(currentDay, progress, user);
  
  // Handle daily task completion
  const handleTaskComplete = (day, taskId, taskData) => {
    const dayProgress = progress[day] || { completed: false, dailyTasks: {} };
    const updatedProgress = {
      ...dayProgress,
      dailyTasks: {
        ...dayProgress.dailyTasks,
        [taskId]: taskData
      }
    };
    updateProgress(day, updatedProgress);
  };
  
  // Handle all daily tasks complete
  const handleAllTasksComplete = (day) => {
    const dayProgress = progress[day] || {};
    const updatedProgress = {
      ...dayProgress,
      dailyTasksCompleted: true
    };
    updateProgress(day, updatedProgress);
  };
  
  // Handle day training navigation
  const goToTraining = () => {
    // Check if daily tasks are complete
    const dailyTasksComplete = progress[currentDay]?.dailyTasksCompleted;
    if (!dailyTasksComplete) {
      alert('Complete all daily tasks before starting day exercises!');
      return;
    }
    navigate(`/training/${currentDay}`);
  };
  
  useEffect(() => {
    if (!user || !curriculum) return;
    
    const completedDays = Object.keys(progress).filter(key => !key.startsWith('mock') && progress[key].completed).length;
    const mockTests = Object.keys(progress).filter(key => key.startsWith('mock')).length;
    const scores = Object.values(progress).filter(p => p.score).map(p => p.score);
    const latestScore = scores.length > 0 ? scores[scores.length - 1] : user.baselineScore;
    
    // Generate dynamic tasks
    const newTasks = [
      {
        id: 'login',
        text: 'Login to the system',
        completed: true
      },
      {
        id: 'baseline',
        text: `Set baseline score (${user.baselineScore}/80)`,
        completed: true
      },
      {
        id: 'daily-tasks',
        text: `Complete today's daily tasks`,
        completed: progress[currentDay]?.dailyTasksCompleted || false
      },
      {
        id: 'current-exercises',
        text: `Complete Day ${currentDay} exercises`,
        completed: progress[currentDay]?.completed || false
      },
      {
        id: 'first-mock',
        text: 'Take your first mock test',
        completed: mockTests > 0
      },
      {
        id: 'week-complete',
        text: 'Complete first week (7 days)',
        completed: completedDays >= 7
      },
      {
        id: 'score-50',
        text: 'Achieve a score of 50+',
        completed: latestScore >= 50
      },
      {
        id: 'score-60',
        text: 'Achieve a score of 60+',
        completed: latestScore >= 60
      },
      {
        id: 'score-70',
        text: 'Achieve a score of 70+',
        completed: latestScore >= 70
      },
      {
        id: 'target-80',
        text: 'Achieve the target score of 80/80',
        completed: latestScore >= 80
      }
    ];
    
    setTasks(newTasks);
  }, [user, progress, curriculum, currentDay]);

  if (!curriculum) return <div className="loading">Loading</div>;

  const completedDays = Object.keys(progress).filter(day => progress[day].completed).length;
  const currentPhase = curriculum.phases.find(p => currentDay >= p.days[0] && currentDay <= p.days[1]);
  
  const scores = Object.values(progress).filter(p => p.score).map(p => p.score);
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="dashboard">
      <div className="terminal-window">
        <div className="terminal-header">
          <span className="terminal-title">SYSTEM STATUS</span>
        </div>
        <div className="terminal-body">
          <div className="system-info">
            <div className="info-line">
              <span className="prompt">USER</span>
              <span>{user.name}</span>
            </div>
            <div className="info-line">
              <span className="prompt">CURRENT_DAY</span>
              <span>{currentDay}/80</span>
            </div>
            <div className="info-line">
              <span className="prompt">DAY_STATUS</span>
              <span>{dayUnlocked ? 'UNLOCKED' : 'LOCKED'}</span>
            </div>
            <div className="info-line">
              <span className="prompt">PHASE</span>
              <span>{currentPhase?.name}</span>
            </div>
            <div className="info-line">
              <span className="prompt">AVG_SCORE</span>
              <span>{averageScore || user.baselineScore}/80</span>
            </div>
            <div className="info-line">
              <span className="prompt">PROGRESS</span>
              <span>[{'='.repeat(Math.floor(completedDays / 4))}{'.'.repeat(20 - Math.floor(completedDays / 4))}] {Math.round(completedDays / 80 * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Tasks Section */}
      {dayUnlocked && todaysCurriculum && (
        <DailyTasks
          curriculum={curriculum}
          progress={progress}
          currentDay={currentDay}
          onTaskComplete={handleTaskComplete}
          onAllTasksComplete={handleAllTasksComplete}
        />
      )}

      <div className="terminal-window">
        <div className="terminal-header">
          <span className="terminal-title">SYSTEM TASKS [{completedTasks}/{tasks.length}]</span>
        </div>
        <div className="terminal-body">
          <div className="task-list">
            {tasks.map((task, index) => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : 'pending'}`}>
                <span className="task-number">{String(index + 1).padStart(2, '0')}.</span>
                <span className="task-status">{task.completed ? '[X]' : '[ ]'}</span>
                <span className="task-text">{task.text}</span>
                {task.completed && <span className="task-complete-indicator"> [OK]</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="terminal-window">
        <div className="terminal-header">
          <span className="terminal-title">TODAY'S MISSION: DAY {currentDay}</span>
        </div>
        <div className="terminal-body">
          {!dayUnlocked ? (
            <div className="locked-message">
              <p className="error-text">ACCESS DENIED: Complete Day {currentDay - 1} to unlock this day.</p>
              {progress[currentDay - 1] && !progress[currentDay - 1].dailyTasksCompleted && (
                <p className="hint-text">HINT: Complete all daily tasks for Day {currentDay - 1}</p>
              )}
              {progress[currentDay - 1]?.score < todaysCurriculum?.minimumScore && (
                <p className="hint-text">HINT: Achieve minimum score of {todaysCurriculum?.minimumScore} on Day {currentDay - 1}</p>
              )}
            </div>
          ) : todaysCurriculum && (
            <>
              <h3>{todaysCurriculum.title}</h3>
              <div className="mission-details">
                <div className="detail-section">
                  <h4>OBJECTIVES:</h4>
                  {todaysCurriculum.topics.map((topic, i) => (
                    <div key={i} className="detail-line">
                      <span className="prompt">&gt;</span> {topic}
                    </div>
                  ))}
                </div>
                <div className="detail-section">
                  <h4>SUCCESS CRITERIA:</h4>
                  {todaysCurriculum.goals.map((goal, i) => (
                    <div key={i} className="detail-line">
                      <span className="prompt">&gt;</span> {goal}
                    </div>
                  ))}
                  <div className="detail-line">
                    <span className="prompt">&gt;</span> Minimum score: {todaysCurriculum.minimumScore}/80
                  </div>
                </div>
              </div>
              
              {!progress[currentDay]?.dailyTasksCompleted ? (
                <div className="btn-terminal disabled">
                  <span className="prompt">&gt;&gt;</span> COMPLETE DAILY TASKS FIRST
                </div>
              ) : (
                <button onClick={goToTraining} className="btn-terminal">
                  <span className="prompt">&gt;&gt;</span> INITIATE TRAINING SEQUENCE
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">DAYS_COMPLETE</div>
          <div className="stat-value">{completedDays}</div>
          <div className="stat-bar">
            <div className="stat-bar-fill" style={{ width: `${(completedDays / 80) * 100}%` }}></div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-label">CURRENT_SCORE</div>
          <div className="stat-value">{averageScore || user.baselineScore}</div>
          <div className="stat-bar">
            <div className="stat-bar-fill" style={{ width: `${((averageScore || user.baselineScore) / 80) * 100}%` }}></div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-label">IMPROVEMENT</div>
          <div className="stat-value">+{Math.max(0, (averageScore || user.baselineScore) - user.baselineScore)}</div>
          <div className="stat-bar">
            <div className="stat-bar-fill status-ok" style={{ width: `${Math.min(100, ((averageScore || user.baselineScore) - user.baselineScore) / (80 - user.baselineScore) * 100)}%` }}></div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-label">TARGET</div>
          <div className="stat-value">80</div>
          <div className="stat-bar">
            <div className="stat-bar-fill status-pending" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
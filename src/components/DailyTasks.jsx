import React, { useState, useEffect } from 'react';
import { problemGenerator } from '../data/problemGenerator';
import './DailyTasks.css';

function DailyTasks({ curriculum, progress, currentDay, onTaskComplete, onAllTasksComplete }) {
  const [taskProgress, setTaskProgress] = useState({});
  const [currentTask, setCurrentTask] = useState(null);
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [results, setResults] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    // Initialize task progress from saved progress
    if (progress[currentDay]?.dailyTasks) {
      setTaskProgress(progress[currentDay].dailyTasks);
    }
    
    // Check if lesson was read and update task
    if (progress[currentDay]?.lessonRead) {
      setTaskProgress(prev => ({
        ...prev,
        'read-lesson': {
          completed: true,
          attempts: 1,
          lastAttempt: new Date().toISOString()
        }
      }));
    }
  }, [progress, currentDay]);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startTask = (task) => {
    setCurrentTask(task);
    setResults([]);
    setCurrentProblem(0);
    setTimer(0);
    setIsTimerRunning(true);
    
    // Generate problems based on task type and current day
    const difficulty = Math.min(3, Math.ceil(currentDay / 25));
    const problems = [];
    
    // Determine appropriate technique based on day
    let techniques = ['standard'];
    if (currentDay <= 10) {
      // Phase 1: Addition/Subtraction focus
      if (currentDay >= 4) techniques.push('subtraction-trick');
      if (currentDay >= 7) techniques.push('addition-trick');
      if (currentDay >= 8) techniques.push('complement');
    } else if (currentDay <= 35) {
      // Phase 2: Multiplication focus
      techniques = ['2by1', '3by1', 'squares', '2by2'];
    }
    
    // Generate mixed problems using appropriate techniques
    for (let i = 0; i < task.count; i++) {
      const technique = techniques[random(0, techniques.length - 1)];
      const operation = currentDay <= 10 ? (i % 2 === 0 ? '+' : '-') : '×';
      
      if (operation === '+') {
        problems.push(problemGenerator.generateAddition(technique, difficulty));
      } else if (operation === '-') {
        problems.push(problemGenerator.generateSubtraction(technique, difficulty));
      } else if (operation === '×') {
        problems.push(problemGenerator.generateMultiplication(technique, difficulty));
      } else {
        problems.push(problemGenerator.generateProblem('mixed', difficulty));
      }
    }
    
    setProblems(problems);
  };
  
  // Helper function for random numbers
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const problem = problems[currentProblem];
    const isCorrect = parseInt(userAnswer) === problem.answer;
    
    const newResults = [...results, { problem, userAnswer: parseInt(userAnswer), correct: isCorrect }];
    setResults(newResults);
    setUserAnswer('');
    
    if (currentProblem + 1 >= problems.length) {
      // Task complete
      completeTask(newResults);
    } else {
      setCurrentProblem(currentProblem + 1);
    }
  };

  const completeTask = (finalResults) => {
    setIsTimerRunning(false);
    
    const correct = finalResults.filter(r => r.correct).length;
    const accuracy = (correct / finalResults.length) * 100;
    const passed = checkTaskRequirements(currentTask, finalResults, timer, accuracy);
    
    const newTaskProgress = {
      ...taskProgress,
      [currentTask.id]: {
        completed: passed,
        attempts: (taskProgress[currentTask.id]?.attempts || 0) + 1,
        bestScore: Math.max(taskProgress[currentTask.id]?.bestScore || 0, correct),
        bestAccuracy: Math.max(taskProgress[currentTask.id]?.bestAccuracy || 0, accuracy),
        lastAttempt: new Date().toISOString()
      }
    };
    
    setTaskProgress(newTaskProgress);
    onTaskComplete(currentDay, currentTask.id, newTaskProgress[currentTask.id]);
    
    // Check if all tasks are complete
    const allTasksComplete = curriculum.dailyTasks.every(task => 
      newTaskProgress[task.id]?.completed || task.id === 'daily-challenge'
    );
    
    if (allTasksComplete) {
      onAllTasksComplete(currentDay);
    }
    
    setCurrentTask(null);
  };

  const checkTaskRequirements = (task, results, time, accuracy) => {
    switch (task.type) {
      case 'timed':
        return time <= task.timeLimit && results.filter(r => r.correct).length >= task.count * 0.8;
      case 'accuracy':
        return accuracy >= task.targetAccuracy;
      case 'practice':
        return results.filter(r => r.correct).length >= task.count * 0.7;
      default:
        return true;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (currentTask && problems.length > 0) {
    const problem = problems[currentProblem];
    
    return (
      <div className="daily-tasks-overlay">
        <div className="task-window">
          <div className="task-header">
            <span>{currentTask.name}</span>
            <span className="task-timer">[{formatTime(timer)}]</span>
          </div>
          
          <div className="task-progress">
            <span>PROBLEM {currentProblem + 1}/{problems.length}</span>
            {currentTask.timeLimit && (
              <span className="time-limit">TIME LIMIT: {currentTask.timeLimit}s</span>
            )}
          </div>
          
          <div className="task-problem">
            <h2>{problem.question} = ?</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="ANSWER"
                autoFocus
                required
              />
              <button type="submit">SUBMIT</button>
            </form>
          </div>
          
          <button onClick={() => setCurrentTask(null)} className="cancel-btn">
            CANCEL TASK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="daily-tasks">
      <h3>DAILY TASKS</h3>
      <div className="tasks-list">
        {curriculum.dailyTasks.map(task => {
          const taskStatus = taskProgress[task.id];
          const isCompleted = taskStatus?.completed;
          const attempts = taskStatus?.attempts || 0;
          
          return (
            <div key={task.id} className={`task-item ${isCompleted ? 'completed' : ''}`}>
              <div className="task-info">
                <span className="task-status">{isCompleted ? '[X]' : '[ ]'}</span>
                <span className="task-name">{task.name}</span>
                {attempts > 0 && !isCompleted && (
                  <span className="task-attempts">[ATTEMPTS: {attempts}]</span>
                )}
              </div>
              <div className="task-description">{task.description}</div>
              {!isCompleted && task.id !== 'daily-challenge' && task.type !== 'lesson' && (
                <button onClick={() => startTask(task)} className="start-task-btn">
                  START TASK
                </button>
              )}
              {task.type === 'lesson' && !isCompleted && (
                <span className="task-hint">Complete in daily training</span>
              )}
              {taskStatus && (
                <div className="task-stats">
                  {taskStatus.bestScore && <span>BEST: {taskStatus.bestScore}</span>}
                  {taskStatus.bestAccuracy && <span>ACC: {taskStatus.bestAccuracy.toFixed(1)}%</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyTasks;
import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle, XCircle } from 'lucide-react';
import { problemGenerator } from '../data/problemGenerator';
import './MockTest.css';

function MockTest({ updateProgress }) {
  const [testStarted, setTestStarted] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    let interval;
    if (testStarted && !testComplete) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [testStarted, testComplete, startTime]);

  const startTest = () => {
    const mockProblems = problemGenerator.generateMockTest();
    setProblems(mockProblems);
    setTestStarted(true);
    setStartTime(Date.now());
    setUserAnswers([]);
    setCurrentProblem(0);
  };
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newAnswer = {
      problemIndex: currentProblem,
      userAnswer: parseInt(userAnswer),
      correct: parseInt(userAnswer) === problems[currentProblem].answer,
      timeSpent: Date.now() - startTime - (userAnswers.reduce((sum, a) => sum + a.timeSpent, 0) || 0)
    };
    
    setUserAnswers([...userAnswers, newAnswer]);
    setUserAnswer('');
    
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(currentProblem + 1);
    } else {
      // Test complete
      setTestComplete(true);
      const finalTime = Date.now() - startTime;
      const correctCount = [...userAnswers, newAnswer].filter(a => a.correct).length;
      const score = Math.round((correctCount / 80) * 80);
      
      // Save to progress
      const testResult = {
        type: 'mock',
        date: new Date().toISOString(),
        score: score,
        time: finalTime,
        correctCount: correctCount,
        totalQuestions: 80
      };
      
      updateProgress(`mock-${Date.now()}`, testResult);
    }
  };
  if (!testStarted) {
    return (
      <div className="mock-test">
        <div className="test-intro card">
          <h1>80 in 8 Mock Test</h1>
          <p>Complete 80 mental math problems in 8 minutes</p>
          
          <div className="test-rules">
            <h3>Rules:</h3>
            <ul>
              <li>80 problems: addition, subtraction, multiplication, division</li>
              <li>8 minute time limit (480 seconds)</li>
              <li>No calculator allowed</li>
              <li>Your score is based on correct answers</li>
            </ul>
          </div>
          
          <button onClick={startTest} className="btn btn-primary btn-large">
            Start Mock Test
          </button>
        </div>
      </div>
    );
  }
  
  if (testComplete) {
    const correctCount = userAnswers.filter(a => a.correct).length;
    const accuracy = (correctCount / problems.length * 100).toFixed(1);
    const avgTimePerProblem = (elapsedTime / problems.length / 1000).toFixed(1);
    
    return (
      <div className="mock-test">
        <div className="test-results card">
          <h1>Test Complete!</h1>
          
          <div className="results-grid">
            <div className="result-box">
              <h3>Score</h3>
              <p className="big-number">{correctCount}/80</p>
            </div>
            <div className="result-box">
              <h3>Accuracy</h3>
              <p className="big-number">{accuracy}%</p>
            </div>            <div className="result-box">
              <h3>Time</h3>
              <p className="big-number">{formatTime(elapsedTime)}</p>
            </div>
            <div className="result-box">
              <h3>Avg/Problem</h3>
              <p className="big-number">{avgTimePerProblem}s</p>
            </div>
          </div>
          
          <div className="performance-analysis">
            <h3>Performance Analysis</h3>
            {elapsedTime > 480000 ? (
              <p className="warning">You exceeded the 8-minute time limit. Focus on speed!</p>
            ) : (
              <p className="success">Great! You finished within the time limit.</p>
            )}
            
            {correctCount >= 70 ? (
              <p className="success">Excellent accuracy! You're close to mastery.</p>
            ) : correctCount >= 50 ? (
              <p>Good progress! Keep practicing to improve accuracy.</p>
            ) : (
              <p className="warning">Focus on accuracy. Review your weak areas.</p>
            )}
          </div>
          
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Another Mock Test
          </button>
        </div>
      </div>
    );
  }
  
  // During test
  const problem = problems[currentProblem];
  const timeRemaining = Math.max(0, 480000 - elapsedTime);
  const isOverTime = timeRemaining === 0;  
  return (
    <div className="mock-test">
      <div className="test-header">
        <div className="test-progress">
          Question {currentProblem + 1} of 80
        </div>
        <div className={`test-timer ${isOverTime ? 'overtime' : ''}`}>
          <Timer size={20} />
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      <div className="test-problem card">
        <h1 className="problem-display">{problem.question} = ?</h1>
        
        <form onSubmit={handleSubmit} className="answer-form">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your answer"
            autoFocus
            required
            disabled={isOverTime}
          />
          <button type="submit" className="btn btn-primary" disabled={isOverTime}>
            {currentProblem < problems.length - 1 ? 'Next' : 'Finish'}
          </button>
        </form>
        
        {isOverTime && (
          <p className="overtime-message">Time's up! Submit to see your results.</p>
        )}
      </div>
      
      <div className="test-progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentProblem + 1) / 80) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default MockTest;
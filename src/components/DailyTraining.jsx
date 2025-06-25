import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Timer, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { problemGenerator } from '../data/problemGenerator';
import { getLessonForDay } from '../data/curriculum';
import LessonDisplay from './LessonDisplay';
import './DailyTraining.css';

function DailyTraining({ curriculum, progress, updateProgress }) {
  const { day } = useParams();
  const navigate = useNavigate();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [problems, setProblems] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [exerciseResults, setExerciseResults] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lessonRead, setLessonRead] = useState(false);
  const [showExercise, setShowExercise] = useState(false);

  const dayNum = parseInt(day);
  const todaysData = curriculum?.days.find(d => d.day === dayNum);
  const exercise = todaysData?.exercises[currentExercise];
  const lesson = getLessonForDay(dayNum);

  // Check if lesson was already read
  useEffect(() => {
    if (progress[dayNum]?.lessonRead) {
      setLessonRead(true);
      setShowExercise(true);
    }
  }, [progress, dayNum]);

  useEffect(() => {
    if (!todaysData) return;
    
    // Generate problems for current exercise
    if (exercise) {
      if (exercise.type === 'practice' || exercise.type === 'timed') {
        const count = exercise.count || exercise.questions || 20;
        const difficulty = Math.min(3, Math.ceil(dayNum / 25));
        
        // Determine technique based on day and exercise name
        let technique = 'standard';
        if (dayNum <= 2 && exercise.name.includes('no carrying')) technique = 'no-carry';
        else if (dayNum === 4 && exercise.name.includes('subtraction trick')) technique = 'subtraction-trick';
        else if (dayNum === 7 && exercise.name.includes('addition trick')) technique = 'addition-trick';
        else if (dayNum === 8 && exercise.name.includes('complement')) technique = 'complement';
        else if (dayNum === 9 && exercise.name.includes('change')) technique = 'make-change';
        else if (dayNum >= 11 && dayNum <= 12) technique = '2by1';
        else if (dayNum >= 14 && dayNum <= 15) technique = '3by1';
        else if (dayNum >= 19 && dayNum <= 20) technique = 'squares';
        else if (dayNum >= 21 && dayNum <= 25) technique = '2by2';
        
        // Generate appropriate problems
        const problems = [];
        for (let i = 0; i < count; i++) {
          if (exercise.name.includes('mixed') || exercise.type === 'mixed') {
            problems.push(problemGenerator.generateProblem('mixed', difficulty));
          } else if (exercise.name.toLowerCase().includes('addition')) {
            problems.push(problemGenerator.generateAddition(technique, difficulty));
          } else if (exercise.name.toLowerCase().includes('subtraction')) {
            problems.push(problemGenerator.generateSubtraction(technique, difficulty));
          } else if (exercise.name.toLowerCase().includes('multiplication')) {
            problems.push(problemGenerator.generateMultiplication(technique, difficulty));
          } else if (exercise.name.toLowerCase().includes('division')) {
            problems.push(problemGenerator.generateDivision('standard', difficulty));
          } else {
            problems.push(problemGenerator.generateProblem('mixed', difficulty));
          }
        }
        
        setProblems(problems);
      } else if (exercise.type === 'mock') {
        setProblems(problemGenerator.generateMockTest());
      }
    }
  }, [todaysData, currentExercise, exercise, dayNum]);
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentProblem = problems[exerciseResults.length];
    const isCorrect = parseInt(userAnswer) === currentProblem.answer;
    
    const newResult = {
      problem: currentProblem,
      userAnswer: parseInt(userAnswer),
      correct: isCorrect,
      time: timer
    };

    setExerciseResults([...exerciseResults, newResult]);
    setUserAnswer('');
    
    if (exerciseResults.length + 1 >= problems.length) {
      // Exercise complete
      setIsTimerRunning(false);
      setShowResult(true);
    }
  };

  const startExercise = () => {
    setIsTimerRunning(true);
    setTimer(0);
    setExerciseResults([]);
  };
  const nextExercise = () => {
    if (currentExercise < todaysData.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setExerciseResults([]);
      setTimer(0);
      setShowResult(false);
      setIsTimerRunning(false);
    } else {
      // Day complete - calculate total score
      const totalCorrect = exerciseResults.filter(r => r.correct).length;
      const totalQuestions = exerciseResults.length;
      const score = Math.round((totalCorrect / totalQuestions) * 80);
      
      const dayResults = {
        completed: true,
        date: new Date().toISOString(),
        score: score,
        exercises: todaysData.exercises.map((ex, i) => ({
          name: ex.name,
          completed: i <= currentExercise
        })),
        lessonRead: lessonRead
      };
      updateProgress(dayNum, dayResults);
      navigate('/');
    }
  };

  if (!todaysData) {
    return <div>Loading...</div>;
  }

  if (exercise?.type === 'technique') {
    return (
      <div className="daily-training">
        <div className="training-header">
          <h1>Day {dayNum}: {todaysData.title}</h1>
          <p>{exercise.name}</p>
        </div>        
        <div className="technique-content card">
          <h2>Technique Training</h2>
          <p>Study and practice the {exercise.name} technique.</p>
          <button onClick={nextExercise} className="btn btn-primary">
            Mark as Complete
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const correct = exerciseResults.filter(r => r.correct).length;
    const accuracy = (correct / exerciseResults.length * 100).toFixed(1);
    
    return (
      <div className="daily-training">
        <div className="training-header">
          <h1>Exercise Complete!</h1>
        </div>
        
        <div className="results-summary card">
          <h2>{exercise.name}</h2>
          <div className="result-stats">
            <div className="result-stat">
              <h3>Correct</h3>
              <p>{correct} / {exerciseResults.length}</p>
            </div>
            <div className="result-stat">
              <h3>Accuracy</h3>
              <p>{accuracy}%</p>
            </div>
            <div className="result-stat">
              <h3>Time</h3>
              <p>{formatTime(timer)}</p>
            </div>
          </div>
          
          <div className="detailed-results">
            <h3>Review:</h3>
            {exerciseResults.map((result, i) => (
              <div key={i} className={`result-item ${result.correct ? 'correct' : 'incorrect'}`}>
                <span>{result.problem.question} = {result.problem.answer}</span>
                {!result.correct && <span> (Your answer: {result.userAnswer})</span>}
                {result.correct ? <CheckCircle size={20} /> : <XCircle size={20} />}
              </div>
            ))}
          </div>
          
          <button onClick={nextExercise} className="btn btn-primary">
            {currentExercise < todaysData.exercises.length - 1 ? 'Next Exercise' : 'Complete Day'}
          </button>
        </div>
      </div>
    );
  }

  const currentProblem = problems[exerciseResults.length];
  
  return (
    <div className="daily-training">
      <div className="training-header">
        <h1>Day {dayNum}: {todaysData.title}</h1>
        <p>{exercise?.name}</p>
      </div>
      
      {/* Show lesson if available and not yet read */}
      {lesson && !lessonRead && currentExercise === 0 && (
        <LessonDisplay 
          lesson={lesson} 
          onComplete={() => {
            setLessonRead(true);
            setShowExercise(true);
            // Save lesson read status
            const currentProgress = progress[dayNum] || {};
            updateProgress(dayNum, { ...currentProgress, lessonRead: true });
          }} 
        />
      )}
      
      {/* Only show exercise UI after lesson is read (or if no lesson) */}
      {(!lesson || lessonRead || showExercise) && (
        <>
          {!isTimerRunning && problems.length > 0 && (
            <div className="exercise-card card">
              <h2>{exercise.name}</h2>
              <p>Problems: {problems.length}</p>
              {exercise.duration && <p>Time limit: {exercise.duration} seconds</p>}
              {exercise.target && <p>Target score: {exercise.target}</p>}
              
              <button onClick={startExercise} className="btn btn-primary">
                Start Exercise
              </button>
            </div>
          )}
          
          {isTimerRunning && currentProblem && (
            <div className="problem-card card">
              <div className="problem-header">
                <span>Problem {exerciseResults.length + 1} of {problems.length}</span>
                <div className="timer">
                  <Timer size={20} />
                  {formatTime(timer)}
                </div>
              </div>
              
              <div className="problem-content">
                <h2 className="problem-question">{currentProblem.question} = ?</h2>
                
                <form onSubmit={handleSubmit}>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Your answer"
                    autoFocus
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(exerciseResults.length / problems.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DailyTraining;
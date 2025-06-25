import React, { useState } from 'react';
import './LessonDisplay.css';

function LessonDisplay({ lesson, onComplete }) {
  const [read, setRead] = useState(false);
  
  if (!lesson) return null;
  
  const handleComplete = () => {
    setRead(true);
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <div className="lesson-display">
      <div className="lesson-header">
        <h2>{lesson.title}</h2>
      </div>
      
      <div className="lesson-content">
        {lesson.content.split('\n\n').map((paragraph, index) => {
          // Check if it's a heading (starts with **)
          if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
            const heading = paragraph.slice(2, -2);
            return <h3 key={index}>{heading}</h3>;
          }
          
          // Check if paragraph contains bold text
          const parts = paragraph.split('**');
          if (parts.length > 1) {
            return (
              <p key={index}>
                {parts.map((part, i) => 
                  i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                )}
              </p>
            );
          }
          
          // Check if it's a list item
          if (paragraph.includes('\n-')) {
            const lines = paragraph.split('\n');
            const title = lines[0];
            const items = lines.slice(1).filter(line => line.startsWith('-'));
            
            return (
              <div key={index}>
                {title && <p>{title}</p>}
                <ul>
                  {items.map((item, i) => (
                    <li key={i}>{item.substring(2)}</li>
                  ))}
                </ul>
              </div>
            );
          }
          
          // Regular paragraph
          return <p key={index}>{paragraph}</p>;
        })}
      </div>
      
      <div className="lesson-footer">
        {!read ? (
          <button onClick={handleComplete} className="btn-complete">
            MARK AS READ
          </button>
        ) : (
          <div className="read-indicator">
            [X] LESSON COMPLETED
          </div>
        )}
      </div>
    </div>
  );
}

export default LessonDisplay;
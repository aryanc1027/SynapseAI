import React, { useState } from 'react';
import './Flashcard.css';

const Flashcard = ({ frontText, backText, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
      onClick={handleFlipCard}
      style={{ left: `${index * 30}px`, zIndex: index }}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <p>{frontText}</p>
        </div>
        <div className="flashcard-back">
          <p>{backText}</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;

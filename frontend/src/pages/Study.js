import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../services';
import Flashcard from '../components/Flashcards';

const Study = () => {
  const [studySet, setStudySet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { id } = useParams();
  const [completedCards, setCompletedCards] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudySet = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/study/study_sets/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setStudySet(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching study set:', error);
        setIsLoading(false);
      }
    };

    fetchStudySet();
    //updateProgress();

   
  }, [id,studySet]);

  const updateProgress = useCallback(async () => {
    try {
      const progress = Math.round(((completedCards.length + 1) / studySet.flashcards.length) * 100);
  
      await axios.put(
        `${API_BASE_URL}/study/progress/${id}`,
        { progress }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      console.log('Progress updated successfully');
    } catch (error) {
      console.error('Error updating progress:', error);
  
      if (error.response) {
        console.error('Backend response:', error.response.data);
      }
    }
  }, [id, completedCards, studySet]);
  
  const handleNavigation = useCallback(() => {

    navigate(-1);
  }, [navigate]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = (correct) => {
    if (correct) {
      setCompletedCards([...completedCards, currentCardIndex]);
      
      const remainingCards = studySet.flashcards.filter((_, index) => 
        !completedCards.includes(index) && index !== currentCardIndex
      );
      
      if (remainingCards.length > 0) {
        const nextIndex = studySet.flashcards.findIndex((_, index) => 
          !completedCards.includes(index) && index !== currentCardIndex
        );
        setCurrentCardIndex(nextIndex);
      } else {
        // Study session completed
        setIsCompleted(true);
        updateProgress();
      }
      
      setIsFlipped(false);
    } else {
      // If incorrect, just flip the card back
      setIsFlipped(false);
    }
    updateProgress();
  };
  const handleReset = () => {
    setCompletedCards([]);
    setCurrentCardIndex(0);
    setIsCompleted(false);
    setIsFlipped(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!studySet || studySet.flashcards.length === 0) {
    return <div>Study set not found or empty</div>;
  }

  const currentCard = studySet.flashcards[currentCardIndex];

  return (
    <div className="bg-indigo-50 min-h-screen p-8">
    <div className="mb-6">
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
    <div 
      className="bg-blue-600 h-2.5 rounded-full" 
      style={{width: `${studySet.progress}%`}}
            >
            </div>
        </div>
        <div className="text-center font-bold text-black">
            {studySet.progress}%
        </div>
        </div>
        <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={handleNavigation}
          >
            Exit Study Session
          </button>
                  {isCompleted ? (
        <div className="text-center mt-6">
            <p className="text-xl font-semibold mb-4">Study set completed!</p>
            <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleReset}
            >
            Reset Progress
            
    </button>`
        </div>
      ) : (
        <>
          <div className="flashcard-container mb-4">
            <Flashcard
              frontText={currentCard.front}
              backText={currentCard.back}
              isFlipped={isFlipped}
              onClick={handleFlip}
            />
          </div>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => handleNext(true)}
            >
              Correct
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => handleNext(false)}
            >
              Incorrect
            </button>
          </div>
          <div className="mt-4 text-center">
            Card {Math.max(0, studySet.flashcards.length - completedCards.length)} remaining
          </div>
        </>
      )}
    </div>
  );
};

export default Study;
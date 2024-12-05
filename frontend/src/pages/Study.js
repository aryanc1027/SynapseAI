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
      
      // Check if the study set is completed
      if (response.data.progress === 100) {
        setIsCompleted(true);
        setCompletedCards(response.data.flashcards.map((_, index) => index));
      }
    } catch (error) {
      console.error('Error fetching study set:', error);
      setIsLoading(false);
    }
  };

  fetchStudySet();
}, [id]);

// const updateProgress = useCallback(async () => {
//   try {
//     const progress = calculate_progress(completedCards, studySet.flashcards.length);

//     await axios.put(
//       `${API_BASE_URL}/study/progress/${id}`,
//       { progress }, 
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//         },
//       }
//     );

//     setStudySet(prevStudySet => ({
//       ...prevStudySet,
//       progress: progress
//     }));

//     console.log('Progress updated successfully');
//   } catch (error) {
//     console.error('Error updating progress:', error);
//     if (error.response) {
//       console.error('Backend response:', error.response.data);
//     }
//   }
// }, [id, completedCards, studySet]);

const calculate_progress = (completed_cards, total_cards) => {
  if (total_cards === 0) {
    return 0;
  }
  return Math.round((completed_cards.length / total_cards) * 100);
};
  
  const handleNavigation = useCallback(() => {

    navigate(-1);
  }, [navigate]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const updateProgressInDB = useCallback(async (progress) => {
    try {
      await axios.put(
        `${API_BASE_URL}/study/progress/${id}`,
        { progress }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      console.log('Progress updated successfully in DB');
    } catch (error) {
      console.error('Error updating progress in DB:', error);
    }
  }, [id]);

  const handleNext = useCallback((correct) => {
    setCompletedCards(prevCompletedCards => {
      let newCompletedCards = prevCompletedCards;
      if (correct) {
        newCompletedCards = [...prevCompletedCards, currentCardIndex];
      }
  
      const remainingCards = studySet.flashcards.filter((_, index) => 
        !newCompletedCards.includes(index) && index !== currentCardIndex
      );
      
      let nextIndex;
      if (remainingCards.length > 0) {
        nextIndex = studySet.flashcards.findIndex((_, index) => 
          !newCompletedCards.includes(index) && index !== currentCardIndex
        );
      } else if (!correct) {
        // If no new cards and current card was incorrect, go back to the first incorrect card
        nextIndex = studySet.flashcards.findIndex((_, index) => 
          !newCompletedCards.includes(index)
        );
      } else {
        // All cards completed
        setIsCompleted(true);
      }
  
      if (nextIndex !== undefined) {
        setCurrentCardIndex(nextIndex);
      }
  
      setIsFlipped(false);
  

      const newProgress = calculate_progress(newCompletedCards, studySet.flashcards.length);
      setStudySet(prevStudySet => ({
        ...prevStudySet,
        progress: newProgress
      }));
  

      updateProgressInDB(newProgress);
  
      return newCompletedCards;
    });
  }, [currentCardIndex, studySet, updateProgressInDB]);
  
  const handleReset = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/study/progress/${id}`,
        { progress: 0 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
  
      setCompletedCards([]);
      setCurrentCardIndex(0);
      setIsCompleted(false);
      setIsFlipped(false);
      setStudySet(prevStudySet => ({
        ...prevStudySet,
        progress: 0
      }));
  
      console.log('Progress reset successfully');
    } catch (error) {
      console.error('Error resetting progress:', error);
      if (error.response) {
        console.error('Backend response:', error.response.data);
      }
    }
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
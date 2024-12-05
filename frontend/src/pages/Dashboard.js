import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../services';
import { pdfjs } from 'react-pdf';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import Flashcard from '../components/Flashcards';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import ProgressCircle from '../components/ProgressCircle';




GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js';

const Dashboard = () => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numCards, setNumCards] = useState(5);
  const [userId, setUserId] = useState(null);
  const [studySets, setStudySets] = useState([]);
  const navigate = useNavigate();


  const cards = [];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjs.getDocument(typedArray).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item) => item.str).join(' ') + ' ';
        }
        resolve(fullText);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const fetchUserId = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('User is not authenticated');
      return;
    }
  
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserId(response.data.id);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };  

  const fetchStudySets = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/study/users/${id}/study_sets`);
      setStudySets(response.data);
      console.log('Study Sets:', response);
    } catch (error) {
      console.error('Error fetching study sets:', error);
    }
  };


  const acceptFlashCards = async (id, flashcards) => {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'user',
              content: `Generate a title and a brief description for these flashcards. Format it as "Title: [title]" on one line, followed by "Description: [description]" on the next line. Do not include any other text or formatting.\n\n${flashcards.map(({ front, back }) => `Front: ${front}\nBack: ${back}`).join('\n')}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const responseContent = response.data.choices[0].message.content;
      const [titleLine, descriptionLine] = responseContent.split('\n');
      
      const title = titleLine.replace('Title: ', '').trim();
      const description = descriptionLine.replace('Description: ', '').trim();
     
          
  
      const studySetData = {
        title: title, 
        description: description, 
        flashcards: flashcards.map(({ front, back }) => ({ front, back })),
        user_id: id,
        progress: 0
      };
  
      const dbResponse = await axios.post(
        `${API_BASE_URL}/study/users/${id}/study_sets`,
        studySetData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, 
          },
          withCredentials: true,
        }
      );
      console.log('Flashcards saved to database:', dbResponse.data);
    } catch (error) {
      console.error('Error:', error);
      setFlashcards([
        { front: 'Error generating flashcards', back: 'Please try again.' },
      ]);
    }
  };
  const handleAddToDb = async () => {
    if (userId && flashcards.length > 0) {
      setIsLoading(true);
      console.log('Adding flashcards to database', flashcards);
      await acceptFlashCards(userId, flashcards);
      setIsLoading(false);
      fetchStudySets(userId);
    } else {
      console.error('User ID not available or no flashcards to add');
    }
  };
  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchStudySets(userId);

    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    let textToProcess = input;
  
    if (file) {
      try {
        textToProcess = await extractTextFromPDF(file);
      } catch (error) {
        console.error('Error reading PDF:', error);
        setIsLoading(false);
        return;
      }
    }
  
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'user',
              content: `Generate ${numCards} flashcards from the following text. Format each flashcard as "Front: [question]" followed by "Back: [answer]" on the next line. Do not include any other text or formatting.\n\n${textToProcess}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const generatedText = response.data.choices[0].message.content || '';
      const lines = generatedText.split('\n');
      let currentCard = { front: '', back: '' };
  
      for (const line of lines) {
        if (line.startsWith('Front:')) {
          if (currentCard.front && currentCard.back) {
            
            cards.push({ ...currentCard });
            currentCard = { front: '', back: '' };
          }
          currentCard.front = line.substring(6).trim();
        } else if (line.startsWith('Back:')) {
          currentCard.back = line.substring(5).trim();
        }
      }
  
      
      if (currentCard.front && currentCard.back) {
        cards.push({ ...currentCard });
      }
      console.log('Generated Flashcards:', cards);
      setFlashcards(cards); 
    } catch (error) {
      console.error('Error calling Groq API:', error);
      setFlashcards([
        { front: 'Error generating flashcards', back: 'Please try again.' },
      ]);
    }
  
    setIsLoading(false);
  };
  
return (
  <div className="bg-gradient-to-b from-[#c8ffc9] to-[#e8ffe9] min-h-screen p-8">
    <h1 className="text-4xl font-bold text-[#217e38] mb-6">Your Dashboard</h1>
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div className="bg-[#eeffee] p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <h2 className="text-2xl font-semibold mb-4 text-[#59a742]">Study Progress</h2>
        {studySets.length > 0 ? (
          <ProgressCircle
            progress={studySets[0].progress}
            title={studySets[0].title}
          />
        ) : (
          <p className="text-[#0a260c]">No study sets available</p>
        )}
      </div>
      <div className="bg-[#eeffee] p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <h2 className="text-2xl font-semibold mb-4 text-[#59a742]">Recent Study Sets</h2>
        <div className="max-h-60 overflow-y-auto">
          {studySets
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((set) => (
              <div 
                key={set.id}
                className="mb-4 p-4 border border-[#aff195] rounded-lg shadow cursor-pointer hover:bg-[#f0faf0] transition duration-300"
                onClick={() => navigate(`/study/${set.id}`)}
              >
                <h3 className="font-medium text-lg text-[#217e38]">{set.title}</h3>
                <p className="text-[#59a742]">{set.description}</p>
                <p className="text-[#59a742]">{set.progress}%</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    <div className="bg-[#eeffee] p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-[#59a742]">Flashcard Generator</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full p-2 border border-[#ggf195] rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#59a742] bg-gradient-to-r from-[#e6f7e6] to-[#f0faf0] font-bold text-[#054a1f]"
          rows="4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt here..."
        ></textarea>
        <div className="mb-2">
          <label className="block text-sm font-medium text-[#217e38]">
            Number of flashcards (max 20)
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={numCards}
            onChange={(e) =>
              setNumCards(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))
            }
            className="mt-1 p-2 border border-[#aff195] rounded focus:outline-none focus:ring-2 focus:ring-[#59a742] bg-gradient-to-r from-[#e6f7e6] to-[#f0faf0] font-bold text-[#054a1f]"
          />
        </div>
        <button
          type="submit"
          className="bg-[#59a742] text-white px-6 py-2 rounded-full hover:bg-[#217e38] transition duration-300 mr-2"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Generate Flashcards'}
        </button>
        <button
          type="button"
          className="bg-[#defadc] text-[#054a1f] px-6 py-2 rounded-full hover:bg-[#59a742] hover:text-white transition duration-300"
          onClick={handleAddToDb}
          disabled={isLoading || flashcards.length === 0}
        >
          {isLoading ? 'Processing...' : 'Add to Study Sets'}
        </button>
      </form>
      {flashcards.length > 0 && (
        <div className="flashcard-container mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#59a742]">Generated Flashcards</h2>
          {flashcards.map((card, index) => (
            <Flashcard
              key={index}
              frontText={card.front}
              backText={card.back}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);
};
export default Dashboard
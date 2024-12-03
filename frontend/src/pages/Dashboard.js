import React, { useState } from 'react';
import axios from 'axios';
import { pdfjs } from 'react-pdf';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import Flashcard from '../components/Flashcards';
import './Dashboard.css';

// Set up PDF.js worker
GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js';

const Dashboard = () => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numCards, setNumCards] = useState(5);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        const typedarray = new Uint8Array(e.target.result);
        try {
          const pdf = await pdfjs.getDocument(typedarray).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(item => item.str).join(' ') + ' ';
          }
          resolve(fullText);
        } catch (error) {
          console.error('Error extracting text from PDF:', error);
          reject('Failed to extract text from PDF');
        }
      };
      reader.onerror = () => reject('Error reading the file');
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let textToProcess = input;

    if (file) {
      try {
        textToProcess = await extractTextFromPDF(file);
      } catch (error) {
        console.error(error);
        setFlashcards([{
          front: 'Error processing PDF',
          back: 'Please try again with a different file',
        }]);
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [{
            role: 'user',
            content: `Generate ${numCards} flashcards from the following text. Format each flashcard as "Front: [question]" followed by "Back: [answer]" on the next line. Do not include any other text or formatting.\n\n${textToProcess}`,
          }],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const generatedText = response.data.choices[0]?.message?.content || '';
      const lines = generatedText.split('\n');
      const cards = [];
      let currentCard = {};

      for (const line of lines) {
        if (line.startsWith('Front:')) {
          if (currentCard.front) {
            cards.push(currentCard);
            currentCard = {};
          }
          currentCard.front = line.substring(6).trim();
        } else if (line.startsWith('Back:')) {
          currentCard.back = line.substring(5).trim();
        }
      }

      if (currentCard.front && currentCard.back) {
        cards.push(currentCard);
      }

      setFlashcards(cards);
    } catch (error) {
      console.error('Error calling Groq API:', error);
      setFlashcards([{
        front: 'Error generating flashcards',
        back: 'Please try again',
      }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-indigo-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">Your Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Study Progress</h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Flashcard Generator</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-2"
            rows="4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to generate flashcards..."
          />
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Or upload a PDF file</label>
            <input type="file" accept=".pdf" onChange={handleFileChange} className="mt-1" />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Number of flashcards (max 20)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={numCards}
              onChange={(e) => setNumCards(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
              className="mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Flashcards'}
          </button>
        </form>
      </div>
      {flashcards.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generated Flashcards</h2>
          <div className="flashcard-container">
            {flashcards.map((card, index) => (
              <Flashcard key={index} frontText={card.front} backText={card.back} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

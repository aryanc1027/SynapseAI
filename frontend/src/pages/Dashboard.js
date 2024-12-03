import React, { useState } from 'react';
import axios from 'axios';


const Dashboard = () => {
 const [input, setInput] = useState('');
 const [output, setOutput] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [isFlipped, setIsFlipped] = useState(true);
 const [cardText, setCardText] = useState({
   front: 'This is the front of the flashcard',
   back: 'This is the back of the flashcard'
 });


 const handleSubmit = async (e) => {
   e.preventDefault();
   setIsLoading(true);


   try {
     const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
       model: 'llama3-8b-8192',
       messages: [{ role: 'user', content: input }]
     }, {
       headers: {
         'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
         'Content-Type': 'application/json'
       }
     });


     setOutput(response.data.choices[0].message.content);
   } catch (error) {
     console.error('Error calling Groq API:', error);
     setOutput('An error occurred while processing your request.');
   }


   setIsLoading(false);
 };


 const handleFlipCard = () => {
   setIsFlipped(!isFlipped);
 };


 return (
   <div className="bg-indigo-50 min-h-screen p-8">
     <h1 className="text-3xl font-bold text-indigo-800 mb-6">Your Dashboard</h1>
     <div className="grid md:grid-cols-2 gap-6 mb-6">
       <div className="bg-white p-6 rounded-lg shadow-md">
         <h2 className="text-xl font-semibold mb-4">Study Progress</h2>
         {/* Add progress visualization here */}
       </div>
       <div className="bg-white p-6 rounded-lg shadow-md">
         <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
         {/* Add recent quizzes list here */}
       </div>
     </div>
     <div className="bg-white p-6 rounded-lg shadow-md">
       <h2 className="text-xl font-semibold mb-4">Testing</h2>
       <form onSubmit={handleSubmit} className="mb-4">
         <textarea
           className="w-full p-2 border border-gray-300 rounded mb-2"
           rows="4"
           value={input}
           onChange={(e) => setInput(e.target.value)}
           placeholder="Enter your prompt here..."
         ></textarea>
         <button
           type="submit"
           className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
           disabled={isLoading}
         >
           {isLoading ? 'Processing...' : 'Submit'}
         </button>
       </form>
       {output && (
         <div className="mt-4">
           <h3 className="font-semibold mb-2">API Response:</h3>
           <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{output}</pre>
         </div>
       )}
     </div>
     <div className="bg-white p-6 rounded-lg shadow-md mt-6">
       <h2 className="text-xl font-semibold mb-4">Flashcard</h2>
       <div className="relative w-[300px] h-[400px] perspective-1000">
         <div
           className="absolute w-full h-full transition-transform duration-500 ease-in-out transform-style-preserve-3d cursor-pointer"
           style={{ transform: isFlipped ? 'rotateY(360deg)' : 'rotateY(0deg)' }}
           onClick={handleFlipCard}
         >
           <div className="absolute w-full h-full bg-indigo-100 rounded-lg shadow-md flex items-center justify-center backface-hidden">
             <div className="text-center">
               <h3 className="text-2xl font-bold text-indigo-800">{isFlipped ? 'Back' : 'Front'}</h3>
               <p className="text-indigo-600">{isFlipped ? cardText.back : cardText.front}</p>
             </div>
           </div>
           <div className="absolute w-full h-full bg-indigo-200 rounded-lg shadow-md flex items-center justify-center backface-hidden"
                >
             <div className="text-center">
               <h3 className="text-2xl font-bold text-indigo-800">{isFlipped ? 'Front' : 'Back'}</h3>
               <p className="text-indigo-600">{isFlipped ? cardText.front : cardText.back}</p>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};


export default Dashboard;

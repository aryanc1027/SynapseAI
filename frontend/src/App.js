import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FlashcardsPage from './pages/Flashcard';
import Home from './pages/HomePage'; 
import Navbar from './components/Navbar'; 

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>

        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

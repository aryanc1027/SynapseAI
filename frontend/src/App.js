import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/HomePage'; 
import Navbar from './components/Navbar'; 

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
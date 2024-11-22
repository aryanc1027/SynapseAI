import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
// src/App.js

import React from 'react';
// ENHANCEMENT: Import routing components
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import your page components
import LandingPage from './LandingPage';
import MaharashtraMangroveMap from './components/MaharashtraMangroveMap';

function App() {
  return (
    <div className="App">
      {/* ENHANCEMENT: Define the routes for your application */}
      <Routes>
        {/* Route 1: The Landing Page (at the root URL "/") */}
        <Route path="/" element={<LandingPage />} />

        {/* Route 2: The Map Page (at the URL "/map") */}
        <Route path="/map" element={<MaharashtraMangroveMap />} />
      </Routes>
    </div>
  );
}

export default App;

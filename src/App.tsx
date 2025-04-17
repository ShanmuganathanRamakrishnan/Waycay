import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExplorePage from './pages/ExplorePage';
import PlaceDescription from './pages/PlaceDescription';
import './App.css';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ExplorePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/place/:id" element={<PlaceDescription />} />
            </Routes>
        </Router>
    );
};

export default App; 
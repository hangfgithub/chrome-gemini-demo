import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BuiltIn from './pages/BuiltIn';
import GoogleAIWeb  from './pages/GoogleAIWeb';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/googleAi_builtin" element={<BuiltIn />} />
        <Route path="/googleAi_web" element={<GoogleAIWeb />} />
      </Routes>
    </Router>
  );
}

export default App;
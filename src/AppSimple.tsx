import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SimpleTest from "./pages/SimpleTest";

const App = () => {
  console.log('App component rendering...');
  
  return (
    <div>
      <h1>TalentMatch AI - Debug Mode</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SimpleTest />} />
          <Route path="/simple-test" element={<SimpleTest />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

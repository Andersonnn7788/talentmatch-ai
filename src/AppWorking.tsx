import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simple test components
const HomePage = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1 style={{ color: '#2563eb' }}>TalentMatch AI</h1>
    <p>Welcome to TalentMatch AI - AI-powered talent matching platform</p>
    <nav style={{ marginTop: '20px' }}>
      <a href="/test" style={{ marginRight: '15px', color: '#2563eb' }}>Test Page</a>
      <a href="/auth" style={{ marginRight: '15px', color: '#2563eb' }}>Sign In</a>
      <a href="/simple-test" style={{ color: '#2563eb' }}>Simple Test</a>
    </nav>
  </div>
);

const TestPage = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>Test Page</h1>
    <p>This is the test page for resume upload functionality.</p>
    <a href="/" style={{ color: '#2563eb' }}>← Back to Home</a>
  </div>
);

const AuthPage = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>Authentication</h1>
    <p>Sign in to your TalentMatch AI account.</p>
    <a href="/" style={{ color: '#2563eb' }}>← Back to Home</a>
  </div>
);

const SimpleTestPage = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>Simple Test</h1>
    <p>Current time: {new Date().toLocaleString()}</p>
    <button onClick={() => alert('Test button works!')}>Test Button</button>
    <br /><br />
    <a href="/" style={{ color: '#2563eb' }}>← Back to Home</a>
  </div>
);

const App = () => {
  console.log('App component rendering...');
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/simple-test" element={<SimpleTestPage />} />
        <Route path="*" element={
          <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>404 - Page Not Found</h1>
            <a href="/" style={{ color: '#2563eb' }}>← Back to Home</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

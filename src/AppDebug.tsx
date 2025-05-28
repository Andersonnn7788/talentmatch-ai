import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simple debug page
const DebugHome = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial' }}>
    <h1>🔧 TalentMatch AI - Debug Mode</h1>
    <p>✅ React is working</p>
    <p>✅ Router is working</p>
    <p>Current URL: {window.location.pathname}</p>
    <p>Current time: {new Date().toLocaleString()}</p>
    
    <div style={{ marginTop: '20px' }}>
      <h3>Navigation Test:</h3>
      <a href="/" style={{ marginRight: '10px' }}>Home</a>
      <a href="/test" style={{ marginRight: '10px' }}>Test Page</a>
    </div>
    
    <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
      <h4>Environment Check:</h4>
      <p>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Present' : '❌ Missing'}</p>
      <p>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing'}</p>
    </div>
  </div>
);

const TestPage = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial' }}>
    <h1>Test Page</h1>
    <p>If you can see this, routing is working!</p>
    <a href="/">← Back to Home</a>
  </div>
);

const AppDebug = () => {
  console.log('🚀 AppDebug component rendering...');
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DebugHome />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<DebugHome />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppDebug;

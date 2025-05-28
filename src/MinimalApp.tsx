import React from 'react';

const MinimalApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'blue' }}>TalentMatch AI - Debug Mode</h1>
      <p>Current time: {new Date().toLocaleString()}</p>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert('Button clicked!')}>
        Test Button
      </button>
    </div>
  );
};

export default MinimalApp;

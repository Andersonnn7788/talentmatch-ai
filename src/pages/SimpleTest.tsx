import React from 'react';

const SimpleTest = () => {
  console.log('SimpleTest component rendered');
  return (
    <div style={{ padding: '20px', fontSize: '20px' }}>
      <h1>Simple Test Page</h1>
      <p>If you can see this, React is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default SimpleTest;

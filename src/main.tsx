import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AppDebug from './AppDebug.tsx';
import AppWorking from './AppWorking.tsx';
import AppFixed from './AppFixed.tsx';
import MinimalApp from './MinimalApp.tsx';
import './index.css';

// Add error boundary to catch any rendering errors
interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', 
        { style: { padding: '20px', fontSize: '18px', color: 'red' } },
        React.createElement('h1', null, 'Something went wrong.'),
        React.createElement('p', null, 'Check the console for error details.')
      );
    }

    return this.props.children;
  }
}

console.log('🚀 Starting TalentMatch AI...');

try {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }  createRoot(root).render(
    React.createElement(React.StrictMode, null,
      React.createElement(ErrorBoundary, null,
        React.createElement(AppFixed)
      )
    )
  );
  
  console.log('✅ App mounted successfully');
} catch (error) {
  console.error('❌ Failed to mount app:', error);
  
  // Fallback rendering
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; color: red; font-family: Arial;">
        <h1>Application Error</h1>
        <p>Failed to load TalentMatch AI. Check console for details.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}

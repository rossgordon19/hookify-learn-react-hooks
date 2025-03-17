import React from 'react';
import { CodeProvider } from './contexts/CodeContext';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <CodeProvider>
      <Dashboard />
    </CodeProvider>
  );
}

export default App;

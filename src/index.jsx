import React from 'react';
import { createRoot } from 'react-dom/client';
import DriverApp from './driver/DriverApp.jsx';

// Main entry point
const App = () => {
  return (
    <div>
      <DriverApp />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

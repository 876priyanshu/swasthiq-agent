import React, { useState } from 'react';
import Sidebar from './components/Sidebar';

function App() {
  // This is React state. Think of it as a private member variable that automatically 
  // triggers a UI re-render whenever it gets updated via setTab.
  const [activeTab, setActiveTab] = useState('reconciliation');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* The persistent sidebar[cite: 2] */}
      <Sidebar currentTab={activeTab} setTab={setActiveTab} />

      {/* Main content area (offset by the 64-width sidebar) */}
      <div className="ml-64 flex-1 p-8">
        
        {/* We will build these three screens in the next steps */}
        {activeTab === 'reconciliation' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">EOD Reconciliation</h2>
            <p className="text-gray-500">Upload a log to view metrics.</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
            <p className="text-gray-500">Upload a log to view charts.</p>
          </div>
        )}

        {activeTab === 'narrative' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">AI Narrative Summary</h2>
            <p className="text-gray-500">Upload a log to generate summary.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
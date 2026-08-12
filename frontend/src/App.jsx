import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import EODReconciliation from './components/EODReconciliation';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import Analytics from './components/Analytics';
import NarrativeSummary from './components/NarrativeSummary';

function App() {
  const [activeTab, setActiveTab] = useState('reconciliation');
  
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://swasthiq-agent-backend.onrender.com/api/v1/process-log', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail?.message || 'Failed to process file');
      }

      setReportData(result.data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      event.target.value = ''; 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentTab={activeTab} setTab={setActiveTab} />

      <div className="ml-64 flex-1 p-8">
        
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Clinic Dashboard</h2>
            <p className="text-sm text-gray-500">Upload today's JSON log to generate insights</p>
          </div>
          
          <div>
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
              <span>{isLoading ? 'Processing...' : 'Upload Log'}</span>
              <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center space-x-3">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {activeTab === 'reconciliation' && (
          <EODReconciliation data={reportData ? reportData.reconciliation : null} />
        )}

        {activeTab === 'analytics' && (
          <Analytics data={reportData ? reportData.analytics : null} />
        )}

        {activeTab === 'narrative' && (
          <NarrativeSummary data={reportData ? reportData.narrative : null} />
        )}

      </div>
    </div>
  );
}

export default App;
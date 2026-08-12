import React from 'react';

export default function NarrativeSummary({ data }) {
  if (!data) {
    return (
      <div className="p-4 border border-gray-300 text-gray-600 bg-white">
        Data loading or missing...
      </div>
    );
  }

  // Type checking: Is it the fallback string, or the real JSON object?
  const isString = typeof data === 'string';
  
  const summaryText = isString 
    ? data 
    : (data.summary || data.text || data.narrative || "No summary text generated.");
    
  const tracedMetrics = isString 
    ? [] 
    : (data.traced_metrics || data.metrics || data.grounded_figures || []);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* Main Text Area */}
      <div className="flex-[2] border border-gray-300 p-6 bg-white">
        <h2 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2 text-gray-800">
          EOD Summary
        </h2>
        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {summaryText}
        </div>
      </div>

      {/* Audit Panel */}
      <div className="flex-1 border border-gray-300 p-6 bg-gray-50 h-fit">
        <h3 className="font-bold text-gray-800 mb-2">Grounding Audit</h3>
        <p className="text-xs text-gray-600 mb-6">
          Metrics below are cross-referenced against the deterministic calculation engine.
        </p>

        <div className="flex flex-col gap-3">
          {tracedMetrics.length > 0 ? (
            tracedMetrics.map((metric, index) => (
              <div key={index} className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                <span className="text-gray-700">{metric.label}</span>
                <span className="font-mono text-gray-900">{metric.value} ✓</span>
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-500 italic">
              {isString ? "API offline. Local fallback used. No metrics traced." : "No metrics parsed."}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
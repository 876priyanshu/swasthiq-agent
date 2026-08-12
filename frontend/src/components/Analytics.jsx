import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Analytics({ data }) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">Upload a clinic log to generate the analytics report.</p>
      </div>
    );
  }

  // Format the 24-hour integer into a readable string (e.g., 14 -> "2pm")
  const formatHour = (hour) => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
  };

  // Format integer paise to Rupees
  const formatMoney = (paise) => {
    return '₹' + (paise / 100).toLocaleString('en-IN');
  };

  // Find the peak hour to dynamically highlight it in the UI
  const peakData = data.revenue_by_hour.reduce((prev, current) => 
    (prev.revenue > current.revenue) ? prev : current
  );

  return (
    <div className="space-y-6">
      
      {/* Revenue by Hour Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Revenue by Hour of Day</h3>
          {peakData.revenue > 0 && (
            <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Peak: {formatHour(peakData.hour)}-{formatHour(peakData.hour + 1)} — {formatMoney(peakData.revenue)}
            </p>
          )}
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.revenue_by_hour} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis 
                dataKey="hour" 
                tickFormatter={formatHour}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                formatter={(value) => [formatMoney(value), 'Revenue']}
                labelFormatter={(label) => `${formatHour(label)} - ${formatHour(label + 1)}`}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {data.revenue_by_hour.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.revenue === peakData.revenue && entry.revenue > 0 ? '#2563eb' : '#bfdbfe'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* By Quantity List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800">Top Medicines — by Quantity</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {data.top_medicines_by_quantity.map((med, index) => (
              <div key={index} className="px-6 py-3 flex justify-between items-center hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 font-mono text-sm">{index + 1}</span>
                  <span className="font-medium text-gray-700">{med.name}</span>
                </div>
                <span className="text-gray-500 text-sm">{med.value} units</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Revenue List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800">Top Medicines — by Revenue</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {data.top_medicines_by_revenue.map((med, index) => (
              <div key={index} className="px-6 py-3 flex justify-between items-center hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 font-mono text-sm">{index + 1}</span>
                  <span className="font-medium text-gray-700">{med.name}</span>
                </div>
                <span className="text-gray-500 text-sm">{formatMoney(med.value)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
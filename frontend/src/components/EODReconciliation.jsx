import React from 'react';

export default function EODReconciliation({ data }) {
  // If the API hasn't returned data yet, show a placeholder
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">Upload a clinic log to generate the EOD report.</p>
      </div>
    );
  }

  // Helper function to convert integer paise to formatted Rupees (e.g., 4285000 -> ₹42,850)
  const formatMoney = (paise) => {
    return '₹' + (paise / 100).toLocaleString('en-IN');
  };

  const statCards = [
    { label: 'TOTAL BILLED', value: data.total_billed, color: 'text-blue-700' },
    { label: 'TOTAL COLLECTED', value: data.total_collected, color: 'text-emerald-700' },
    { label: 'OUTSTANDING', value: data.outstanding, color: 'text-amber-600' },
    { label: 'REFUNDS', value: data.refunds, color: 'text-rose-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{card.label}</h3>
            <p className={`text-2xl font-bold ${card.color}`}>{formatMoney(card.value)}</p>
          </div>
        ))}
      </div>

      {/* Payment Mode Breakdown Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Payment Mode Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3 font-medium">Mode</th>
                <th className="px-6 py-3 font-medium text-right">Collected</th>
                <th className="px-6 py-3 font-medium text-right">Refunds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(data.payment_breakdown).map(([mode, values]) => (
                <tr key={mode} className="hover:bg-gray-50">
                  <td className="px-6 py-4 capitalize font-medium text-gray-700">{mode}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{formatMoney(values.collected)}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{formatMoney(values.refunds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
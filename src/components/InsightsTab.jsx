import React, { memo } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getBudgetForecast } from '../utils/forecast';
import { ChevronDown, ChevronUp } from 'lucide-react';

const InsightsTab = ({
  activeBudgetPeriod,
  categoryData,
  getInsights,
  getAIInsights,
  showTips,
  setShowTips,
  isDarkMode,
  filteredTransactions,
}) => {
  const moneyTips = [
    "Cook meals at home instead of eating out to save around ₹50-100 per month",
    "Use student discounts whenever possible - always keep your student ID handy",
    "Look for free events on campus instead of paid entertainment",
    "Buy used textbooks or rent them instead of buying new",
    "Set up automatic transfers to your savings account on payday",
    "Use the 24-hour rule: wait 24 hours before making non-essential purchases over ₹30",
    "Share subscriptions with roommates (Netflix, Spotify, etc.)",
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Financial Insights</h2>
      <div className="space-y-3">
        {getInsights().map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg flex items-start ${insight.type === 'alert' ? 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700' :
              insight.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700' :
              'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700'
            }`}
          >
            <div className="mr-3 mt-0.5">{insight.icon}</div>
            <div><p className="font-medium text-gray-900 dark:text-white">{insight.message}</p></div>
          </div>
        ))}
        <h3 className="text-lg font-medium mt-4 text-gray-900 dark:text-white">AI-Powered Insights</h3>
        {getAIInsights().map((insight, index) => (
          <div
            key={`ai-${index}`}
            className={`p-4 rounded-lg flex items-start ${insight.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700' :
              'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700'
            }`}
          >
            <div className="mr-3 mt-0.5">{insight.icon}</div>
            <div><p className="font-medium text-gray-900 dark:text-white">{insight.message}</p></div>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Budget Forecast</h3>
        <div className="space-y-2">
          {['weekly', 'monthly', 'yearly'].map(period => {
            const forecast = getBudgetForecast(filteredTransactions, period);
            return (
              <div key={period} className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">
                  {period.charAt(0).toUpperCase() + period.slice(1)} Forecast
                </span>
                <span className="text-gray-900 dark:text-white">
                  Projected: ₹{forecast.projectedSpending} (₹{forecast.avgDailySpending}/day)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Money Saving Tips for Students</h3>
          <button
            className="text-indigo-600 dark:text-indigo-400 flex items-center"
            onClick={() => setShowTips(!showTips)}
          >
            {showTips ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>

        {showTips && (
          <ul className="space-y-2">
            {moneyTips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                <span className="text-gray-900 dark:text-white">{tip}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
          {activeBudgetPeriod.charAt(0).toUpperCase() + activeBudgetPeriod.slice(1)} Spending by Category
        </h3>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#4b5563' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                formatter={(value) => `₹${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', color: isDarkMode ? '#f9fafb' : '#111827' }}
              />
              <Bar dataKey="value" fill="#8884d8">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default memo(InsightsTab);
import React, { memo } from 'react';
import { PieChart, LineChart, Pie, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DashboardTab = ({
  activeBudgetPeriod,
  setActiveBudgetPeriod,
  budgets,
  filteredTransactions,
  totalSpent,
  remainingBudget,
  percentSpent,
  categoryData,
  getSpendingTrends,
  categories,
  categoryBudgets,
  setCategoryBudgets,
  showEditBudgets,
  setShowEditBudgets,
  editBudgets,
  setEditBudgets,
  handleSaveBudgets,
  isDarkMode,
  setActiveTab
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 budget-selector">
        <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Budget Period</h2>
        <div className="flex space-x-2">
          {['weekly', 'monthly', 'yearly'].map(period => (
            <button
              key={period}
              className={`px-4 py-2 rounded-lg ${activeBudgetPeriod === period ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              onClick={() => setActiveBudgetPeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Edit Budgets</h2>
          <button
            className="text-indigo-600 dark:text-indigo-400 flex items-center"
            onClick={() => setShowEditBudgets(!showEditBudgets)}
          >
            {showEditBudgets ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        {showEditBudgets && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weekly Budget (₹)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  value={editBudgets.weekly}
                  onChange={(e) => setEditBudgets({ ...editBudgets, weekly: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Budget (₹)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  value={editBudgets.monthly}
                  onChange={(e) => setEditBudgets({ ...editBudgets, monthly: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yearly Budget (₹)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  value={editBudgets.yearly}
                  onChange={(e) => setEditBudgets({ ...editBudgets, yearly: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg"
                onClick={() => {
                  setShowEditBudgets(false);
                  setEditBudgets(budgets);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                onClick={handleSaveBudgets}
              >
                Save Budgets
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Spending by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', color: isDarkMode ? '#f9fafb' : '#111827' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
            {activeBudgetPeriod.charAt(0).toUpperCase() + activeBudgetPeriod.slice(1)} Spending
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getSpendingTrends()}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#4b5563' : '#e5e7eb'} />
                <XAxis dataKey="name" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  formatter={(value) => `₹${value}`}
                  contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', color: isDarkMode ? '#f9fafb' : '#111827' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Category Budgets</h2>
        <div className="space-y-2">
          {categories.map(category => {
            const categorySpent = filteredTransactions
              .filter(t => t.category === category.name && !t.isIncome)
              .reduce((sum, t) => sum + t.amount, 0);
            const categoryBudget = categoryBudgets[activeBudgetPeriod][category.name] || 0;
            const isOverBudget = categorySpent > categoryBudget && categoryBudget > 0;

            return (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  {category.icon}
                  <span className="ml-2 text-gray-900 dark:text-white">{category.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-sm ${isOverBudget ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      Spent: ₹{categorySpent.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Budget: ₹{categoryBudget.toFixed(2)}
                    </p>
                  </div>
                  <input
                    type="number"
                    className="w-24 p-1 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    value={categoryBudget}
                    onChange={(e) =>
                      setCategoryBudgets({
                        ...categoryBudgets,
                        [activeBudgetPeriod]: {
                          ...categoryBudgets[activeBudgetPeriod],
                          [category.name]: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {activeBudgetPeriod.charAt(0).toUpperCase() + activeBudgetPeriod.slice(1)} Budget
          </h2>
          <span className={`px-2 py-1 rounded-full text-sm ${remainingBudget < 0 ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}`}>
            {remainingBudget < 0 ? 'Exceeded' : `${(remainingBudget / budgets[activeBudgetPeriod] * 100).toFixed(0)}% left`}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Spent: ₹{totalSpent.toFixed(2)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Remaining: ₹{remainingBudget.toFixed(2)}</p>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">₹{budgets[activeBudgetPeriod].toFixed(2)}</p>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
          <div
            className={`h-2.5 rounded-full ${percentSpent > 100 ? 'bg-red-500' : 'bg-indigo-500'}`}
            style={{ width: `${Math.min(percentSpent, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</h3>
          <button
            className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center"
            onClick={() => setActiveTab('transactions')}
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {filteredTransactions.slice(0, 3).map(transaction => (
            <div key={transaction.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <div className="flex items-center">
                {categories.find(c => c.name === transaction.category)?.icon}
                <div className="ml-3">
                  <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <p className={`font-medium ${transaction.isIncome ? 'text-green-500' : 'text-red-500'}`}>
                {transaction.isIncome ? '+' : '-'}₹{transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardTab);
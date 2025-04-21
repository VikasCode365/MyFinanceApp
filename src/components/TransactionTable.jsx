import { useState } from 'react';
import { toast } from 'react-toastify';

function TransactionTable({ transactions, categories, handleDeleteTransaction, activeBudgetPeriod, isDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filtered = transactions.filter(t =>
    (t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     t.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (categoryFilter ? t.category === categoryFilter : true)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {filtered.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No transactions for this period. Add one to get started!</p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-1/2 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-1/4 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto max-w-full">
            <table className="w-full min-w-[600px] text-gray-900 dark:text-white">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-right p-4">Amount</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="border-t border-gray-200 dark:border-gray-600">
                {filtered.map(transaction => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="p-4">{transaction.description}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        {categories.find(c => c.name === transaction.category)?.icon}
                        <span className="ml-2">{transaction.category}</span>
                      </div>
                    </td>
                    <td className="p-4">{transaction.date}</td>
                    <td
                      className={`p-4 text-right font-medium ${transaction.isIncome ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {transaction.isIncome ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete transaction"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionTable;
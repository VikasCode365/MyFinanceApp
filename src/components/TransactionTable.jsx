import { useState } from 'react';
import { Trash2 } from 'lucide-react';

function TransactionTable({ 
  transactions, 
  categories, 
  handleDeleteTransaction, 
  activeBudgetPeriod, 
  isDarkMode,
  renderCategoryIcon // This is the new prop we're receiving from parent
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filtered = transactions.filter(t =>
    (t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     t.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (categoryFilter ? t.category === categoryFilter : true)
  );

  // Function to render icon if renderCategoryIcon is passed, otherwise use a text fallback
  const renderCategoryWithIcon = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    
    if (!category) {
      return <span>{categoryName}</span>;
    }
    
    return (
      <div className="flex items-center">
        <div className="flex items-center justify-center">
          {category.icon}
        </div>
        <span className="ml-2">{categoryName}</span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {transactions.length === 0 ? (
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
                      {renderCategoryWithIcon(transaction.category)}
                    </td>
                    <td className="p-4">{transaction.date}</td>
                    <td
                      className={`p-4 text-right font-medium ${transaction.isIncome ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {transaction.isIncome ? '+' : '-'}₹{parseFloat(transaction.amount).toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete transaction"
                      >
                        <Trash2 size={16} />
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
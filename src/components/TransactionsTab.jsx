import React, { memo } from 'react';
import TransactionTable from './TransactionTable';
import { PlusCircle, Coffee, ShoppingBag, Music, CreditCard, Home, Plane, Gift, Utensils, Car, Book, Dumbbell, Film, Headphones } from 'lucide-react';

const TransactionsTab = ({
  activeBudgetPeriod,
  setActiveBudgetPeriod,
  filteredTransactions,
  categories,
  newTransaction,
  setNewTransaction,
  showAddTransaction,
  setShowAddTransaction,
  isAddingCategory,
  setIsAddingCategory,
  newCategory,
  setNewCategory,
  handleAddTransaction,
  handleDeleteTransaction,
  handleAddCategory,
  isDarkMode
}) => {
  const availableIcons = [
    { name: 'Coffee', component: <Coffee /> },
    { name: 'ShoppingBag', component: <ShoppingBag /> },
    { name: 'Music', component: <Music /> },
    { name: 'CreditCard', component: <CreditCard /> },
    { name: 'Home', component: <Home /> },
    { name: 'Plane', component: <Plane /> },
    { name: 'Gift', component: <Gift /> },
    { name: 'Utensils', component: <Utensils /> },
    { name: 'Car', component: <Car /> },
    { name: 'Book', component: <Book /> },
    { name: 'Dumbbell', component: <Dumbbell /> },
    { name: 'Film', component: <Film /> },
    { name: 'Headphones', component: <Headphones /> },
  ];

  const availableColors = [
    { name: 'Green', value: '#10b981' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Teal', value: '#14b8a6' },
  ];

  const getColorClass = (hexColor) => {
    const colorMap = {
      '#10b981': 'green-500',
      '#3b82f6': 'blue-500',
      '#ef4444': 'red-500',
      '#f97316': 'orange-500',
      '#a855f7': 'purple-500',
      '#ec4899': 'pink-500',
      '#eab308': 'yellow-500',
      '#14b8a6': 'teal-500',
    };
    return colorMap[hexColor] || 'gray-500';
  };

  const exportToCSV = () => {
    const csv = filteredTransactions.map(t =>
      `${t.date},${t.description},${t.category},${t.amount},${t.isIncome}`
    ).join('\n');
    const blob = new Blob([`Date,Description,Category,Amount,IsIncome\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Transactions exported!');
  };

  const importFromCSV = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const rows = text.split('\n').slice(1);
        const newTransactions = rows
          .filter(row => row.trim())
          .map((row, index) => {
            const [date, description, category, amount, isIncome] = row.split(',');
            if (!date || !category || isNaN(amount)) throw new Error('Invalid CSV format');
            return {
              id: filteredTransactions.length + index + 1,
              date,
              description: description || '',
              category,
              amount: parseFloat(amount),
              isIncome: isIncome === 'true',
            };
          });
        setTransactions([...newTransactions, ...filteredTransactions]);
        const balanceChange = newTransactions.reduce((sum, t) => sum + (t.isIncome ? t.amount : -t.amount), 0);
        setBalance(prev => prev + balanceChange);
        toast.success('Transactions imported!');
      } catch (error) {
        toast.error('Error importing CSV: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transactions</h2>
        <div className="flex items-center space-x-2">
          <select
            className="p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            value={activeBudgetPeriod}
            onChange={(e) => setActiveBudgetPeriod(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button
            onClick={exportToCSV}
            className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Export CSV
          </button>
          <label className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer">
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={importFromCSV}
              className="hidden"
            />
          </label>
          <button
            className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center add-transaction-btn"
            onClick={() => setShowAddTransaction(!showAddTransaction)}
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {showAddTransaction && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Add New Transaction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                value={newTransaction.isIncome}
                onChange={(e) => setNewTransaction({ ...newTransaction, isIncome: e.target.value === 'true' })}
              >
                <option value={false}>Expense</option>
                <option value={true}>Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <div className="flex">
                <select
                  className="w-full p-2 border rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  value={newTransaction.category}
                  onChange={(e) => {
                    if (e.target.value === 'create-new') {
                      setIsAddingCategory(true);
                    } else {
                      setNewTransaction({ ...newTransaction, category: e.target.value });
                    }
                  }}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                  <option value="create-new">+ Create New Category</option>
                </select>
                <button
                  className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-2 rounded-r-lg border-t border-r border-b border-gray-300 dark:border-gray-600"
                  onClick={() => setIsAddingCategory(true)}
                  type="button"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                placeholder="Coffee, groceries, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </div>
          </div>
          {isAddingCategory && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Create New Category</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Transportation, Education, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
                  <select
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  >
                    {availableIcons.map((icon, index) => (
                      <option key={index} value={icon.name}>{icon.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                  <div className="flex items-center">
                    <select
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    >
                      {availableColors.map((color, index) => (
                        <option key={index} value={color.value}>{color.name}</option>
                      ))}
                    </select>
                    <div
                      className="w-6 h-6 rounded-full ml-2"
                      style={{ backgroundColor: newCategory.color }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <span className="mr-2 text-gray-900 dark:text-white">Preview:</span>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow">
                  {React.cloneElement(
                    availableIcons.find(icon => icon.name === newCategory.icon)?.component || availableIcons[0].component,
                    { style: { color: newCategory.color } }
                  )}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{newCategory.name || 'New Category'}</span>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg mr-2"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategory({ name: '', color: '#10b981', icon: 'Coffee' });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-600 dark:bg-indigo-700 text-white px-3 py-1 rounded-lg"
                  onClick={handleAddCategory}
                >
                  Add Category
                </button>
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <button
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg mr-2"
              onClick={() => setShowAddTransaction(false)}
            >
              Cancel
            </button>
            <button
              className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-lg"
              onClick={handleAddTransaction}
            >
              Save Transaction
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No transactions for this period. Add one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-w-full">
            <TransactionTable
              transactions={filteredTransactions}
              categories={categories}
              handleDeleteTransaction={handleDeleteTransaction}
              activeBudgetPeriod={activeBudgetPeriod}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(TransactionsTab);
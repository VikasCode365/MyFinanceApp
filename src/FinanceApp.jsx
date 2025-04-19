import { useState, useEffect } from 'react';
import { PieChart, LineChart, BarChart } from 'recharts';
import { Pie, Line, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircle, MinusCircle, Wallet, CreditCard, Coffee, ShoppingBag, Music, AlertCircle, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

export default function FinanceApp() {
  // Initial sample data
  const initialCategories = [
    { id: 1, name: 'Food', icon: <Coffee className="text-orange-500" />, color: '#f97316' },
    { id: 2, name: 'Shopping', icon: <ShoppingBag className="text-blue-500" />, color: '#3b82f6' },
    { id: 3, name: 'Entertainment', icon: <Music className="text-purple-500" />, color: '#a855f7' },
    { id: 4, name: 'Bills', icon: <CreditCard className="text-red-500" />, color: '#ef4444' }
  ];

  const initialTransactions = [
    { id: 1, amount: 12.50, category: 'Food', date: '2025-04-19', description: 'Campus cafe' },
    { id: 2, amount: 25.00, category: 'Shopping', date: '2025-04-18', description: 'Textbooks' },
    { id: 3, amount: 15.00, category: 'Entertainment', date: '2025-04-17', description: 'Movie night' },
    { id: 4, amount: 30.00, category: 'Bills', date: '2025-04-16', description: 'Phone bill' },
    { id: 5, amount: 8.75, category: 'Food', date: '2025-04-15', description: 'Smoothie' }
  ];

  const initialGoals = [
    { id: 1, name: 'Concert ticket', target: 150, saved: 50, deadline: '2025-06-30' }
  ];

  // States
  const [transactions, setTransactions] = useState(initialTransactions);
  const [categories, setCategories] = useState(initialCategories);
  const [goals, setGoals] = useState(initialGoals);
  const [balance, setBalance] = useState(350);
  const [monthlyBudget, setMonthlyBudget] = useState(500);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Form states
  const [newTransaction, setNewTransaction] = useState({ amount: '', category: 'Food', description: '', date: '' });
  const [newGoal, setNewGoal] = useState({ name: '', target: '', saved: '', deadline: '' });
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showTips, setShowTips] = useState(false);
  
  // Calculated values
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const remainingBudget = monthlyBudget - totalSpent;
  const percentSpent = (totalSpent / monthlyBudget) * 100;
  
  // Chart data
  const categoryData = categories.map(category => {
    const amount = transactions
      .filter(t => t.category === category.name)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: category.name,
      value: amount,
      color: category.color
    };
  });
  
  // Spending trends - simplified for demo
  const spendingTrends = [
    { name: 'Apr 13', amount: 15 },
    { name: 'Apr 14', amount: 20 },
    { name: 'Apr 15', amount: 8.75 },
    { name: 'Apr 16', amount: 30 },
    { name: 'Apr 17', amount: 15 },
    { name: 'Apr 18', amount: 25 },
    { name: 'Apr 19', amount: 12.5 }
  ];
  
  // Add transaction
  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category) return;
    
    const transaction = {
      id: transactions.length + 1,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      description: newTransaction.description,
      date: newTransaction.date || new Date().toISOString().split('T')[0]
    };
    
    setTransactions([transaction, ...transactions]);
    setBalance(balance - transaction.amount);
    setNewTransaction({ amount: '', category: 'Food', description: '', date: '' });
    setShowAddTransaction(false);
  };
  
  // Add goal
  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    
    const goal = {
      id: goals.length + 1,
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      saved: parseFloat(newGoal.saved) || 0,
      deadline: newGoal.deadline
    };
    
    setGoals([...goals, goal]);
    setNewGoal({ name: '', target: '', saved: '', deadline: '' });
    setShowAddGoal(false);
  };
  
  // Insights and tips
  const getInsights = () => {
    const insights = [];
    
    // Budget alert
    if (remainingBudget < 0) {
      insights.push({
        type: 'alert',
        message: 'You have exceeded your monthly budget!',
        icon: <AlertCircle className="text-red-500" />
      });
    } else if (remainingBudget < monthlyBudget * 0.2) {
      insights.push({
        type: 'warning',
        message: 'You have less than 20% of your budget remaining.',
        icon: <AlertCircle className="text-yellow-500" />
      });
    }
    
    // Category insights
    const foodSpending = transactions
      .filter(t => t.category === 'Food')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (foodSpending > monthlyBudget * 0.3) {
      insights.push({
        type: 'tip',
        message: 'Your food spending is high. Consider meal prepping to save money.',
        icon: <Coffee className="text-orange-500" />
      });
    }
    
    // Goal progress
    const concertGoal = goals.find(g => g.name === 'Concert ticket');
    if (concertGoal) {
      const progress = (concertGoal.saved / concertGoal.target) * 100;
      if (progress < 50) {
        insights.push({
          type: 'goal',
          message: `You're ${progress.toFixed(0)}% of the way to your concert ticket. Try setting aside ₹20 per week.`,
          icon: <Music className="text-purple-500" />
        });
      }
    }
    
    return insights;
  };
  
  const moneyTips = [
    "Cook meals at home instead of eating out to save around ₹50-100 per month",
    "Use student discounts whenever possible - always keep your student ID handy",
    "Look for free events on campus instead of paid entertainment",
    "Buy used textbooks or rent them instead of buying new",
    "Set up automatic transfers to your savings account on payday",
    "Use the 24-hour rule: wait 24 hours before making non-essential purchases over ₹30",
    "Share subscriptions with roommates (Netflix, Spotify, etc.)"
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 w-full" >
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center">
            <Wallet className="mr-2" /> CampusCash
          </h1>
          <div className="text-right">
            <p className="text-sm opacity-80">Available Balance</p>
            <p className="text-xl font-bold">₹{balance.toFixed(2)}</p>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-white border-b p-2">
        <div className="flex justify-between">
          <button 
            className={`px-4 py-2 ${activeTab === 'dashboard' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'transactions' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'goals' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('goals')}
          >
            Goals
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'insights' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('insights')}
          >
            Insights
          </button>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Budget Card */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Monthly Budget</h2>
                <span className={`px-2 py-1 rounded-full text-sm ${remainingBudget < 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {remainingBudget < 0 ? 'Exceeded' : `${(remainingBudget / monthlyBudget * 100).toFixed(0)}% left`}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Spent: ₹{totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Remaining: ₹{remainingBudget.toFixed(2)}</p>
                </div>
                <p className="text-lg font-semibold">₹{monthlyBudget.toFixed(2)}</p>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className={`h-2.5 rounded-full ${percentSpent > 100 ? 'bg-red-500' : 'bg-indigo-500'}`}
                  style={{ width: `${Math.min(percentSpent, 100)}%` }}
                ></div>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium mb-2">Spending by Category</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium mb-2">Daily Spending</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spendingTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value}`} />
                      <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Recent Transactions</h3>
                <button 
                  className="text-indigo-600 text-sm font-medium flex items-center"
                  onClick={() => setActiveTab('transactions')}
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                {transactions.slice(0, 3).map(transaction => (
                  <div key={transaction.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center">
                      {categories.find(c => c.name === transaction.category)?.icon}
                      <div className="ml-3">
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                    <p className="font-medium text-red-500">-${transaction.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Transactions */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Transactions</h2>
              <button 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center"
                onClick={() => setShowAddTransaction(!showAddTransaction)}
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                Add Transaction
              </button>
            </div>
            
            {/* Add Transaction Form */}
            {showAddTransaction && (
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <h3 className="text-lg font-medium mb-4">Add New Transaction</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                      placeholder="Coffee, groceries, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mr-2"
                    onClick={() => setShowAddTransaction(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                    onClick={handleAddTransaction}
                  >
                    Save Transaction
                  </button>
                </div>
              </div>
            )}
            
            {/* Transaction List */}
            <div className="bg-white rounded-lg shadow">
              {transactions.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No transactions yet. Add one to get started!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4">Description</th>
                        <th className="text-left p-4">Category</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-right p-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="p-4">{transaction.description}</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              {categories.find(c => c.name === transaction.category)?.icon}
                              <span className="ml-2">{transaction.category}</span>
                            </div>
                          </td>
                          <td className="p-4">{transaction.date}</td>
                          <td className="p-4 text-right text-red-500 font-medium">
                            -₹{transaction.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Goals */}
        {activeTab === 'goals' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Savings Goals</h2>
              <button 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center"
                onClick={() => setShowAddGoal(!showAddGoal)}
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                Add Goal
              </button>
            </div>
            
            {/* Add Goal Form */}
            {showAddGoal && (
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <h3 className="text-lg font-medium mb-4">Create New Savings Goal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                      placeholder="Concert tickets, new laptop, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (₹)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Already Saved (₹)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg"
                      value={newGoal.saved}
                      onChange={(e) => setNewGoal({...newGoal, saved: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mr-2"
                    onClick={() => setShowAddGoal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                    onClick={handleAddGoal}
                  >
                    Create Goal
                  </button>
                </div>
              </div>
            )}
            
            {/* Goals List */}
            <div className="grid grid-cols-1 gap-4">
              {goals.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">No savings goals yet. Create one to start saving!</p>
                </div>
              ) : (
                goals.map((goal) => {
                  const progress = (goal.saved / goal.target) * 100;
                  const remaining = goal.target - goal.saved;
                  
                  // Calculate days remaining if deadline exists
                  let daysRemaining = null;
                  if (goal.deadline) {
                    const today = new Date();
                    const deadline = new Date(goal.deadline);
                    const diffTime = deadline - today;
                    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  }
                  
                  return (
                    <div key={goal.id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">{goal.name}</h3>
                        <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          {progress.toFixed(0)}% Complete
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm text-gray-500">Saved: ₹{goal.saved.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Target: ₹{goal.target.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Need: ₹{remaining.toFixed(2)}</p>
                          {daysRemaining !== null && (
                            <p className="text-sm text-gray-500">{daysRemaining} days left</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full bg-indigo-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      
                      {/* Actions */}
                      <div className="mt-4 flex justify-end">
                        <button className="text-indigo-600 text-sm font-medium px-3 py-1 border border-indigo-600 rounded-lg">
                          Add Funds
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
        
        {/* Insights */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Financial Insights</h2>
            
            {/* Alerts & Tips */}
            <div className="space-y-3">
              {getInsights().map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg flex items-start ${
                  insight.type === 'alert' ? 'bg-red-50 border border-red-200' : 
                  insight.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="mr-3 mt-0.5">
                    {insight.icon}
                  </div>
                  <div>
                    <p className="font-medium">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Money Saving Tips */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Money Saving Tips for Students</h3>
                <button 
                  className="text-indigo-600 flex items-center"
                  onClick={() => setShowTips(!showTips)}
                >
                  {showTips ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>
              
              {showTips && (
                <ul className="space-y-2">
                  {moneyTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Category Analysis */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium mb-4">Monthly Spending by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
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
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t p-2 text-center text-gray-500 text-sm">
        <p>CampusCash - Helping students manage money smarter</p>
      </footer>
    </div>
  );
}
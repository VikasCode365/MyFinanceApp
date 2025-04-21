import React, { useState, useEffect } from 'react';
import TransactionTable from '../components/TransactionTable';
import { getBudgetForecast } from '../utils/forecast';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { loadState, saveState } from '../utils/storage';
import { PieChart, LineChart, BarChart, Pie, Line, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircle, Wallet, CreditCard, Coffee, ShoppingBag, Music, AlertCircle, TrendingUp, ChevronDown, ChevronUp, Home, Plane, Gift, Utensils, Car, Book, Dumbbell, Film, Headphones, Moon, Sun } from 'lucide-react';

export default function FinanceApp({ setIsAuthenticated }) {
  // Initial sample data
  const initialCategories = [
    { id: 1, name: 'Food', icon: <Coffee className="text-orange-500" />, color: '#f97316' },
    { id: 2, name: 'Shopping', icon: <ShoppingBag className="text-blue-500" />, color: '#3b82f6' },
    { id: 3, name: 'Entertainment', icon: <Music className="text-purple-500" />, color: '#a855f7' },
    { id: 4, name: 'Bills', icon: <CreditCard className="text-red-500" />, color: '#ef4444' },
  ];

  const initialTransactions = [
    { id: 1, amount: 12.50, category: 'Food', date: '2025-04-19', description: 'Campus cafe', isIncome: false },
    { id: 2, amount: 25.00, category: 'Shopping', date: '2025-04-18', description: 'Textbooks', isIncome: false },
    { id: 3, amount: 15.00, category: 'Entertainment', date: '2025-04-17', description: 'Movie night', isIncome: false },
    { id: 4, amount: 30.00, category: 'Bills', date: '2025-04-16', description: 'Phone bill', isIncome: false },
    { id: 5, amount: 8.75, category: 'Food', date: '2025-04-15', description: 'Smoothie', isIncome: false },
  ];

  const initialGoals = [
    { id: 1, name: 'Concert ticket', target: 150, saved: 50, deadline: '2025-06-30' },
  ];

  // States
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = loadState('darkMode', false);
    console.log('Initial dark mode from storage:', saved);
    document.documentElement.classList.toggle('dark', saved);
    return saved;
  });
  const [transactions, setTransactions] = useState(loadState('transactions', initialTransactions));
  const [categories, setCategories] = useState(loadState('categories', initialCategories));
  const [goals, setGoals] = useState(loadState('goals', initialGoals));
  const [balance, setBalance] = useState(loadState('balance', 350));
  const [budgets, setBudgets] = useState(loadState('budgets', {
    weekly: 150,
    monthly: 500,
    yearly: 6000,
  }));
  const [activeBudgetPeriod, setActiveBudgetPeriod] = useState('monthly');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: '',
    isIncome: false,
  });
  const [categoryBudgets, setCategoryBudgets] = useState(loadState('categoryBudgets', {
    weekly: { Food: 50, Shopping: 100, Entertainment: 30, Bills: 50 },
    monthly: { Food: 200, Shopping: 300, Entertainment: 100, Bills: 200 },
    yearly: { Food: 2400, Shopping: 3600, Entertainment: 1200, Bills: 2400 },
  }));
  const [achievements, setAchievements] = useState(loadState('achievements', []));
  const [newGoal, setNewGoal] = useState({ name: '', target: '', saved: '', deadline: '' });
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#10b981', icon: 'Coffee' });
  const [showEditBudgets, setShowEditBudgets] = useState(false);
  const [editBudgets, setEditBudgets] = useState(budgets);

  // Dark Mode Effect
  useEffect(() => {
    console.log('Applying dark mode:', isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
    saveState('darkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.removeItem('darkMode');
    const saved = loadState('darkMode', false);
    setIsDarkMode(saved);
    document.documentElement.classList.toggle('dark', saved);
  }, []);

  // Persist States
  useEffect(() => saveState('transactions', transactions), [transactions]);
  useEffect(() => saveState('categories', categories), [categories]);
  useEffect(() => saveState('goals', goals), [goals]);
  useEffect(() => saveState('balance', balance), [balance]);
  useEffect(() => saveState('budgets', budgets), [budgets]);
  useEffect(() => saveState('categoryBudgets', categoryBudgets), [categoryBudgets]);
  useEffect(() => saveState('achievements', achievements), [achievements]);

  // Goal Achievement Notifications
  useEffect(() => {
    goals.forEach(goal => {
      const progress = (goal.saved / goal.target) * 100;
      if (progress >= 100) {
        toast.success(`Congratulations! You reached your ${goal.name} goal!`, { toastId: `goal-${goal.id}` });
      }
    });
  }, [goals]);

  // Budget Notifications
  useEffect(() => {
    const remainingBudget = budgets[activeBudgetPeriod] - filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    if (remainingBudget < 0) {
      toast.error(`You have exceeded your ${activeBudgetPeriod} budget!`, { toastId: 'budget-exceeded' });
    } else if (remainingBudget < budgets[activeBudgetPeriod] * 0.2) {
      toast.warn(`Less than 20% of your ${activeBudgetPeriod} budget remains!`, { toastId: 'budget-low' });
    }
  }, [activeBudgetPeriod, transactions, budgets]);

  // Available Icons and Colors
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

  // Helper Functions
  const getFilteredTransactions = (period) => {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      switch (period) {
        case 'weekly':
          return transactionDate >= startOfWeek;
        case 'monthly':
          return transactionDate >= startOfMonth;
        case 'yearly':
          return transactionDate >= startOfYear;
        default:
          return true;
      }
    });
  };

  const filteredTransactions = getFilteredTransactions(activeBudgetPeriod);
  const totalSpent = filteredTransactions.reduce((sum, t) => sum + (t.isIncome ? 0 : t.amount), 0);
  const activeBudget = budgets[activeBudgetPeriod];
  const remainingBudget = activeBudget - totalSpent;
  const percentSpent = (totalSpent / activeBudget) * 100;

  const getAIInsights = () => {
    const insights = [];
    const totalIncome = transactions
      .filter(t => t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    if (totalExpenses > totalIncome * 0.8) {
      insights.push({
        type: 'warning',
        message: 'Your expenses are close to your income. Consider reducing discretionary spending.',
        icon: <AlertCircle className="text-yellow-500" />,
      });
    }

    categories.forEach(category => {
      const categorySpent = filteredTransactions
        .filter(t => t.category === category.name && !t.isIncome)
        .reduce((sum, t) => sum + t.amount, 0);
      const categoryBudget = categoryBudgets[activeBudgetPeriod][category.name] || 0;
      if (categoryBudget > 0 && categorySpent > categoryBudget) {
        insights.push({
          type: 'alert',
          message: `You have exceeded your ${category.name} budget by ₹${(categorySpent - categoryBudget).toFixed(2)}!`,
          icon: <AlertCircle className="text-red-500" />,
        });
      }
    });

    return insights;
  };

  const getInsights = () => {
    const insights = [];
    const periodTransactions = filteredTransactions;

    if (remainingBudget < 0) {
      insights.push({
        type: 'alert',
        message: `You have exceeded your ${activeBudgetPeriod} budget!`,
        icon: <AlertCircle className="text-red-500" />,
      });
    } else if (remainingBudget < activeBudget * 0.2) {
      insights.push({
        type: 'warning',
        message: `You have less than 20% of your ${activeBudgetPeriod} budget remaining.`,
        icon: <AlertCircle className="text-yellow-500" />,
      });
    }

    categories.forEach(category => {
      const categorySpent = periodTransactions
        .filter(t => t.category === category.name && !t.isIncome)
        .reduce((sum, t) => sum + t.amount, 0);
      const categoryBudget = categoryBudgets[activeBudgetPeriod][category.name] || 0;
      if (categoryBudget > 0 && categorySpent > categoryBudget) {
        insights.push({
          type: 'alert',
          message: `You have exceeded your ${category.name} budget by ₹${(categorySpent - categoryBudget).toFixed(2)}!`,
          icon: <AlertCircle className="text-red-500" />,
        });
      }
    });

    const foodSpending = periodTransactions
      .filter(t => t.category === 'Food' && !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    if (foodSpending > (categoryBudgets[activeBudgetPeriod].Food || activeBudget * 0.3)) {
      insights.push({
        type: 'tip',
        message: `Your food spending is high in your ${activeBudgetPeriod} budget. Consider meal prepping to save money.`,
        icon: <Coffee className="text-orange-500" />,
      });
    }

    const concertGoal = goals.find(g => g.name === 'Concert ticket');
    if (concertGoal) {
      const progress = (concertGoal.saved / concertGoal.target) * 100;
      if (progress < 50) {
        insights.push({
          type: 'goal',
          message: `You're ${progress.toFixed(0)}% of the way to your concert ticket. Try setting aside ₹20 per week.`,
          icon: <Music className="text-purple-500" />,
        });
      }
    }

    return insights;
  };

  const getSpendingTrends = () => {
    const trends = [];
    const now = new Date();

    if (activeBudgetPeriod === 'weekly') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const amount = transactions
          .filter(t => t.date === date.toISOString().split('T')[0] && !t.isIncome)
          .reduce((sum, t) => sum + t.amount, 0);
        trends.push({
          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
          amount,
        });
      }
    } else if (activeBudgetPeriod === 'monthly') {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let i = Math.min(6, daysInMonth - now.getDate()); i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const amount = transactions
          .filter(t => t.date === date.toISOString().split('T')[0] && !t.isIncome)
          .reduce((sum, t) => sum + t.amount, 0);
        trends.push({
          name: date.toLocaleDateString('en-US', { day: 'numeric' }),
          amount,
        });
      }
    } else {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const amount = transactions
          .filter(t => {
            const tDate = new Date(t.date);
            return tDate.getFullYear() === date.getFullYear() && tDate.getMonth() === date.getMonth() && !t.isIncome;
          })
          .reduce((sum, t) => sum + t.amount, 0);
        trends.push({
          name: date.toLocaleDateString('en-US', { month: 'short' }),
          amount,
        });
      }
    }
    return trends;
  };

  const exportToCSV = () => {
    const csv = transactions.map(t =>
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
              id: transactions.length + index + 1,
              date,
              description: description || '',
              category,
              amount: parseFloat(amount),
              isIncome: isIncome === 'true',
            };
          });
        setTransactions([...newTransactions, ...transactions]);
        const balanceChange = newTransactions.reduce((sum, t) => sum + (t.isIncome ? t.amount : -t.amount), 0);
        setBalance(prev => prev + balanceChange);
        toast.success('Transactions imported!');
      } catch (error) {
        toast.error('Error importing CSV: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const handleAddTransaction = () => {
    if (!newTransaction.amount || parseFloat(newTransaction.amount) <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }
    if (!newTransaction.category) {
      toast.error('Please select a category');
      return;
    }
    if (!newTransaction.date || new Date(newTransaction.date) > new Date()) {
      toast.error('Please select a valid past or current date');
      return;
    }

    const transaction = {
      id: transactions.length + 1,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      description: newTransaction.description,
      date: newTransaction.date || new Date().toISOString().split('T')[0],
      isIncome: newTransaction.isIncome,
    };

    setTransactions([transaction, ...transactions]);
    setBalance(prev => prev + (transaction.isIncome ? transaction.amount : -transaction.amount));
    setNewTransaction({ amount: '', category: 'Food', description: '', date: '', isIncome: false });
    setShowAddTransaction(false);
    toast.success(`${transaction.isIncome ? 'Income' : 'Expense'} added successfully!`);
  };

  const handleDeleteTransaction = (id) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (transactionToDelete) {
      setBalance(prev => prev + (transactionToDelete.isIncome ? -transactionToDelete.amount : transactionToDelete.amount));
      setTransactions(transactions.filter(t => t.id !== id));
      toast.success('Transaction deleted!');
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.name) {
      toast.error('Please enter a goal name');
      return;
    }
    if (!newGoal.target || parseFloat(newGoal.target) <= 0) {
      toast.error('Please enter a valid target amount');
      return;
    }
    if (newGoal.deadline && new Date(newGoal.deadline) < new Date()) {
      toast.error('Please select a future deadline');
      return;
    }

    const goal = {
      id: goals.length + 1,
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      saved: parseFloat(newGoal.saved) || 0,
      deadline: newGoal.deadline,
    };

    setGoals([...goals, goal]);
    setNewGoal({ name: '', target: '', saved: '', deadline: '' });
    setShowAddGoal(false);
    toast.success('Goal created successfully!');
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast.error('Please enter a category name');
      return;
    }

    const selectedIcon = availableIcons.find(icon => icon.name === newCategory.icon);
    const category = {
      id: categories.length + 1,
      name: newCategory.name,
      icon: <selectedIcon.component.type className={`text-${getColorClass(newCategory.color)}`} />,
      color: newCategory.color,
    };

    setCategories([...categories, category]);
    setCategoryBudgets(prev => ({
      ...prev,
      weekly: { ...prev.weekly, [category.name]: 0 },
      monthly: { ...prev.monthly, [category.name]: 0 },
      yearly: { ...prev.yearly, [category.name]: 0 },
    }));
    setIsAddingCategory(false);
    setNewCategory({ name: '', color: '#10b981', icon: 'Coffee' });
    setNewTransaction({ ...newTransaction, category: category.name });
    toast.success('Category added!');
  };

  const handleSaveBudgets = () => {
    if (
      editBudgets.weekly <= 0 ||
      editBudgets.monthly <= 0 ||
      editBudgets.yearly <= 0
    ) {
      toast.error('Please enter valid positive budget amounts');
      return;
    }
    setBudgets({
      weekly: parseFloat(editBudgets.weekly),
      monthly: parseFloat(editBudgets.monthly),
      yearly: parseFloat(editBudgets.yearly),
    });
    setShowEditBudgets(false);
    toast.success('Budgets updated successfully!');
  };

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

  const resetToDemo = () => {
    setTransactions(initialTransactions);
    setCategories(initialCategories);
    setGoals(initialGoals);
    setBalance(350);
    setBudgets({ weekly: 150, monthly: 500, yearly: 6000 });
    setCategoryBudgets({
      weekly: { Food: 50, Shopping: 100, Entertainment: 30, Bills: 50 },
      monthly: { Food: 200, Shopping: 300, Entertainment: 100, Bills: 200 },
      yearly: { Food: 2400, Shopping: 3600, Entertainment: 1200, Bills: 2400 },
    });
    setAchievements([]);
    setIsDarkMode(false);
    toast.success('Reset to demo mode!');
  };

  const shareAchievement = (achievement) => {
    if (navigator.share) {
      navigator.share({
        title: `Achievement: ${achievement.name}`,
        text: `I earned the ${achievement.name} achievement on Monify! ${achievement.description}`,
        url: window.location.href,
      }).catch(error => console.error('Error sharing:', error));
    } else {
      toast.info('Sharing not supported on this device. Copy the URL to share!');
    }
  };

  const moneyTips = [
    "Cook meals at home instead of eating out to save around ₹50-100 per month",
    "Use student discounts whenever possible - always keep your student ID handy",
    "Look for free events on campus instead of paid entertainment",
    "Buy used textbooks or rent them instead of buying new",
    "Set up automatic transfers to your savings account on payday",
    "Use the 24-hour rule: wait 24 hours before making non-essential purchases over ₹30",
    "Share subscriptions with roommates (Netflix, Spotify, etc.)",
  ];

  // Chart Data
  const categoryData = categories.map(category => ({
    name: category.name,
    value: filteredTransactions
      .filter(t => t.category === category.name && !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0),
    color: category.color,
    darkColor: category.color,
  }));

  // Achievements Effect
  useEffect(() => {
    if (remainingBudget > 0 && totalSpent > 0 && !achievements.some(a => a.name === 'Budget Keeper')) {
      setAchievements(prev => [...prev, {
        id: Date.now(),
        name: 'Budget Keeper',
        description: `Stayed within ${activeBudgetPeriod} budget`,
        date: new Date().toISOString().split('T')[0],
      }]);
      toast.success('Achievement Unlocked: Budget Keeper!');
    }
    goals.forEach(goal => {
      if (goal.saved >= goal.target && !achievements.some(a => a.name === `Goal: ${goal.name}`)) {
        setAchievements(prev => [...prev, {
          id: Date.now(),
          name: `Goal: ${goal.name}`,
          description: `Reached ${goal.name} savings goal`,
          date: new Date().toISOString().split('T')[0],
        }]);
        toast.success(`Achievement Unlocked: Goal: ${goal.name}!`);
      }
    });
  }, [remainingBudget, totalSpent, goals, activeBudgetPeriod, achievements]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <header className="bg-indigo-600 dark:bg-indigo-900 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center">
            <img
              src="/po.png"
              alt="Company Logo"
              className="h-10 w-auto invert opacity-100 ml-2 mr-0.5"
            /> <span className='opacity-80'>Monify</span>
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm opacity-80">
                {activeBudgetPeriod.charAt(0).toUpperCase() + activeBudgetPeriod.slice(1)} Available Balance
              </p>
              <div className="flex items-center ">
                <Wallet className="mr-2" />
                <p className="text-xl font-bold">₹{remainingBudget.toFixed(2)}</p></div>
            </div>
            <button
              onClick={() => {
                setIsDarkMode(prev => {
                  const newMode = !prev;
                  console.log('Toggling dark mode to:', newMode);
                  return newMode;
                });
              }}
              className="bg-gray-200 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg flex items-center"
            >
              {isDarkMode ? <Sun className="mr-1 h-4 w-4" /> : <Moon className="mr-1 h-4 w-4" />}
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={async () => {
                await signOut(auth);
                toast.success('Logged out successfully!');
                setIsAuthenticated(false);
              }}
              className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-2">
        <div className="flex justify-between">
          {['dashboard', 'transactions', 'goals', 'insights'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 ${activeTab === tab ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-4">
        {activeTab === 'dashboard' && (
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
                  {remainingBudget < 0 ? 'Exceeded' : `${(remainingBudget / activeBudget * 100).toFixed(0)}% left`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Spent: ₹{totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Remaining: ₹{remainingBudget.toFixed(2)}</p>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">₹{activeBudget.toFixed(2)}</p>
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
        )}

        {activeTab === 'transactions' && (
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
                  className=" bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center add-transaction-btn"
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
        )}

        {activeTab === 'goals' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Savings Goals</h2>
              <button
                className="goals-tab bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
                onClick={() => setShowAddGoal(!showAddGoal)}
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                Add Goal
              </button>
            </div>

            {showAddGoal && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Create New Savings Goal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                      placeholder="Concert tickets, new laptop, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount (₹)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Already Saved (₹)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      value={newGoal.saved}
                      onChange={(e) => setNewGoal({ ...newGoal, saved: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg mr-2"
                    onClick={() => setShowAddGoal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    onClick={handleAddGoal}
                  >
                    Create Goal
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {goals.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No savings goals yet. Create one to start saving!</p>
                </div>
              ) : (
                goals.map(goal => {
                  const progress = (goal.saved / goal.target) * 100;
                  const remaining = goal.target - goal.saved;
                  let daysRemaining = null;
                  if (goal.deadline) {
                    const today = new Date();
                    const deadline = new Date(goal.deadline);
                    const diffTime = deadline - today;
                    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  }

                  return (
                    <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{goal.name}</h3>
                        <span className="px-2 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {progress.toFixed(0)}% Complete
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Saved: ₹{goal.saved.toFixed(2)}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Target: ₹{goal.target.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Need: ₹{remaining.toFixed(2)}</p>
                          {daysRemaining !== null && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{daysRemaining} days left</p>
                          )}
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full bg-indigo-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium px-3 py-1 border border-indigo-600 dark:border-indigo-400 rounded-lg">
                          Add Funds
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Achievements</h3>
              {achievements.map(achievement => (
                <div key={achievement.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex items-center">
                    <div className="text-yellow-500 mr-3">🏆</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{achievement.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description} • {achievement.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => shareAchievement(achievement)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                  >
                    Share
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
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
                  const forecast = getBudgetForecast(transactions, period);
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
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-2 text-center text-gray-500 dark:text-gray-400 text-sm">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <p>Monify - Helping students manage money smarter</p>
          <button
            onClick={resetToDemo}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Reset to Demo
          </button>
        </div>
      </footer>
    </div>
  );
}
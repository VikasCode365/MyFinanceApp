import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { loadState, saveState } from '../utils/storage';

import { PlusCircle, Wallet, CreditCard, Coffee, ShoppingBag, Music, AlertCircle, 
         TrendingUp, ChevronDown, ChevronUp, Home, Plane, Gift, Utensils, 
         Car, Book, Dumbbell, Film, Headphones, Moon, Sun, Menu, X } from 'lucide-react';

const DashboardTab = lazy(() => import('../components/DashboardTab'));
const TransactionsTab = lazy(() => import('../components/TransactionsTab'));
const GoalsTab = lazy(() => import('../components/GoalsTab'));
const InsightsTab = lazy(() => import('../components/InsightsTab'));

export default function FinanceApp({ setIsAuthenticated }) {
  // Define icon components for reference
  const iconComponents = {
    Coffee,
    ShoppingBag,
    Music,
    CreditCard,
    Home,
    Plane,
    Gift,
    Utensils,
    Car, 
    Book,
    Dumbbell,
    Film,
    Headphones,
    AlertCircle
  };

  // Initial sample data with direct icon references
  const initialCategories = [
    { id: 1, name: 'Food', icon: <Coffee className="text-orange-500" />, color: '#f97316', iconName: 'Coffee' },
    { id: 2, name: 'Shopping', icon: <ShoppingBag className="text-blue-500" />, color: '#3b82f6', iconName: 'ShoppingBag' },
    { id: 3, name: 'Entertainment', icon: <Music className="text-purple-500" />, color: '#a855f7', iconName: 'Music' },
    { id: 4, name: 'Bills', icon: <CreditCard className="text-red-500" />, color: '#ef4444', iconName: 'CreditCard' },
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

  // Define available icons for selection in the UI
  const availableIcons = [
    { name: "Coffee", component: Coffee },
    { name: "ShoppingBag", component: ShoppingBag },
    { name: "Music", component: Music },
    { name: "CreditCard", component: CreditCard },
    { name: "Home", component: Home },
    { name: "Plane", component: Plane },
    { name: "Gift", component: Gift },
    { name: "Utensils", component: Utensils },
    { name: "Car", component: Car },
    { name: "Book", component: Book },
    { name: "Dumbbell", component: Dumbbell },
    { name: "Film", component: Film },
    { name: "Headphones", component: Headphones }
  ];

  // Color mapping function
  const getColorClass = (colorHex) => {
    const colorMap = {
      '#f97316': 'orange-500',
      '#3b82f6': 'blue-500',
      '#a855f7': 'purple-500',
      '#ef4444': 'red-500',
      '#10b981': 'emerald-500',
      '#f59e0b': 'amber-500',
      '#ec4899': 'pink-500',
      '#14b8a6': 'teal-500',
    };
    return colorMap[colorHex] || 'gray-500';
  };

  // States
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = loadState('darkMode', false);
    document.documentElement.classList.toggle('dark', saved);
    return saved;
  });
  const [transactions, setTransactions] = useState(loadState('transactions', initialTransactions));
  const [categories, setCategories] = useState(() => {
    // Initialize categories and ensure each has an iconName property
    const savedCategories = loadState('categories', initialCategories);
    
    // If loading saved categories that don't have iconName, add it
    return savedCategories.map(category => {
      if (!category.iconName) {
        // Try to determine iconName from existing categories or default to Coffee
        let iconName = 'Coffee';
        for (const initialCat of initialCategories) {
          if (initialCat.name === category.name) {
            iconName = initialCat.iconName;
            break;
          }
        }
        return { ...category, iconName };
      }
      return category;
    });
  });
  
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerExpanded, setHeaderExpanded] = useState(false);

  // Dark Mode Effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    saveState('darkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.removeItem('darkMode');
    const saved = loadState('darkMode', false);
    setIsDarkMode(saved);
    document.documentElement.classList.toggle('dark', saved);
  }, []);

  // Function to refresh icon components in categories
  // This is necessary because the icons don't serialize properly in localStorage
  const refreshCategoryIcons = useCallback(() => {
    return categories.map(category => {
      const IconComponent = iconComponents[category.iconName] || Coffee;
      const colorClass = getColorClass(category.color);
      return {
        ...category,
        icon: <IconComponent className={`text-${colorClass}`} />
      };
    });
  }, [categories]);

  // Apply the refreshed icons whenever the component renders or categories change
  useEffect(() => {
    const refreshedCategories = refreshCategoryIcons();
    if (JSON.stringify(refreshedCategories.map(c => c.id)) !== JSON.stringify(categories.map(c => c.id))) {
      setCategories(refreshedCategories);
    }
  }, [refreshCategoryIcons, categories]);

  // Persist States
  useEffect(() => saveState('transactions', transactions), [transactions]);
  useEffect(() => {
    // Save categories without the icon property to avoid serialization issues
    const categoriesToSave = categories.map(({ icon, ...rest }) => rest);
    saveState('categories', categoriesToSave);
  }, [categories]);
  useEffect(() => saveState('goals', goals), [goals]);
  useEffect(() => saveState('balance', balance), [balance]);
  useEffect(() => saveState('budgets', budgets), [budgets]);
  useEffect(() => saveState('categoryBudgets', categoryBudgets), [categoryBudgets]);
  useEffect(() => saveState('achievements', achievements), [achievements]);

  // Close mobile menu when tab changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeTab]);

  // Memoized Helper Functions
  const getFilteredTransactions = useCallback((period) => {
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
  }, [transactions]);

  const filteredTransactions = useMemo(() => getFilteredTransactions(activeBudgetPeriod), [getFilteredTransactions, activeBudgetPeriod]);
  const totalSpent = useMemo(() => filteredTransactions.reduce((sum, t) => sum + (t.isIncome ? 0 : t.amount), 0), [filteredTransactions]);
  const activeBudget = useMemo(() => budgets[activeBudgetPeriod], [budgets, activeBudgetPeriod]);
  const remainingBudget = useMemo(() => activeBudget - totalSpent, [activeBudget, totalSpent]);
  const percentSpent = useMemo(() => (totalSpent / activeBudget) * 100, [totalSpent, activeBudget]);
  const categoryData = useMemo(() => categories.map(category => ({
    name: category.name,
    value: filteredTransactions
      .filter(t => t.category === category.name && !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0),
    color: category.color,
    darkColor: category.color,
  })), [categories, filteredTransactions]);

  const getSpendingTrends = useCallback(() => {
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
  }, [transactions, activeBudgetPeriod]);

  const getAIInsights = useCallback(() => {
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
  }, [transactions, categories, filteredTransactions, categoryBudgets, activeBudgetPeriod]);

  const getInsights = useCallback(() => {
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
  }, [filteredTransactions, remainingBudget, activeBudgetPeriod, activeBudget, categories, categoryBudgets, goals]);

  // Helpers to get category icon for transaction display
  const getCategoryIcon = useCallback((categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.icon : <Coffee className="text-gray-500" />;
  }, [categories]);

  // Handlers
  const handleAddTransaction = useCallback(() => {
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

    setTransactions(prev => [transaction, ...prev]);
    setBalance(prev => prev + (transaction.isIncome ? transaction.amount : -transaction.amount));
    setNewTransaction({ amount: '', category: 'Food', description: '', date: '', isIncome: false });
    setShowAddTransaction(false);
    toast.success(`${transaction.isIncome ? 'Income' : 'Expense'} added successfully!`);
  }, [newTransaction, transactions, setTransactions, setBalance]);

  const handleDeleteTransaction = useCallback((id) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (transactionToDelete) {
      setBalance(prev => prev + (transactionToDelete.isIncome ? -transactionToDelete.amount : transactionToDelete.amount));
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transaction deleted!');
    }
  }, [transactions, setTransactions, setBalance]);

  const handleAddGoal = useCallback(() => {
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

    setGoals(prev => [...prev, goal]);
    setNewGoal({ name: '', target: '', saved: '', deadline: '' });
    setShowAddGoal(false);
    toast.success('Goal created successfully!');
  }, [newGoal, goals, setGoals]);

  const handleAddCategory = useCallback(() => {
    if (!newCategory.name) {
      toast.error('Please enter a category name');
      return;
    }

    // Find the icon component
    const IconComponent = iconComponents[newCategory.icon] || Coffee;
    const colorClass = getColorClass(newCategory.color);
    
    // Create new category with icon and iconName
    const category = {
      id: categories.length + 1,
      name: newCategory.name,
      icon: <IconComponent className={`text-${colorClass}`} />,
      color: newCategory.color,
      iconName: newCategory.icon || 'Coffee',
    };

    setCategories(prev => [...prev, category]);
    setCategoryBudgets(prev => ({
      ...prev,
      weekly: { ...prev.weekly, [category.name]: 0 },
      monthly: { ...prev.monthly, [category.name]: 0 },
      yearly: { ...prev.yearly, [category.name]: 0 },
    }));
    setIsAddingCategory(false);
    setNewCategory({ name: '', color: '#10b981', icon: 'Coffee' });
    setNewTransaction(prev => ({ ...prev, category: category.name }));
    toast.success('Category added!');
  }, [newCategory, categories, setCategories, setCategoryBudgets, iconComponents]);

  const handleSaveBudgets = useCallback(() => {
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
  }, [editBudgets, setBudgets]);

  const resetToDemo = useCallback(() => {
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
  }, [setTransactions, setCategories, setGoals, setBalance, setBudgets, setCategoryBudgets, setAchievements, setIsDarkMode, initialTransactions, initialCategories, initialGoals]);

  // Toggle header expanded state on mobile
  const toggleHeaderExpanded = () => {
    setHeaderExpanded(prev => !prev);
  };

  // Render
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      {/* Mobile header */}
      <header className="bg-indigo-600 dark:bg-indigo-900 text-white p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-xl font-bold flex items-center">
              <img
                src="/po.png"
                alt="Company Logo"
                className="h-8 w-auto invert opacity-100 mr-2"
              /> 
              <span className='opacity-80'>Monify</span>
            </h1>
            
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={toggleHeaderExpanded}
                className="p-1 rounded-full hover:bg-indigo-700"
              >
                {headerExpanded ? <ChevronUp /> : <ChevronDown />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 rounded-full hover:bg-indigo-700"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
            
            <div className="hidden md:flex md:items-center md:space-x-4">
              <div className="text-right">
                <p className="text-sm opacity-80">
                  {activeBudgetPeriod.charAt(0).toUpperCase() + activeBudgetPeriod.slice(1)} Available Balance
                </p>
                <div className="flex items-center">
                  <Wallet className="mr-2" />
                  <p className="text-xl font-bold">₹{remainingBudget.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDarkMode(prev => !prev)}
                className="bg-gray-200 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg flex items-center"
              >
                {isDarkMode ? <Sun className="mr-1 h-4 w-4" /> : <Moon className="mr-1 h-4 w-4" />}
                <span className="hidden md:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
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
          
          {/* Mobile expanded header content */}
          {headerExpanded && (
            <div className="mt-4 flex flex-col space-y-4 md:hidden">
              <div className="text-center">
                <p className="text-sm opacity-80">
                  {activeBudgetPeriod.charAt(0).toUpperCase() + activeBudgetPeriod.slice(1)} Available Balance
                </p>
                <div className="flex items-center justify-center">
                  <Wallet className="mr-2" />
                  <p className="text-xl font-bold">₹{remainingBudget.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setIsDarkMode(prev => !prev)}
                  className="bg-gray-200 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 px-3 py-2 rounded-lg flex items-center"
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
                  className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-3 py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="flex flex-col">
            {['dashboard', 'transactions', 'goals', 'insights'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-3 text-left ${
                  activeTab === tab 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700 font-medium' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop navigation */}
      <nav className="hidden md:block bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-2">
        <div className="flex justify-between max-w-4xl mx-auto">
          {['dashboard', 'transactions', 'goals', 'insights'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 ${activeTab === tab ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab(tab)}
              
              
            >{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
           
          ))}
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-2 sm:p-4">
        <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
          {activeTab === 'dashboard' && (
            <DashboardTab
              activeBudgetPeriod={activeBudgetPeriod}
              setActiveBudgetPeriod={setActiveBudgetPeriod}
              budgets={budgets}
              filteredTransactions={filteredTransactions}
              totalSpent={totalSpent}
              remainingBudget={remainingBudget}
              percentSpent={percentSpent}
              categoryData={categoryData}
              getSpendingTrends={getSpendingTrends}
              categories={categories}
              categoryBudgets={categoryBudgets}
              setCategoryBudgets={setCategoryBudgets}
              showEditBudgets={showEditBudgets}
              setShowEditBudgets={setShowEditBudgets}
              editBudgets={editBudgets}
              setEditBudgets={setEditBudgets}
              handleSaveBudgets={handleSaveBudgets}
              isDarkMode={isDarkMode}
              setActiveTab={setActiveTab}
              getCategoryIcon={getCategoryIcon}
            />
          )}
          {activeTab === 'transactions' && (
            <TransactionsTab
              activeBudgetPeriod={activeBudgetPeriod}
              setActiveBudgetPeriod={setActiveBudgetPeriod}
              filteredTransactions={filteredTransactions}
              categories={categories}
              newTransaction={newTransaction}
              setNewTransaction={setNewTransaction}
              showAddTransaction={showAddTransaction}
              setShowAddTransaction={setShowAddTransaction}
              isAddingCategory={isAddingCategory}
              setIsAddingCategory={setIsAddingCategory}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              handleAddTransaction={handleAddTransaction}
              handleDeleteTransaction={handleDeleteTransaction}
              handleAddCategory={handleAddCategory}
              isDarkMode={isDarkMode}
              availableIcons={availableIcons}
              getCategoryIcon={getCategoryIcon}
              iconComponents={iconComponents}
            />
          )}
          {activeTab === 'goals' && (
            <GoalsTab
              goals={goals}
              newGoal={newGoal}
              setNewGoal={setNewGoal}
              showAddGoal={showAddGoal}
              setShowAddGoal={setShowAddGoal}
              handleAddGoal={handleAddGoal}
              achievements={achievements}
              isDarkMode={isDarkMode}
            />
          )}
          {activeTab === 'insights' && (
            <InsightsTab
              activeBudgetPeriod={activeBudgetPeriod}
              categoryData={categoryData}
              getInsights={getInsights}
              getAIInsights={getAIInsights}
              showTips={showTips}
              setShowTips={setShowTips}
              isDarkMode={isDarkMode}
              filteredTransactions={filteredTransactions}
              getCategoryIcon={getCategoryIcon}
            />
          )}
        </Suspense>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-2 text-center text-gray-500 dark:text-gray-400 text-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-4xl mx-auto">
          <p className="mb-2 sm:mb-0">Monify - Money made simplify</p>
          <p className="mb-2 sm:mb-0  sm:block">Made with ❤ by Vikas</p> 
          <button
            onClick={resetToDemo}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Reset to Demo
          </button>
        </div>
      </footer>

      {/* Floating Action Button for mobile devices */}
      <div className="md:hidden fixed bottom-6 right-6">
        {activeTab === 'transactions' && (
          <button
            onClick={() => setShowAddTransaction(true)}
            className="bg-indigo-600 text-white p-3 rounded-full shadow-lg"
          >
            <PlusCircle className="h-6 w-6" />
          </button>
        )}
        {activeTab === 'goals' && (
          <button
            onClick={() => setShowAddGoal(true)}
            className="bg-indigo-600 text-white p-3 rounded-full shadow-lg"
          >
            <PlusCircle className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}
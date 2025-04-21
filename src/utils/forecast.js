export const getBudgetForecast = (transactions, period) => {
    const now = new Date();
    const startOfPeriod = period === 'weekly'
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      : period === 'monthly'
        ? new Date(now.getFullYear(), now.getMonth(), 1)
        : new Date(now.getFullYear(), 0, 1);
  
    const periodTransactions = transactions.filter(t => new Date(t.date) >= startOfPeriod && !t.isIncome);
    const totalSpent = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
    const daysInPeriod = period === 'weekly' ? 7 : period === 'monthly' ? 30 : 365;
    const daysPassed = Math.ceil((now - startOfPeriod) / (1000 * 60 * 60 * 24)) || 1;
    const avgDailySpending = totalSpent / daysPassed;
    const projectedSpending = avgDailySpending * daysInPeriod;
  
    return {
      avgDailySpending: avgDailySpending.toFixed(2),
      projectedSpending: projectedSpending.toFixed(2),
      period
    };
  };
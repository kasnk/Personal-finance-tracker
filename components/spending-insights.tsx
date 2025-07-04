"use client";

import { useMemo } from 'react';
import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar, DollarSign } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek } from 'date-fns';

interface SpendingInsightsProps {
  transactions: Transaction[];
}

export function SpendingInsights({ transactions }: SpendingInsightsProps) {
  const insights = useMemo(() => {
    const now = new Date();
    const currentMonth = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonth = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));
    const currentWeek = startOfWeek(now);
    const currentWeekEnd = endOfWeek(now);

    // Current month expenses
    const currentMonthExpenses = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && date >= currentMonth && date <= currentMonthEnd;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Last month expenses
    const lastMonthExpenses = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && date >= lastMonth && date <= lastMonthEnd;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Current week expenses
    const currentWeekExpenses = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && date >= currentWeek && date <= currentWeekEnd;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Category analysis
    const categoryExpenses = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && date >= currentMonth && date <= currentMonthEnd;
      })
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryExpenses)
      .sort(([,a], [,b]) => b - a)[0];

    // Average daily spending this month
    const daysInMonth = now.getDate();
    const avgDailySpending = currentMonthExpenses / daysInMonth;

    // Month-over-month change
    const monthOverMonthChange = lastMonthExpenses > 0 
      ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : 0;

    // Recent transaction analysis
    const recentTransactions = transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    const largestExpense = recentTransactions[0];

    return {
      currentMonthExpenses,
      lastMonthExpenses,
      currentWeekExpenses,
      monthOverMonthChange,
      avgDailySpending,
      topCategory,
      largestExpense,
      daysInMonth,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-emerald-500" />;
    return <Target className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 10) return 'text-red-600';
    if (change < -10) return 'text-emerald-600';
    return 'text-gray-600';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-blue-600" />
          <span>Spending Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">This Month</span>
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(insights.currentMonthExpenses)}
            </div>
            <div className="flex items-center space-x-1 mt-1">
              {getChangeIcon(insights.monthOverMonthChange)}
              <span className={`text-sm ${getChangeColor(insights.monthOverMonthChange)}`}>
                {Math.abs(insights.monthOverMonthChange).toFixed(1)}% vs last month
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">This Week</span>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(insights.currentWeekExpenses)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Daily avg: {formatCurrency(insights.avgDailySpending)}
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Key Insights</h4>
          
          {insights.topCategory && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Top spending category this month</span>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {insights.topCategory[0]}
                </Badge>
                <div className="text-sm font-medium text-blue-700 mt-1">
                  {formatCurrency(insights.topCategory[1])}
                </div>
              </div>
            </div>
          )}

          {insights.monthOverMonthChange > 20 && (
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">
                  Spending increased significantly this month
                </span>
              </div>
              <Badge variant="destructive">
                +{insights.monthOverMonthChange.toFixed(1)}%
              </Badge>
            </div>
          )}

          {insights.monthOverMonthChange < -20 && (
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingDown className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-emerald-700">
                  Great job reducing spending this month!
                </span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">
                {insights.monthOverMonthChange.toFixed(1)}%
              </Badge>
            </div>
          )}

          {insights.largestExpense && (
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div>
                  <span className="text-sm">Largest recent expense</span>
                  <div className="text-xs text-gray-600">
                    {insights.largestExpense.description} • {insights.largestExpense.category}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-amber-700">
                  {formatCurrency(insights.largestExpense.amount)}
                </div>
                <div className="text-xs text-gray-600">
                  {format(new Date(insights.largestExpense.date), 'MMM dd')}
                </div>
              </div>
            </div>
          )}

          {insights.avgDailySpending > 100 && (
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-purple-700">
                  High daily spending rate this month
                </span>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {formatCurrency(insights.avgDailySpending)}/day
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import { useMemo } from 'react';
import { Transaction, Budget } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface BudgetVsActualChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function BudgetVsActualChart({ transactions, budgets }: BudgetVsActualChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const currentMonth = format(now, 'yyyy-MM');
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    // Get current month budgets
    const currentBudgets = budgets.filter(budget => budget.month === currentMonth);
    
    // Calculate actual expenses by category for current month
    const actualExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'expense' && 
               transactionDate >= monthStart && 
               transactionDate <= monthEnd;
      })
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    // Combine budget and actual data
    const categories = new Set([
      ...currentBudgets.map(b => b.category),
      ...Object.keys(actualExpenses)
    ]);

    return Array.from(categories).map(category => {
      const budget = currentBudgets.find(b => b.category === category);
      const actual = actualExpenses[category] || 0;
      const budgetAmount = budget?.amount || 0;
      
      return {
        category,
        budget: budgetAmount,
        actual,
        difference: budgetAmount - actual,
        percentage: budgetAmount > 0 ? (actual / budgetAmount) * 100 : 0,
      };
    }).sort((a, b) => b.budget - a.budget);
  }, [transactions, budgets]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-blue-600">Budget: </span>
              {formatCurrency(data.budget)}
            </p>
            <p className="text-sm">
              <span className="text-red-600">Actual: </span>
              {formatCurrency(data.actual)}
            </p>
            <p className="text-sm">
              <span className={data.difference >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                {data.difference >= 0 ? 'Under budget: ' : 'Over budget: '}
              </span>
              {formatCurrency(Math.abs(data.difference))}
            </p>
            <p className="text-sm text-gray-600">
              {data.percentage.toFixed(1)}% of budget used
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-gray-500">
            No budgets set for this month
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Budget vs Actual</span>
          <span className="text-sm font-normal text-gray-500">
            {format(new Date(), 'MMMM yyyy')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="budget" 
                fill="#3B82F6"
                name="Budget"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="actual" 
                fill="#EF4444"
                name="Actual"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
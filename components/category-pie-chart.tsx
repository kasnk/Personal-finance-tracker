"use client";

import { useMemo } from 'react';
import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface CategoryPieChartProps {
  transactions: Transaction[];
  type: 'income' | 'expense';
}

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export function CategoryPieChart({ transactions, type }: CategoryPieChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === type && 
             transactionDate >= monthStart && 
             transactionDate <= monthEnd;
    });

    const categoryTotals = currentMonthTransactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: 0 // Will be calculated after sorting
      }))
      .sort((a, b) => b.amount - a.amount)
      .map((item, index, array) => {
        const total = array.reduce((sum, i) => sum + i.amount, 0);
        return {
          ...item,
          percentage: total > 0 ? (item.amount / total) * 100 : 0
        };
      });
  }, [transactions, type]);

  const total = chartData.reduce((sum, item) => sum + item.amount, 0);
  const currentMonth = format(new Date(), 'MMMM yyyy');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.category}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.amount)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{type === 'income' ? 'Income' : 'Expense'} Categories</span>
            <span className="text-sm font-normal text-gray-500">{currentMonth}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-gray-500">
            No {type} transactions this month
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{type === 'income' ? 'Income' : 'Expense'} Categories</span>
          <div className="text-right">
            <div className="text-sm font-normal text-gray-500">{currentMonth}</div>
            <div className="text-sm font-medium">{formatCurrency(total)}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="amount"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color }}>
                    {value} ({entry.payload.percentage.toFixed(1)}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import { useMemo } from 'react';
import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    
    // Generate last 6 months
    const months = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(now),
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthExpenses = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return t.type === 'expense' && 
                 transactionDate >= monthStart && 
                 transactionDate <= monthEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: format(month, 'MMM yyyy'),
        expenses: monthExpenses,
      };
    });
  }, [transactions]);

  const totalExpenses = chartData.reduce((sum, data) => sum + data.expenses, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Monthly Expenses</span>
          <span className="text-sm font-normal text-gray-500">
            Total: {formatCurrency(totalExpenses)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Expenses']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="expenses" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
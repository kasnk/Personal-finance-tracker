"use client";

import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface RecentTransactionsProps {
  transactions: Transaction[];
  limit?: number;
}

export function RecentTransactions({ transactions, limit = 5 }: RecentTransactionsProps) {
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryColor = (category: string, type: 'income' | 'expense') => {
    if (type === 'income') return 'bg-emerald-100 text-emerald-800';
    
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-cyan-100 text-cyan-800',
      'bg-teal-100 text-teal-800',
      'bg-orange-100 text-orange-800',
      'bg-amber-100 text-amber-800',
    ];
    
    const index = category.length % colors.length;
    return colors[index];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No transactions yet
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge 
                      variant="secondary"
                      className={getCategoryColor(transaction.category, transaction.type)}
                    >
                      {transaction.category}
                    </Badge>
                  </div>
                  <div className="font-medium text-gray-900 truncate">
                    {transaction.description}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
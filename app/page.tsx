"use client";

import { useState } from 'react';
import { useTransactions } from '@/hooks/use-transactions';
import { useBudgets } from '@/hooks/use-budgets';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionList } from '@/components/transaction-list';
import { MonthlyExpensesChart } from '@/components/monthly-expenses-chart';
import { CategoryPieChart } from '@/components/category-pie-chart';
import { BudgetForm } from '@/components/budget-form';
import { BudgetVsActualChart } from '@/components/budget-vs-actual-chart';
import { SpendingInsights } from '@/components/spending-insights';
import { RecentTransactions } from '@/components/recent-transactions';
import { SummaryCards } from '@/components/summary-cards';
import { Transaction, Budget } from '@/types/transaction';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, PiggyBank, Target, BarChart3, TrendingUp } from 'lucide-react';

export default function Home() {
  const { transactions, isLoading: transactionsLoading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { budgets, isLoading: budgetsLoading, addBudget, updateBudget, deleteBudget } = useBudgets();
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);

  const handleAddTransaction = (data: any) => {
    addTransaction(data);
    setIsAddTransactionModalOpen(false);
  };

  const handleUpdateTransaction = (data: any) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleAddBudget = (data: any) => {
    addBudget(data);
    setIsAddBudgetModalOpen(false);
  };

  const handleUpdateBudget = (data: any) => {
    if (editingBudget) {
      updateBudget(editingBudget.id, data);
      setEditingBudget(null);
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
  };

  const handleDeleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
    }
  };

  if (transactionsLoading || budgetsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your finances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PiggyBank className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Personal Finance Tracker</h1>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setIsAddBudgetModalOpen(true)} variant="outline" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Set Budget</span>
              </Button>
              <Button onClick={() => setIsAddTransactionModalOpen(true)} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Transaction</span>
              </Button>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Track your income, expenses, and budgets with comprehensive insights</p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8">
          <SummaryCards transactions={transactions} />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="budgets" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Budgets</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyExpensesChart transactions={transactions} />
              <CategoryPieChart transactions={transactions} type="expense" />
            </div>

            {/* Budget vs Actual */}
            <BudgetVsActualChart transactions={transactions} budgets={budgets} />

            {/* Recent Transactions */}
            <RecentTransactions transactions={transactions} limit={8} />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionList 
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            {/* Budget List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget) => (
                <div key={budget.id} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{budget.category}</h3>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditBudget(budget)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Target className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    ${budget.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(budget.month + '-01').toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </div>
                </div>
              ))}
              
              {budgets.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No budgets set yet. Click "Set Budget" to get started.</p>
                </div>
              )}
            </div>

            {/* Budget Charts */}
            {budgets.length > 0 && (
              <div className="space-y-6">
                <BudgetVsActualChart transactions={transactions} budgets={budgets} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingInsights transactions={transactions} />
              <CategoryPieChart transactions={transactions} type="income" />
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Transaction Modal */}
        <Dialog open={isAddTransactionModalOpen} onOpenChange={setIsAddTransactionModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm 
              onSubmit={handleAddTransaction}
              onCancel={() => setIsAddTransactionModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Transaction Modal */}
        <Dialog open={!!editingTransaction} onOpenChange={(open) => !open && setEditingTransaction(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            {editingTransaction && (
              <TransactionForm 
                onSubmit={handleUpdateTransaction}
                initialData={editingTransaction}
                onCancel={() => setEditingTransaction(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Add Budget Modal */}
        <Dialog open={isAddBudgetModalOpen} onOpenChange={setIsAddBudgetModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Set Monthly Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm 
              onSubmit={handleAddBudget}
              onCancel={() => setIsAddBudgetModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Budget Modal */}
        <Dialog open={!!editingBudget} onOpenChange={(open) => !open && setEditingBudget(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Budget</DialogTitle>
            </DialogHeader>
            {editingBudget && (
              <BudgetForm 
                onSubmit={handleUpdateBudget}
                initialData={editingBudget}
                onCancel={() => setEditingBudget(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { Transaction, TransactionFormData } from '@/types/transaction';

const STORAGE_KEY = 'personal-finance-transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load transactions from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migrate old transactions without category
        const migratedTransactions = parsed.map((t: any) => ({
          ...t,
          category: t.category || (t.type === 'income' ? 'Other' : 'Other')
        }));
        setTransactions(migratedTransactions);
      } catch (error) {
        console.error('Error parsing stored transactions:', error);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save transactions to localStorage whenever transactions change
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  const addTransaction = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: parseFloat(data.amount),
      date: data.date,
      description: data.description,
      type: data.type,
      category: data.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateTransaction = (id: string, data: TransactionFormData) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id
          ? {
              ...transaction,
              amount: parseFloat(data.amount),
              date: data.date,
              description: data.description,
              type: data.type,
              category: data.category,
              updatedAt: new Date().toISOString(),
            }
          : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
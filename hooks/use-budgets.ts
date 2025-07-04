"use client";

import { useState, useEffect } from 'react';
import { Budget, BudgetFormData } from '@/types/transaction';

const STORAGE_KEY = 'personal-finance-budgets';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load budgets from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBudgets(parsed);
      } catch (error) {
        console.error('Error parsing stored budgets:', error);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save budgets to localStorage whenever budgets change
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
    }
  }, [budgets, isLoading]);

  const addBudget = (data: BudgetFormData) => {
    const newBudget: Budget = {
      id: crypto.randomUUID(),
      category: data.category,
      amount: parseFloat(data.amount),
      month: data.month,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBudgets(prev => [newBudget, ...prev]);
    return newBudget;
  };

  const updateBudget = (id: string, data: BudgetFormData) => {
    setBudgets(prev => 
      prev.map(budget => 
        budget.id === id
          ? {
              ...budget,
              category: data.category,
              amount: parseFloat(data.amount),
              month: data.month,
              updatedAt: new Date().toISOString(),
            }
          : budget
      )
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };

  const getBudgetForCategoryAndMonth = (category: string, month: string) => {
    return budgets.find(budget => budget.category === category && budget.month === month);
  };

  return {
    budgets,
    isLoading,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetForCategoryAndMonth,
  };
}
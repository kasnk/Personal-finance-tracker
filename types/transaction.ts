export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  amount: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string; // YYYY-MM format
  createdAt: string;
  updatedAt: string;
}

export interface BudgetFormData {
  category: string;
  amount: string;
  month: string;
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Home & Garden',
  'Personal Care',
  'Insurance',
  'Investments',
  'Other'
] as const;

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Rental',
  'Gifts',
  'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
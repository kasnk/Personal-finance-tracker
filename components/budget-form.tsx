"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BudgetFormData, Budget, EXPENSE_CATEGORIES } from '@/types/transaction';
import { format } from 'date-fns';

interface BudgetFormProps {
  onSubmit: (data: BudgetFormData) => void;
  initialData?: Budget;
  onCancel?: () => void;
}

export function BudgetForm({ onSubmit, initialData, onCancel }: BudgetFormProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    category: initialData?.category || '',
    amount: initialData?.amount.toString() || '',
    month: initialData?.month || format(new Date(), 'yyyy-MM'),
  });

  const [errors, setErrors] = useState<Partial<BudgetFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<BudgetFormData> = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      if (!initialData) {
        // Reset form only if adding new budget
        setFormData({
          category: '',
          amount: '',
          month: format(new Date(), 'yyyy-MM'),
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {initialData ? 'Edit Budget' : 'Set Monthly Budget'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Budget Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              type="month"
              value={formData.month}
              onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
              className={errors.month ? 'border-red-500' : ''}
            />
            {errors.month && <p className="text-sm text-red-500">{errors.month}</p>}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? 'Update Budget' : 'Set Budget'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
import { BudgetInput, BudgetCalculationResult } from '../types/tourism';

/**
 * Budget Calculation Engine
 * Replicates the business logic of Java BudgetCalculatorService.java
 */
export function calculateBudget(
  input: BudgetInput,
  additionalEntryFees: number = 0
): BudgetCalculationResult {
  const travelers = Math.max(1, input.travelers || 1);
  const days = Math.max(1, input.days || 1);

  const transport = Math.max(0, Number(input.transportationBudget) || 0);
  const accommodation = Math.max(0, Number(input.accommodationBudget) || 0);
  const food = Math.max(0, Number(input.foodBudget) || 0);
  const shopping = Math.max(0, Number(input.shoppingBudget) || 0);
  const other = Math.max(0, Number(input.otherExpenses) || 0);
  const totalBudget = Math.max(0, Number(input.totalBudget) || 0);
  const entryFees = Math.max(0, Number(additionalEntryFees) || 0);

  // Total Estimated Cost
  const totalEstimatedCost = transport + accommodation + food + shopping + other + entryFees;

  // Remaining Budget
  const remainingBudget = totalBudget - totalEstimatedCost;

  // Per Person Cost
  const perPersonCost = totalEstimatedCost / travelers;

  // Daily Spending Limit based on total user budget
  const dailySpendingLimit = totalBudget / days;

  // Over-budget detection
  const isOverBudget = totalEstimatedCost > totalBudget;
  const overBudgetAmount = isOverBudget ? totalEstimatedCost - totalBudget : 0;
  const percentageUsed = totalBudget > 0 ? (totalEstimatedCost / totalBudget) * 100 : 0;

  // Category Breakdown
  const breakdown = [
    {
      category: 'Accommodation',
      amount: accommodation,
      percentage: totalEstimatedCost > 0 ? (accommodation / totalEstimatedCost) * 100 : 0,
      color: '#0284c7' // sky-600
    },
    {
      category: 'Transportation',
      amount: transport,
      percentage: totalEstimatedCost > 0 ? (transport / totalEstimatedCost) * 100 : 0,
      color: '#0d9488' // teal-600
    },
    {
      category: 'Food & Dining',
      amount: food,
      percentage: totalEstimatedCost > 0 ? (food / totalEstimatedCost) * 100 : 0,
      color: '#f59e0b' // amber-500
    },
    {
      category: 'Entry Fees',
      amount: entryFees,
      percentage: totalEstimatedCost > 0 ? (entryFees / totalEstimatedCost) * 100 : 0,
      color: '#8b5cf6' // violet-500
    },
    {
      category: 'Shopping',
      amount: shopping,
      percentage: totalEstimatedCost > 0 ? (shopping / totalEstimatedCost) * 100 : 0,
      color: '#ec4899' // pink-500
    },
    {
      category: 'Other Expenses',
      amount: other,
      percentage: totalEstimatedCost > 0 ? (other / totalEstimatedCost) * 100 : 0,
      color: '#64748b' // slate-500
    }
  ];

  return {
    totalEstimatedCost: Math.round(totalEstimatedCost * 100) / 100,
    remainingBudget: Math.round(remainingBudget * 100) / 100,
    perPersonCost: Math.round(perPersonCost * 100) / 100,
    dailySpendingLimit: Math.round(dailySpendingLimit * 100) / 100,
    isOverBudget,
    overBudgetAmount: Math.round(overBudgetAmount * 100) / 100,
    percentageUsed: Math.round(percentageUsed * 10) / 10,
    breakdown
  };
}

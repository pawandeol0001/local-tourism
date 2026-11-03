import React, { useState } from 'react';
import { DollarSign, PlusCircle, Trash2, Tag, Calendar, AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { ActualExpense } from '../types/tourism';

interface ExpenseTrackerProps {
  plannedBudget?: number;
  initialExpenses?: ActualExpense[];
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  plannedBudget = 600,
  initialExpenses = [
    {
      id: 'EXP-1',
      title: 'Airport Express Taxi',
      category: 'Transportation',
      amount: 45,
      date: new Date().toISOString().split('T')[0],
      notes: 'Arrival transfer to heritage hotel'
    },
    {
      id: 'EXP-2',
      title: 'Amber Citadel Entry Tickets',
      category: 'Entry Fees',
      amount: 30,
      date: new Date().toISOString().split('T')[0],
      notes: '2 adult foreign tourist entries'
    },
    {
      id: 'EXP-3',
      title: 'Royal Courtyard Saffron Thali Dinner',
      category: 'Food',
      amount: 65,
      date: new Date().toISOString().split('T')[0],
      notes: 'Evening dinner with live sitar music'
    }
  ]
}) => {
  const [expenses, setExpenses] = useState<ActualExpense[]>(initialExpenses);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActualExpense['category']>('Food');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingActualBudget = plannedBudget - totalSpent;
  const percentageUsed = plannedBudget > 0 ? (totalSpent / plannedBudget) * 100 : 0;
  const isOverBudget = totalSpent > plannedBudget;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    const newExpense: ActualExpense = {
      id: `EXP-${Date.now()}`,
      title: title.trim(),
      category,
      amount: Number(amount),
      date,
      notes: notes.trim() || undefined
    };

    setExpenses([newExpense, ...expenses]);
    setTitle('');
    setAmount('');
    setNotes('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const filteredExpenses = expenses.filter((e) =>
    selectedFilterCategory === 'all' ? true : e.category === selectedFilterCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
          Real-Time Expense Accounting
        </div>
        <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
          Trip Expense Tracker
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Log actual travel receipts, verify expenditures against your estimated plan, and avoid overspending.
        </p>
      </div>

      {/* KPI Comparison Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">Planned Budget</span>
          <span className="text-2xl font-bold font-mono text-slate-900">
            ${plannedBudget.toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Target trip allocation</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">Total Actual Spent</span>
          <span className="text-2xl font-bold font-mono text-slate-900">
            ${totalSpent.toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">{expenses.length} receipts logged</span>
        </div>

        <div
          className={`p-4 rounded-xl border shadow-xs ${
            isOverBudget ? 'bg-red-50 border-red-200 text-red-950' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium opacity-80">
              {isOverBudget ? 'Budget Deficit' : 'Remaining Balance'}
            </span>
            {isOverBudget ? (
              <TrendingUp className="w-4 h-4 text-red-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <span className="text-2xl font-bold font-mono">
            ${Math.abs(remainingActualBudget).toFixed(2)}
          </span>
          <span className="text-[11px] opacity-75 block mt-1">
            {isOverBudget ? 'Exceeded planned limit' : 'Under control'}
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">Budget Consumption</span>
          <span className="text-2xl font-bold font-mono text-slate-900">
            {percentageUsed.toFixed(1)}%
          </span>
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-2">
            <div
              style={{ width: `${Math.min(100, percentageUsed)}%` }}
              className={`h-full ${isOverBudget ? 'bg-red-600' : 'bg-emerald-600'}`}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Add Expense Form & Transaction History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Add Receipt Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            Log New Travel Expense
          </h3>

          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Title / Item</label>
              <input
                type="text"
                placeholder="e.g. Tuk-tuk ride to Palace, Souvenir scarves"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Transportation">Transportation</option>
                  <option value="Food">Food</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Entry Fees">Entry Fees</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs font-semibold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes (Optional)</label>
              <input
                type="text"
                placeholder="Receipt ref, payment method, or location"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
          </form>
        </div>

        {/* Right: Expenses History Table & Category Filter */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Recorded Expense Receipts ({filteredExpenses.length})
            </h3>

            {/* Filter by Category */}
            <select
              value={selectedFilterCategory}
              onChange={(e) => setSelectedFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              <option value="all">All Categories</option>
              <option value="Transportation">Transportation</option>
              <option value="Food">Food</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Entry Fees">Entry Fees</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-xs">No expenses recorded for this category yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <div key={exp.id} className="py-3 flex items-center justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs shrink-0 font-medium">
                      {exp.category.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{exp.title}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-medium text-emerald-700">{exp.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{exp.date}</span>
                        {exp.notes && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="italic">{exp.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold font-mono text-slate-900">
                      ${exp.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      title="Delete expense"
                      className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

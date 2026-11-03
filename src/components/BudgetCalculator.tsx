import React, { useState, useMemo } from 'react';
import { DollarSign, Users, Calendar, AlertTriangle, CheckCircle, ArrowRight, PieChart, RefreshCw } from 'lucide-react';
import { BudgetInput } from '../types/tourism';
import { calculateBudget } from '../services/budgetCalculator';

interface BudgetCalculatorProps {
  initialBudget?: Partial<BudgetInput>;
  onApplyToItinerary?: (budgetData: BudgetInput) => void;
}

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  initialBudget,
  onApplyToItinerary
}) => {
  const [budgetForm, setBudgetForm] = useState<BudgetInput>({
    totalBudget: initialBudget?.totalBudget ?? 600,
    travelers: initialBudget?.travelers ?? 2,
    days: initialBudget?.days ?? 3,
    transportationBudget: initialBudget?.transportationBudget ?? 100,
    accommodationBudget: initialBudget?.accommodationBudget ?? 220,
    foodBudget: initialBudget?.foodBudget ?? 150,
    shoppingBudget: initialBudget?.shoppingBudget ?? 60,
    otherExpenses: initialBudget?.otherExpenses ?? 40
  });

  // Calculate live results using our Java-equivalent logic
  const results = useMemo(() => {
    return calculateBudget(budgetForm, 0);
  }, [budgetForm]);

  const handleChange = (field: keyof BudgetInput, value: number) => {
    setBudgetForm((prev) => ({
      ...prev,
      [field]: Math.max(0, value)
    }));
  };

  const applyPreset = (preset: 'budget' | 'comfort' | 'luxury') => {
    if (preset === 'budget') {
      setBudgetForm({
        totalBudget: 350,
        travelers: 1,
        days: 3,
        transportationBudget: 50,
        accommodationBudget: 120,
        foodBudget: 90,
        shoppingBudget: 30,
        otherExpenses: 25
      });
    } else if (preset === 'comfort') {
      setBudgetForm({
        totalBudget: 800,
        travelers: 2,
        days: 4,
        transportationBudget: 140,
        accommodationBudget: 320,
        foodBudget: 180,
        shoppingBudget: 80,
        otherExpenses: 50
      });
    } else {
      setBudgetForm({
        totalBudget: 1800,
        travelers: 2,
        days: 4,
        transportationBudget: 300,
        accommodationBudget: 750,
        foodBudget: 400,
        shoppingBudget: 200,
        otherExpenses: 120
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            Financial Planning Engine
          </div>
          <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
            Travel Budget Calculator
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Estimate expenses, calculate daily limits, and analyze category breakdowns in real time.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Presets:</span>
          <button
            onClick={() => applyPreset('budget')}
            className="px-2.5 py-1 text-xs font-medium rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Budget Backpacker
          </button>
          <button
            onClick={() => applyPreset('comfort')}
            className="px-2.5 py-1 text-xs font-medium rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Comfort Explorer
          </button>
          <button
            onClick={() => applyPreset('luxury')}
            className="px-2.5 py-1 text-xs font-medium rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Luxury Getaway
          </button>
        </div>
      </div>

      {/* Warning if over budget */}
      {results.isOverBudget && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 shadow-xs animate-shake">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-sm block mb-0.5">
              Budget Warning: Estimated Expenses Exceed Total Travel Budget!
            </span>
            <span>
              Your estimated expenses (${results.totalEstimatedCost.toFixed(2)}) exceed your allocated budget (${budgetForm.totalBudget.toFixed(2)}) by{' '}
              <strong className="font-mono">${results.overBudgetAmount.toFixed(2)}</strong> ({results.percentageUsed}% of budget). Consider reducing accommodation or dining allocations.
            </span>
          </div>
        </div>
      )}

      {!results.isOverBudget && results.remainingBudget < 50 && results.remainingBudget >= 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Tight Budget Cushion:</strong> You have only ${results.remainingBudget.toFixed(2)} remaining. We recommend reserving at least 10% for unexpected transit or local tips.
          </span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Trip Parameters & Expense Allocations</span>
            <span className="text-xs font-mono font-normal text-slate-400">All amounts in USD</span>
          </h3>

          {/* Primary Trip Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Travel Budget ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="50"
                  step="25"
                  value={budgetForm.totalBudget}
                  onChange={(e) => handleChange('totalBudget', Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm font-semibold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Number of Travelers
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={budgetForm.travelers}
                  onChange={(e) => handleChange('travelers', Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm font-semibold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Travel Days
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={budgetForm.days}
                  onChange={(e) => handleChange('days', Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm font-semibold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Categorized Expenses Input Sliders & Number Boxes */}
          <div className="space-y-4 pt-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Category Budget Breakdown
            </div>

            {/* Accommodation */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                  Accommodation (Hotel / Stay)
                </span>
                <span className="font-mono text-slate-900">${budgetForm.accommodationBudget}</span>
              </div>
              <input
                type="range"
                min="0"
                max={budgetForm.totalBudget}
                step="10"
                value={budgetForm.accommodationBudget}
                onChange={(e) => handleChange('accommodationBudget', Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Transportation */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  Transportation (Taxis, Fuel, Transit)
                </span>
                <span className="font-mono text-slate-900">${budgetForm.transportationBudget}</span>
              </div>
              <input
                type="range"
                min="0"
                max={budgetForm.totalBudget}
                step="5"
                value={budgetForm.transportationBudget}
                onChange={(e) => handleChange('transportationBudget', Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* Food & Dining */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Food & Restaurants
                </span>
                <span className="font-mono text-slate-900">${budgetForm.foodBudget}</span>
              </div>
              <input
                type="range"
                min="0"
                max={budgetForm.totalBudget}
                step="5"
                value={budgetForm.foodBudget}
                onChange={(e) => handleChange('foodBudget', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Shopping & Souvenirs */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  Shopping & Bazaars
                </span>
                <span className="font-mono text-slate-900">${budgetForm.shoppingBudget}</span>
              </div>
              <input
                type="range"
                min="0"
                max={budgetForm.totalBudget}
                step="5"
                value={budgetForm.shoppingBudget}
                onChange={(e) => handleChange('shoppingBudget', Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            {/* Other Miscellaneous */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  Other & Emergency Expenses
                </span>
                <span className="font-mono text-slate-900">${budgetForm.otherExpenses}</span>
              </div>
              <input
                type="range"
                min="0"
                max={budgetForm.totalBudget}
                step="5"
                value={budgetForm.otherExpenses}
                onChange={(e) => handleChange('otherExpenses', Number(e.target.value))}
                className="w-full accent-slate-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Results & Visual Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Calculation Metric Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Budget Calculation Summary
            </h3>

            {/* 4 Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                  Total Estimated Cost
                </span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  ${results.totalEstimatedCost.toFixed(2)}
                </span>
              </div>

              <div
                className={`p-3.5 rounded-xl border ${
                  results.isOverBudget
                    ? 'bg-red-50 border-red-200 text-red-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <span className="text-[11px] font-medium block mb-1">
                  {results.isOverBudget ? 'Over Budget By' : 'Remaining Budget'}
                </span>
                <span className="text-xl font-bold font-mono">
                  ${Math.abs(results.remainingBudget).toFixed(2)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                  Cost Per Person
                </span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  ${results.perPersonCost.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({budgetForm.travelers} traveler{budgetForm.travelers > 1 ? 's' : ''})
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                  Daily Spending Limit
                </span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  ${results.dailySpendingLimit.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({budgetForm.days} travel day{budgetForm.days > 1 ? 's' : ''})
                </span>
              </div>
            </div>

            {/* Visual Progress / Budget Usage Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700">Budget Consumption</span>
                <span className={`font-mono ${results.isOverBudget ? 'text-red-600 font-bold' : 'text-slate-900'}`}>
                  {results.percentageUsed}% of ${budgetForm.totalBudget}
                </span>
              </div>

              {/* Multi-segment proportional visual bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                {results.breakdown.map((item) => (
                  <div
                    key={item.category}
                    title={`${item.category}: $${item.amount} (${item.percentage.toFixed(1)}%)`}
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                    className="h-full transition-all duration-300"
                  />
                ))}
              </div>
            </div>

            {/* Category Breakdown Table */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Detailed Allocation
              </div>
              {results.breakdown.map((item) => (
                <div key={item.category} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-mono text-[11px]">
                      {item.percentage.toFixed(0)}%
                    </span>
                    <span className="font-semibold font-mono text-slate-900 w-16 text-right">
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Transfer to Itinerary Action */}
            {onApplyToItinerary && (
              <button
                onClick={() => onApplyToItinerary(budgetForm)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>Generate Smart Itinerary with these Constraints</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Navigation, 
  Bookmark, 
  Printer, 
  Utensils, 
  Car, 
  Check, 
  Download,
  AlertCircle
} from 'lucide-react';
import { Destination, ItineraryPreference, ItineraryPlan, CategoryType } from '../types/tourism';
import { DESTINATION_CATEGORIES } from '../data/mockDestinations';
import { generateSmartItinerary } from '../services/itineraryGenerator';

interface ItineraryGeneratorProps {
  destinations: Destination[];
  initialBudgetConstraints?: {
    totalBudget: number;
    travelers: number;
    days: number;
  };
  onSavePlan: (plan: ItineraryPlan) => void;
  savedPlanIds: string[];
}

export const ItineraryGenerator: React.FC<ItineraryGeneratorProps> = ({
  destinations,
  initialBudgetConstraints,
  onSavePlan,
  savedPlanIds
}) => {
  // Preference state
  const [preferences, setPreferences] = useState<ItineraryPreference>({
    destinationCity: 'Jaipur',
    startDate: new Date().toISOString().split('T')[0],
    days: initialBudgetConstraints?.days ?? 3,
    totalBudget: initialBudgetConstraints?.totalBudget ?? 500,
    travelers: initialBudgetConstraints?.travelers ?? 2,
    interests: ['historical', 'nature', 'food', 'shopping'],
    travelPace: 'moderate'
  });

  const [activePlan, setActivePlan] = useState<ItineraryPlan | null>(null);
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync initial budget constraints if updated from budget calculator
  useEffect(() => {
    if (initialBudgetConstraints) {
      setPreferences((prev) => ({
        ...prev,
        days: initialBudgetConstraints.days,
        totalBudget: initialBudgetConstraints.totalBudget,
        travelers: initialBudgetConstraints.travelers
      }));
    }
  }, [initialBudgetConstraints]);

  // Generate initial plan on mount if none
  useEffect(() => {
    if (!activePlan && destinations.length > 0) {
      const plan = generateSmartItinerary(preferences, destinations);
      setActivePlan(plan);
    }
  }, [destinations]);

  const handleInterestToggle = (catId: CategoryType) => {
    setPreferences((prev) => {
      const exists = prev.interests.includes(catId);
      const updated = exists
        ? prev.interests.filter((i) => i !== catId)
        : [...prev.interests, catId];
      // Keep at least 1 interest
      return {
        ...prev,
        interests: updated.length > 0 ? updated : [catId]
      };
    });
  };

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const plan = generateSmartItinerary(preferences, destinations);
      setActivePlan(plan);
      setIsGenerating(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 300);
  };

  const handleSave = () => {
    if (activePlan) {
      onSavePlan(activePlan);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!activePlan) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activePlan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activePlan.destinationCity}-itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const isSaved = activePlan ? savedPlanIds.includes(activePlan.id) : false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title & Introduction */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
          Automated Smart Routing & Budget Pacing
        </div>
        <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
          Smart Itinerary Generator
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Generates personalized day-wise morning, afternoon, and evening schedules with entry fees,
          spatial transit grouping, and authentic culinary recommendations.
        </p>
      </div>

      {/* Preferences Form Card */}
      <form
        onSubmit={handleGenerate}
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-10 space-y-6"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Configure Trip Parameters</h3>
          <span className="text-xs text-slate-400">Rule-based optimization</span>
        </div>

        {/* First Row of Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Destination City</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={preferences.destinationCity}
                onChange={(e) => setPreferences({ ...preferences, destinationCity: e.target.value })}
                className="w-full pl-8 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Jaipur">Jaipur (Pink City)</option>
                <option value="Udaipur">Udaipur (City of Lakes)</option>
                <option value="Agra">Agra (Heritage Valley)</option>
                <option value="All">All Local Attractions</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={preferences.startDate}
                onChange={(e) => setPreferences({ ...preferences, startDate: e.target.value })}
                className="w-full pl-8 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Travel Days</label>
            <select
              value={preferences.days}
              onChange={(e) => setPreferences({ ...preferences, days: Number(e.target.value) })}
              className="w-full py-2 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>
                  {d} Day{d > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Travelers</label>
            <input
              type="number"
              min="1"
              max="20"
              value={preferences.travelers}
              onChange={(e) => setPreferences({ ...preferences, travelers: Math.max(1, Number(e.target.value)) })}
              className="w-full py-2 px-3 text-xs font-semibold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Total Budget ($)</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="50"
                step="25"
                value={preferences.totalBudget}
                onChange={(e) => setPreferences({ ...preferences, totalBudget: Math.max(10, Number(e.target.value)) })}
                className="w-full pl-8 pr-3 py-2 text-xs font-semibold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Interests & Travel Pace */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Your Interests (Priority Attraction Types)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {DESTINATION_CATEGORIES.map((cat) => {
              const selected = preferences.interests.includes(cat.id);
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleInterestToggle(cat.id)}
                  className={`p-2 rounded-lg border text-xs font-medium text-left transition-colors flex items-center justify-between ${
                    selected
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {selected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Computing Optimized Itinerary...' : 'Generate Personalized Itinerary'}</span>
          </button>
        </div>
      </form>

      {/* Generated Itinerary Output */}
      {activePlan && (
        <div className="space-y-8">
          {/* Plan Summary Header Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>{activePlan.destinationCity}</span>
                <span aria-hidden="true">·</span>
                <span>{activePlan.days} Travel Days</span>
                <span aria-hidden="true">·</span>
                <span>{activePlan.travelers} Traveler{activePlan.travelers > 1 ? 's' : ''}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900">
                {activePlan.title}
              </h3>
            </div>

            {/* Financial Summary Strip */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[11px]">Estimated Cost</span>
                <span className="font-bold font-mono text-slate-900 text-base">
                  ${activePlan.totalEstimatedCost}
                </span>
              </div>

              <div
                className={`p-3 rounded-xl border text-xs ${
                  activePlan.remainingBudget >= 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-red-50 border-red-200 text-red-950'
                }`}
              >
                <span className="block text-[11px] opacity-75">
                  {activePlan.remainingBudget >= 0 ? 'Remaining Budget' : 'Over Budget'}
                </span>
                <span className="font-bold font-mono text-base">
                  ${Math.abs(activePlan.remainingBudget)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                    isSaved
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600' : ''}`} />
                  {isSaved ? 'Saved to Plans' : 'Save Plan'}
                </button>

                <button
                  onClick={handlePrint}
                  title="Print Itinerary"
                  className="p-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={handleExportJSON}
                  title="Export JSON"
                  className="p-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Day Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedDayFilter('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedDayFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Days ({activePlan.dayPlans.length})
            </button>
            {activePlan.dayPlans.map((dp) => (
              <button
                key={dp.dayNumber}
                onClick={() => setSelectedDayFilter(dp.dayNumber)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedDayFilter === dp.dayNumber
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Day {dp.dayNumber}
              </button>
            ))}
          </div>

          {/* Day Plans Container */}
          <div className="space-y-8">
            {activePlan.dayPlans
              .filter((dp) => selectedDayFilter === 'all' || selectedDayFilter === dp.dayNumber)
              .map((dayPlan) => (
                <div
                  key={dayPlan.dayNumber}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs"
                >
                  {/* Day Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm font-mono">
                        D{dayPlan.dayNumber}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">
                          Day {dayPlan.dayNumber} Itinerary
                        </h4>
                        <span className="text-xs text-slate-400">{dayPlan.date}</span>
                      </div>
                    </div>

                    {/* Daily Expense Subtotal Pill */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500">
                        Activities: <strong className="text-slate-800">{dayPlan.slots.length}</strong>
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-500">
                        Daily Est: <strong className="font-mono text-emerald-700">${dayPlan.dayEstimatedExpenses}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Morning, Afternoon, Evening Activity Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {dayPlan.slots.map((slot, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between"
                      >
                        {/* Slot Header Banner */}
                        <div className="p-3.5 bg-white border-b border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                            {slot.slot} Activity
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {slot.timeRange}
                          </span>
                        </div>

                        {/* Destination Thumbnail & Content */}
                        <div className="p-4 flex-1">
                          <div className="relative aspect-16/9 rounded-lg overflow-hidden mb-3 bg-slate-200">
                            <img
                              src={slot.destination.imageUrl}
                              alt={slot.destination.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                              {slot.destination.entryFee === 0
                                ? 'Free Entry'
                                : `$${slot.destination.entryFee}/person`}
                            </div>
                          </div>

                          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                            <span className="font-medium text-emerald-700">
                              {slot.destination.categoryName}
                            </span>
                          </div>

                          <h5 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">
                            {slot.destination.name}
                          </h5>

                          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                            {slot.destination.description}
                          </p>

                          {/* Food & Dining Recommendation */}
                          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/60 text-[11px] text-amber-900 mb-3 space-y-1">
                            <div className="font-semibold flex items-center gap-1 text-amber-800">
                              <Utensils className="w-3 h-3" />
                              Dining Tip:
                            </div>
                            <p className="line-clamp-2">{slot.foodRecommendation}</p>
                          </div>

                          {/* Transit & Notes */}
                          <div className="text-[11px] text-slate-500 flex items-start gap-1">
                            <Car className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                            <span>Transit ~${slot.estimatedTransportCost}. {slot.travelNotes}</span>
                          </div>
                        </div>

                        {/* Action Link to Google Maps */}
                        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-mono text-slate-500 text-[11px]">
                            Entry: ${slot.entryFee}
                          </span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${slot.destination.name}, ${slot.destination.address}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
                          >
                            <Navigation className="w-3 h-3" />
                            Directions
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Calendar, MapPin, DollarSign, Clock, Trash2, Printer, ArrowRight, BookmarkCheck } from 'lucide-react';
import { ItineraryPlan } from '../types/tourism';

interface MyTravelPlansProps {
  plans: ItineraryPlan[];
  onDeletePlan: (id: string) => void;
  onViewPlan: (plan: ItineraryPlan) => void;
  onCreateNew: () => void;
}

export const MyTravelPlans: React.FC<MyTravelPlansProps> = ({
  plans,
  onDeletePlan,
  onViewPlan,
  onCreateNew
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            Personal Itinerary Portfolio
          </div>
          <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
            My Saved Travel Plans
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Review your saved multi-day itineraries, check estimated budgets, and export trip schedules.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <span>Create New Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto">
          <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No saved travel plans yet</h3>
          <p className="text-xs text-slate-500 mb-6">
            Use the Smart Itinerary Generator to design a day-wise travel schedule tailored to your budget and interests.
          </p>
          <button
            onClick={onCreateNew}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            Generate Itinerary Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <MapPin className="w-3 h-3" />
                    {plan.destinationCity}
                  </span>
                  <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {plan.title}
                </h3>

                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Days</span>
                    <span className="font-bold text-slate-800">{plan.days} Days</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Travelers</span>
                    <span className="font-bold text-slate-800">{plan.travelers} Pax</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Cost</span>
                    <span className="font-bold font-mono text-emerald-700">
                      ${plan.totalEstimatedCost}
                    </span>
                  </div>
                </div>

                {/* Day Overview List */}
                <div className="space-y-1 text-xs text-slate-600 mb-4">
                  {plan.dayPlans.slice(0, 3).map((dp) => (
                    <div key={dp.dayNumber} className="flex items-center justify-between text-[11px]">
                      <span>Day {dp.dayNumber} ({dp.slots.length} stops)</span>
                      <span className="font-mono text-slate-400">${dp.dayEstimatedExpenses}</span>
                    </div>
                  ))}
                  {plan.dayPlans.length > 3 && (
                    <div className="text-[10px] text-slate-400 italic">
                      + {plan.dayPlans.length - 3} more days
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onViewPlan(plan)}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  View Itinerary
                </button>

                <button
                  onClick={() => onDeletePlan(plan.id)}
                  title="Delete Plan"
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Compass, User, LogOut, Shield } from 'lucide-react';
import { UserProfile } from '../types/tourism';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900">
              WanderPlan
            </span>
          </button>

          {/* Zone 2: Single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => setCurrentTab('destinations')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'destinations' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Destinations
            </button>
            <button
              onClick={() => setCurrentTab('budget')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'budget' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Budget Calculator
            </button>
            <button
              onClick={() => setCurrentTab('itinerary')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'itinerary' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Smart Itinerary
            </button>
            <button
              onClick={() => setCurrentTab('expenses')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'expenses' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Expense Tracker
            </button>
            <button
              onClick={() => setCurrentTab('plans')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'plans' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              My Plans
            </button>
            <button
              onClick={() => setCurrentTab('java-hub')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentTab === 'java-hub' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono">Java</span>
              Backend Code
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                  currentTab === 'admin' ? 'text-emerald-700 font-semibold' : ''
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                Admin
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Action & User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentTab('plans')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="truncate max-w-[120px]">{currentUser.name}</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5" />
                Sign In / Demo
              </button>
            )}

            <button
              onClick={() => setCurrentTab('itinerary')}
              className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              Generate Itinerary
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="lg:hidden flex items-center gap-4 py-2 overflow-x-auto text-xs font-medium text-slate-600 border-t border-slate-100 no-scrollbar">
          <button onClick={() => setCurrentTab('destinations')} className="whitespace-nowrap py-1">Destinations</button>
          <button onClick={() => setCurrentTab('budget')} className="whitespace-nowrap py-1">Budget</button>
          <button onClick={() => setCurrentTab('itinerary')} className="whitespace-nowrap py-1">Itinerary</button>
          <button onClick={() => setCurrentTab('expenses')} className="whitespace-nowrap py-1">Expenses</button>
          <button onClick={() => setCurrentTab('plans')} className="whitespace-nowrap py-1">Plans</button>
          <button onClick={() => setCurrentTab('java-hub')} className="whitespace-nowrap py-1 text-amber-700 font-semibold">Java Code</button>
          {currentUser?.role === 'admin' && (
            <button onClick={() => setCurrentTab('admin')} className="whitespace-nowrap py-1 text-indigo-700">Admin</button>
          )}
        </div>
      </div>
    </header>
  );
};

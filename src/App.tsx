/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DestinationExplorer } from './components/DestinationExplorer';
import { BudgetCalculator } from './components/BudgetCalculator';
import { ItineraryGenerator } from './components/ItineraryGenerator';
import { ExpenseTracker } from './components/ExpenseTracker';
import { MyTravelPlans } from './components/MyTravelPlans';
import { AdminDashboard } from './components/AdminDashboard';
import { JavaProjectHub } from './components/JavaProjectHub';
import { AuthModal } from './components/AuthModal';

import { Destination, ItineraryPlan, ActualExpense, UserProfile, BudgetInput } from './types/tourism';
import { INITIAL_DESTINATIONS } from './data/mockDestinations';
import { generateSmartItinerary } from './services/itineraryGenerator';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const saved = localStorage.getItem('tp_destinations');
    return saved ? JSON.parse(saved) : INITIAL_DESTINATIONS;
  });

  const [travelPlans, setTravelPlans] = useState<ItineraryPlan[]>(() => {
    const saved = localStorage.getItem('tp_plans');
    if (saved) return JSON.parse(saved);
    // Seed with 1 realistic plan
    const initialSeed = generateSmartItinerary(
      {
        destinationCity: 'Jaipur',
        startDate: '2026-11-15',
        days: 3,
        totalBudget: 550,
        travelers: 2,
        interests: ['historical', 'nature', 'food', 'shopping'],
        travelPace: 'moderate'
      },
      INITIAL_DESTINATIONS
    );
    return [initialSeed];
  });

  const [expenses, setExpenses] = useState<ActualExpense[]>(() => {
    const saved = localStorage.getItem('tp_expenses');
    return saved ? JSON.parse(saved) : undefined;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('tp_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 2,
          name: 'Pawan Deol',
          email: 'tourist@tourismplanner.local',
          role: 'tourist'
        };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeBudgetConstraints, setActiveBudgetConstraints] = useState<{
    totalBudget: number;
    travelers: number;
    days: number;
  }>({
    totalBudget: 550,
    travelers: 2,
    days: 3
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tp_destinations', JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem('tp_plans', JSON.stringify(travelPlans));
  }, [travelPlans]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tp_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tp_user');
    }
  }, [currentUser]);

  // Handlers
  const handleQuickHeroGenerate = (city: string, days: number, budget: number) => {
    setActiveBudgetConstraints({
      totalBudget: budget,
      travelers: 2,
      days
    });
    setCurrentTab('itinerary');
  };

  const handleApplyBudgetToItinerary = (budgetData: BudgetInput) => {
    setActiveBudgetConstraints({
      totalBudget: budgetData.totalBudget,
      travelers: budgetData.travelers,
      days: budgetData.days
    });
    setCurrentTab('itinerary');
  };

  const handleSavePlan = (plan: ItineraryPlan) => {
    const exists = travelPlans.some((p) => p.id === plan.id);
    if (exists) {
      setTravelPlans(travelPlans.map((p) => (p.id === plan.id ? plan : p)));
    } else {
      setTravelPlans([plan, ...travelPlans]);
    }
  };

  const handleDeletePlan = (id: string) => {
    setTravelPlans(travelPlans.filter((p) => p.id !== id));
  };

  const handleAddDestination = (newDest: Destination) => {
    setDestinations([newDest, ...destinations]);
  };

  const handleUpdateDestination = (updatedDest: Destination) => {
    setDestinations(destinations.map((d) => (d.id === updatedDest.id ? updatedDest : d)));
  };

  const handleDeleteDestination = (id: number) => {
    setDestinations(destinations.filter((d) => d.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Primary Top Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div>
            <HeroSection
              onQuickGenerate={handleQuickHeroGenerate}
              onExploreDestinations={() => setCurrentTab('destinations')}
            />
            {/* Quick Preview of Destinations */}
            <div className="bg-slate-50 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    Featured Local Destinations
                  </h3>
                  <p className="text-xs text-slate-500">
                    Top-rated heritage citadels, national parks, and artisan night bazaars.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('destinations')}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  View all ({destinations.length}) →
                </button>
              </div>
              <DestinationExplorer
                destinations={destinations.slice(0, 6)}
                onSelectForTrip={(dest) => {
                  setCurrentTab('itinerary');
                }}
              />
            </div>
          </div>
        )}

        {currentTab === 'destinations' && (
          <DestinationExplorer
            destinations={destinations}
            onSelectForTrip={(dest) => {
              setCurrentTab('itinerary');
            }}
          />
        )}

        {currentTab === 'budget' && (
          <BudgetCalculator
            initialBudget={{
              totalBudget: activeBudgetConstraints.totalBudget,
              travelers: activeBudgetConstraints.travelers,
              days: activeBudgetConstraints.days
            }}
            onApplyToItinerary={handleApplyBudgetToItinerary}
          />
        )}

        {currentTab === 'itinerary' && (
          <ItineraryGenerator
            destinations={destinations}
            initialBudgetConstraints={activeBudgetConstraints}
            onSavePlan={handleSavePlan}
            savedPlanIds={travelPlans.map((p) => p.id)}
          />
        )}

        {currentTab === 'expenses' && (
          <ExpenseTracker
            plannedBudget={travelPlans[0]?.totalEstimatedCost || activeBudgetConstraints.totalBudget}
            initialExpenses={expenses}
          />
        )}

        {currentTab === 'plans' && (
          <MyTravelPlans
            plans={travelPlans}
            onDeletePlan={handleDeletePlan}
            onViewPlan={(plan) => {
              setCurrentTab('itinerary');
            }}
            onCreateNew={() => setCurrentTab('itinerary')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            destinations={destinations}
            onAddDestination={handleAddDestination}
            onUpdateDestination={handleUpdateDestination}
            onDeleteDestination={handleDeleteDestination}
            travelPlans={travelPlans}
          />
        )}

        {currentTab === 'java-hub' && <JavaProjectHub />}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div>
            <div className="font-display font-bold text-slate-900 text-sm mb-0.5">
              Local Tourism Planner with Budget & Itinerary Generator
            </div>
            <p>
              Complete Java MVC Architecture (JSP, Servlets, JDBC, MySQL, Apache Tomcat)
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentTab('destinations')}
              className="hover:text-slate-900 transition-colors"
            >
              Destinations
            </button>
            <button
              onClick={() => setCurrentTab('budget')}
              className="hover:text-slate-900 transition-colors"
            >
              Budget Calculator
            </button>
            <button
              onClick={() => setCurrentTab('itinerary')}
              className="hover:text-slate-900 transition-colors"
            >
              Itinerary
            </button>
            <button
              onClick={() => setCurrentTab('java-hub')}
              className="font-semibold text-amber-700 hover:text-amber-800 transition-colors"
            >
              Download Java Code (.ZIP)
            </button>
          </div>

          <div className="text-right">
            <span>© {new Date().getFullYear()} WanderPlan Systems.</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
}

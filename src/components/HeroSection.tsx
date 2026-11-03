import React, { useState } from 'react';
import { Sparkles, Calendar, DollarSign, MapPin, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onQuickGenerate: (city: string, days: number, budget: number) => void;
  onExploreDestinations: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onQuickGenerate,
  onExploreDestinations
}) => {
  const [city, setCity] = useState('Jaipur');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(450);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickGenerate(city, days, budget);
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background Image with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_tourism_landscape_1793691648829.jpg"
          alt="Panoramic view of heritage tourism landscape and tranquil waterways"
          className="w-full h-full object-cover opacity-35 filter brightness-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-4">
            <span>Intelligent Tourism Planning</span>
            <span aria-hidden="true">·</span>
            <span>Budget Optimized</span>
            <span aria-hidden="true">·</span>
            <span>Java Full-Stack Architecture</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight [text-wrap:balance]">
            Explore local wonders with smart budgets and automated itineraries.
          </h1>

          <p className="text-lg text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Plan your journey with spatial clustering and smart expense calculations.
            Discover heritage palaces, mountain sanctuaries, and local food alleys without overspending.
          </p>

          {/* Quick Plan Generator Bar */}
          <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              {/* Destination City */}
              <div className="px-3 py-2 bg-white/90 rounded-xl text-slate-900">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                  Destination
                </label>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold bg-transparent border-0 focus:ring-0 p-0 text-slate-900 cursor-pointer"
                  >
                    <option value="Jaipur">Jaipur (Pink City)</option>
                    <option value="Udaipur">Udaipur (Lake City)</option>
                    <option value="Agra">Agra (Heritage Valley)</option>
                    <option value="All">All Local Regions</option>
                  </select>
                </div>
              </div>

              {/* Number of Days */}
              <div className="px-3 py-2 bg-white/90 rounded-xl text-slate-900">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                  Duration
                </label>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                  <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm font-semibold bg-transparent border-0 focus:ring-0 p-0 text-slate-900 cursor-pointer"
                  >
                    <option value="1">1 Day Express</option>
                    <option value="2">2 Days Weekend</option>
                    <option value="3">3 Days Classic</option>
                    <option value="4">4 Days In-Depth</option>
                    <option value="5">5 Days Vacation</option>
                    <option value="7">7 Days Explorer</option>
                  </select>
                </div>
              </div>

              {/* Total Budget */}
              <div className="px-3 py-2 bg-white/90 rounded-xl text-slate-900">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                  Budget (USD)
                </label>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="number"
                    min="50"
                    max="10000"
                    step="50"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm font-semibold bg-transparent border-0 focus:ring-0 p-0 text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full h-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Plan My Trip</span>
              </button>
            </div>
          </form>

          {/* Secondary Action */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <button
              onClick={onExploreDestinations}
              className="inline-flex items-center gap-2 text-white hover:text-emerald-300 font-medium transition-colors"
            >
              <span>Browse all 10+ local tourist attractions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quantitative Proof Strip */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-emerald-400">
              6 Categories
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Historical, Religious, Nature, Adventure, Shopping, Dining
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
              100% Rule-Based
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Proximity clustering & Morning-Evening time allocation
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
              Real-Time Math
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Live per-person & daily spending limit calculations
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-emerald-400">
              JSP & Servlet
            </div>
            <div className="text-xs text-slate-400 mt-1">
              MySQL schema, JDBC DAOs, and Tomcat deployment ready
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

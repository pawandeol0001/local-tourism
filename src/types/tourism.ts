/**
 * Core type definitions for Local Tourism Planner with Budget and Itinerary Generator
 */

export type CategoryType = 
  | 'historical'
  | 'religious'
  | 'nature'
  | 'adventure'
  | 'shopping'
  | 'food';

export interface DestinationCategory {
  id: CategoryType;
  name: string;
  description: string;
  iconName: string;
}

export interface Destination {
  id: number;
  name: string;
  categoryId: CategoryType;
  categoryName: string;
  location: string;
  city: string;
  description: string;
  imageUrl: string;
  entryFee: number; // in USD / local currency
  visitDurationHours: number;
  bestTime: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  isPopular?: boolean;
}

export interface BudgetInput {
  totalBudget: number;
  travelers: number;
  days: number;
  transportationBudget: number;
  foodBudget: number;
  accommodationBudget: number;
  shoppingBudget: number;
  otherExpenses: number;
}

export interface BudgetCalculationResult {
  totalEstimatedCost: number;
  remainingBudget: number;
  perPersonCost: number;
  dailySpendingLimit: number;
  isOverBudget: boolean;
  overBudgetAmount: number;
  percentageUsed: number;
  breakdown: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
}

export interface ItineraryPreference {
  destinationCity: string;
  startDate: string;
  days: number;
  totalBudget: number;
  travelers: number;
  interests: CategoryType[];
  travelPace: 'relaxed' | 'moderate' | 'packed';
}

export interface ItinerarySlot {
  slot: 'Morning' | 'Afternoon' | 'Evening';
  destination: Destination;
  timeRange: string;
  entryFee: number;
  estimatedTransportCost: number;
  foodRecommendation: string;
  travelNotes: string;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  slots: ItinerarySlot[];
  dayEstimatedExpenses: number;
  foodCost: number;
  transportCost: number;
  entryFeesTotal: number;
}

export interface ItineraryPlan {
  id: string;
  title: string;
  destinationCity: string;
  startDate: string;
  days: number;
  travelers: number;
  totalBudget: number;
  totalEstimatedCost: number;
  remainingBudget: number;
  dayPlans: DayPlan[];
  createdAt: string;
}

export interface ActualExpense {
  id: string;
  tripId?: string;
  title: string;
  category: 'Transportation' | 'Food' | 'Accommodation' | 'Entry Fees' | 'Shopping' | 'Other';
  amount: number;
  date: string;
  notes?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'tourist' | 'admin';
  avatar?: string;
}

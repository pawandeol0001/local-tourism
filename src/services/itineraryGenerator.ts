import { Destination, ItineraryPreference, ItineraryPlan, DayPlan, ItinerarySlot } from '../types/tourism';

/**
 * Calculates Euclidean distance between two geographic coordinates
 * Used to cluster nearby tourist attractions
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dx = (lat1 - lat2) * 111.0;
  const dy = (lon1 - lon2) * 111.0 * Math.cos((lat1 * Math.PI) / 180);
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Smart Itinerary Generator Logic
 * Implements rule-based spatial clustering and budget allocation algorithm,
 * mirroring Java ItineraryGeneratorService.java
 */
export function generateSmartItinerary(
  preferences: ItineraryPreference,
  allDestinations: Destination[]
): ItineraryPlan {
  const { destinationCity, startDate, days, totalBudget, travelers, interests } = preferences;

  // 1. Filter destinations by city and interests
  let candidatePool = allDestinations.filter(d => 
    d.city.toLowerCase() === destinationCity.toLowerCase() || destinationCity === 'All'
  );

  if (candidatePool.length === 0) {
    candidatePool = [...allDestinations];
  }

  // Filter or prioritize destinations matching interests
  const interestSet = new Set(interests);
  const matchedDestinations = candidatePool.filter(d => interestSet.has(d.categoryId));
  const fallbackDestinations = candidatePool.filter(d => !interestSet.has(d.categoryId));

  // Combine, prioritizing matched interests
  let sortedPool = [...matchedDestinations, ...fallbackDestinations];

  // 2. Budget constraints: daily budget available for activities
  const dailyBudgetAvailable = totalBudget / days;
  const estimatedFoodPerDay = Math.min(30 * travelers, dailyBudgetAvailable * 0.3);
  const estimatedTransportPerDay = Math.min(20 * travelers, dailyBudgetAvailable * 0.2);

  // 3. Cluster and distribute destinations across days
  const dayPlans: DayPlan[] = [];
  const usedDestinationIds = new Set<number>();

  const baseDate = new Date(startDate || new Date().toISOString().split('T')[0]);

  for (let day = 1; day <= days; day++) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + (day - 1));
    const dateString = currentDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Pick 2-3 activities for this day
    const dayDestinations: Destination[] = [];

    // Find first anchor destination for the day
    const anchor = sortedPool.find(d => !usedDestinationIds.has(d.id));
    if (anchor) {
      dayDestinations.push(anchor);
      usedDestinationIds.add(anchor.id);

      // Find 1 or 2 nearby destinations to optimize travel route
      const nearbyCandidates = sortedPool
        .filter(d => !usedDestinationIds.has(d.id))
        .map(d => ({
          destination: d,
          distance: calculateDistance(anchor.latitude, anchor.longitude, d.latitude, d.longitude)
        }))
        .sort((a, b) => a.distance - b.distance);

      const neededCount = preferences.travelPace === 'packed' ? 3 : preferences.travelPace === 'relaxed' ? 2 : 2;

      for (let i = 0; i < nearbyCandidates.length && dayDestinations.length < neededCount; i++) {
        const candidate = nearbyCandidates[i].destination;
        dayDestinations.push(candidate);
        usedDestinationIds.add(candidate.id);
      }
    } else {
      // If pool exhausted, loop back to popular attractions
      const repeat = candidatePool[(day - 1) % candidatePool.length];
      dayDestinations.push(repeat);
    }

    // Assign morning, afternoon, evening slots
    const slots: ItinerarySlot[] = [];
    const timeSlots: ('Morning' | 'Afternoon' | 'Evening')[] = ['Morning', 'Afternoon', 'Evening'];
    const timeRanges = [
      '09:00 AM - 12:30 PM',
      '01:30 PM - 04:30 PM',
      '05:30 PM - 08:30 PM'
    ];

    let dayEntryFees = 0;

    dayDestinations.forEach((dest, index) => {
      const slotName = timeSlots[index % timeSlots.length];
      const slotTime = timeRanges[index % timeRanges.length];
      const entryCost = dest.entryFee * travelers;
      dayEntryFees += entryCost;

      // Realistic local food recommendations based on category and time of day
      let foodRec = 'Local heritage courtyard cafe & iced refreshments';
      if (slotName === 'Morning') {
        foodRec = 'Artisan morning bakery, seasonal fresh fruits & spiced tea';
      } else if (slotName === 'Afternoon') {
        foodRec = 'Traditional royal thali or garden courtyard bistro lunch';
      } else {
        foodRec = 'Rooftop sunset dining with panoramic city lights and live acoustic sitar';
      }

      slots.push({
        slot: slotName,
        destination: dest,
        timeRange: slotTime,
        entryFee: entryCost,
        estimatedTransportCost: 5 * travelers,
        foodRecommendation: foodRec,
        travelNotes: `Allow ${dest.visitDurationHours} hrs for comprehensive visit. ${dest.bestTime}.`
      });
    });

    const dayTransportCost = slots.length * (5 * travelers);
    const dayEstimatedExpenses = dayEntryFees + dayTransportCost + estimatedFoodPerDay;

    dayPlans.push({
      dayNumber: day,
      date: dateString,
      slots,
      dayEstimatedExpenses: Math.round(dayEstimatedExpenses),
      foodCost: Math.round(estimatedFoodPerDay),
      transportCost: Math.round(dayTransportCost),
      entryFeesTotal: Math.round(dayEntryFees)
    });
  }

  // Calculate overall estimated itinerary cost
  const totalEstimatedCost = dayPlans.reduce((sum, d) => sum + d.dayEstimatedExpenses, 0);
  const remainingBudget = totalBudget - totalEstimatedCost;

  return {
    id: `ITIN-${Date.now()}`,
    title: `${destinationCity} ${days}-Day Discovery Tour`,
    destinationCity,
    startDate,
    days,
    travelers,
    totalBudget,
    totalEstimatedCost: Math.round(totalEstimatedCost),
    remainingBudget: Math.round(remainingBudget),
    dayPlans,
    createdAt: new Date().toISOString()
  };
}

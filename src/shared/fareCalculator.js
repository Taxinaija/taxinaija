/**
 * Fare Calculator Utility
 * 
 * This module provides fare calculation functions for the TaxiNaija app.
 * Currently uses a base fare system, but can be extended to include
 * distance-based, time-based, and dynamic pricing.
 */

// Base fare configuration (in Naira)
const FARE_CONFIG = {
  baseFare: 500,           // Minimum fare
  perKilometer: 150,       // Cost per kilometer
  perMinute: 50,           // Cost per minute of travel time
  surgePricing: {
    peak: 1.5,             // 1.5x during peak hours
    offPeak: 1.0           // Normal pricing
  },
  minimumFare: 500,        // Never charge less than this
  maximumFare: 50000       // Safety limit
};

// Peak hours: 7-9 AM and 5-8 PM on weekdays
const PEAK_HOURS = [
  { start: 7, end: 9 },    // Morning rush
  { start: 17, end: 20 }   // Evening rush
];

/**
 * Check if current time is during peak hours
 * @returns {boolean} True if peak hours
 */
export function isPeakHour() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Weekend is not peak
  if (day === 0 || day === 6) return false;
  
  // Check if current hour falls in peak ranges
  return PEAK_HOURS.some(range => hour >= range.start && hour < range.end);
}

/**
 * Calculate fare based on distance and estimated time
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} durationMinutes - Estimated duration in minutes
 * @returns {number} Calculated fare in Naira
 */
export function calculateFare(distanceKm, durationMinutes) {
  // Base calculation
  let fare = FARE_CONFIG.baseFare;
  fare += distanceKm * FARE_CONFIG.perKilometer;
  fare += durationMinutes * FARE_CONFIG.perMinute;
  
  // Apply surge pricing if peak hours
  if (isPeakHour()) {
    fare *= FARE_CONFIG.surgePricing.peak;
  }
  
  // Round to nearest 10 Naira
  fare = Math.round(fare / 10) * 10;
  
  // Apply limits
  fare = Math.max(FARE_CONFIG.minimumFare, fare);
  fare = Math.min(FARE_CONFIG.maximumFare, fare);
  
  return fare;
}

/**
 * Calculate fare using only distance (simplified)
 * @param {number} distanceKm - Distance in kilometers
 * @returns {number} Calculated fare in Naira
 */
export function calculateFareByDistance(distanceKm) {
  // Estimate duration: assume average speed of 30 km/h in city
  const estimatedDuration = (distanceKm / 30) * 60; // minutes
  return calculateFare(distanceKm, estimatedDuration);
}

/**
 * Get base fare (minimum charge)
 * @returns {number} Base fare in Naira
 */
export function getBaseFare() {
  return FARE_CONFIG.baseFare;
}

/**
 * Estimate fare from pickup and destination addresses
 * TODO: Integrate with Google Maps Distance Matrix API
 * 
 * @param {string} pickupAddress - Pickup location address
 * @param {string} destinationAddress - Destination address
 * @returns {Promise<{fare: number, distance: number, duration: number}>}
 */
export async function estimateFareFromAddresses(pickupAddress, destinationAddress) {
  // TODO: Implement actual API integration
  // Example using Google Maps Distance Matrix API:
  /*
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?` +
    `origins=${encodeURIComponent(pickupAddress)}&` +
    `destinations=${encodeURIComponent(destinationAddress)}&` +
    `key=${GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  
  if (data.rows[0]?.elements[0]?.status === 'OK') {
    const distance = data.rows[0].elements[0].distance.value / 1000; // Convert to km
    const duration = data.rows[0].elements[0].duration.value / 60; // Convert to minutes
    const fare = calculateFare(distance, duration);
    
    return { fare, distance, duration };
  }
  */
  
  // For now, return base fare
  // In production, implement proper distance calculation
  console.warn('Using base fare - distance calculation not implemented');
  return {
    fare: getBaseFare(),
    distance: 0,
    duration: 0
  };
}

/**
 * Format fare for display
 * @param {number} fare - Fare amount in Naira
 * @returns {string} Formatted fare string
 */
export function formatFare(fare) {
  return `₦${fare.toLocaleString()}`;
}

/**
 * Get fare configuration (for display purposes)
 * @returns {object} Current fare configuration
 */
export function getFareConfig() {
  return {
    ...FARE_CONFIG,
    currentSurge: isPeakHour() ? FARE_CONFIG.surgePricing.peak : FARE_CONFIG.surgePricing.offPeak
  };
}

// Example usage:
/*
// Simple fare calculation
const fare1 = calculateFareByDistance(10); // 10 km ride
console.log(`Fare: ${formatFare(fare1)}`);

// Detailed fare calculation
const fare2 = calculateFare(10, 25); // 10 km, 25 minutes
console.log(`Fare: ${formatFare(fare2)}`);

// Async estimation (requires API integration)
const estimate = await estimateFareFromAddresses(
  "Lekki Phase 1, Lagos",
  "Victoria Island, Lagos"
);
console.log(`Estimated fare: ${formatFare(estimate.fare)}`);
*/

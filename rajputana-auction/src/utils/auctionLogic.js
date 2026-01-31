/**
 * Logic for the Rajputana Auction System
 */

export const PRIORITY_SCORES = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4
};

/**
 * Calculates the score for a single bidder.
 * 
 * Formula:
 * Normalized Budget = (Bidder Budget / Max Budget) * 100
 * Final Score = (Normalized Budget * Budget Weight) + (Priority Score * Priority Weight * 25)
 * 
 * @param {Object} bidder - { budget, priority_score }
 * @param {number} maxBudget - The highest budget across all bidders
 * @param {Object} settings - { budget_weight, priority_weight }
 * @returns {Object} { normalizedBudget, priorityComponent, finalScore }
 */
export function calculateScore(bidder, maxBudget, settings) {
  const { budget, priority_score } = bidder;
  const { budget_weight, priority_weight } = settings;

  // Avoid division by zero
  const safeMaxBudget = maxBudget > 0 ? maxBudget : 1;
  
  const normalizedBudget = (budget / safeMaxBudget) * 100;
  
  // Weights should sum to roughly 1.0, but we use them as multipliers directly
  const budgetComponent = normalizedBudget * budget_weight;
  
  // Priority score (1-4) * 25 -> scales to 25-100
  const priorityScaled = priority_score * 25;
  const priorityComponent = priorityScaled * priority_weight;

  const finalScore = budgetComponent + priorityComponent;

  return {
    normalizedBudget,
    budgetComponent,
    priorityScaled,
    priorityComponent,
    finalScore: Number(finalScore.toFixed(2)) // Round to 2 decimals
  };
}

/**
 * Runs the auction for a list of bidders.
 * @param {Array} bidders 
 * @param {Object} settings 
 * @returns {Array} Bidders with attached scores, sorted by score descending.
 */
export function runAuction(bidders, settings) {
  if (!bidders || bidders.length === 0) return [];

  const maxBudget = Math.max(...bidders.map(b => Number(b.budget)));

  const scoredBidders = bidders.map(bidder => {
    const calculation = calculateScore(bidder, maxBudget, settings);
    return {
      ...bidder,
      ...calculation
    };
  });

  return scoredBidders.sort((a, b) => b.finalScore - a.finalScore);
}

export function generateMissionBriefing(winner, losers, settings) {
    if (!winner) return "MISSION ABORTED. No viable candidates detected/Signal lost.";

    const winningReason = winner.finalScore > (losers[0]?.finalScore || 0) + 10 
        ? "significantly outperforming all competitors" 
        : "marking a close tactical victory";

    const keyFactor = settings.priority_weight > settings.budget_weight 
        ? "Mission Criticality" 
        : "Cost Efficiency";

    const phrases = [
        `LOG ENTRY ${new Date().toISOString().split('T')[0]}: COMMAND DECISION FINAL.`,
        `${winner.name} (ID: ${winner.bidder_id}) has been selected for the launch window.`,
        `The algorithm prioritized ${keyFactor} in this cycle.`,
        `Despite strong contention from ${losers.length} other entities, ${winner.name}'s alignment with orbital parameters was optimal.`,
        `Technical Readiness Level (TRL) of ${winner.technical_readiness}/10 was a deciding factor.`
    ];

    // Dynamic "AI" reasoning
    if (winner.budget > 40 && settings.budget_weight < 0.5) {
        phrases.push(`NOTE: High cost accepted due to strategic necessity.`);
    }
    
    if (winner.priority === 'Critical') {
        phrases.push(`URGENCY PROTOCOL: Critical payload status overrode standard budget constraints.`);
    }

    return phrases.join(" ");
}

export function generateTacticalAdvice(bidders, settings) {
    // "Nash Equilibrium" simplified advisor
    if (!bidders || bidders.length === 0) return "Awaiting opponents...";
    
    const sorted = [...bidders].sort((a,b) => (b.finalScore || 0) - (a.finalScore || 0));
    const leader = sorted[0];
    
    // Reverse engineer the score:
    // Score = (NormBudget * W_Budget * 100) + (PriorityScore * W_Priority * 25) + (Readiness * 2) - (Risk * 5)
    
    return `TACTICAL ADVISOR: To beat ${leader.name}, target a budget increase of $${(leader.budget * 1.1).toFixed(1)}M or upgrade Priority Class.`;
}

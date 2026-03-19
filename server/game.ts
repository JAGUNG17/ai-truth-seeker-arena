/**
 * Generates a unique 8-character room code
 */
export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * AI Validator: Evaluates claim truthfulness using heuristic scoring
 * Returns a score 0-100 based on Optimistic Democracy consensus principles
 * 
 * In production, this would integrate with LLM for real AI consensus validation
 */
export async function validateClaimWithAI(
  claim: string,
  topic: string
): Promise<{ score: number; explanation: string }> {
  try {
    let score = 50;
    let explanation = "Claim evaluated based on quality metrics.";

    if (claim.length > 100) score += 15;
    if (claim.length > 200) score += 10;

    if (claim === claim.toUpperCase() && claim.length > 5) score -= 20;

    if (claim.match(/\d{4}|\d+%|according to|research|study/i)) score += 15;

    if (claim.match(/however|but|although|while|conversely/i)) score += 10;

    const exclamationCount = (claim.match(/!/g) || []).length;
    if (exclamationCount > 3) score -= 15;

    score = Math.min(100, Math.max(0, score));
    return { score, explanation };
  } catch (error) {
    console.error("Validation Error:", error);
    return {
      score: 50,
      explanation: "Validation service temporarily unavailable.",
    };
  }
}

/**
 * Calculate XP distribution based on final ranking
 * Top players earn more XP
 */
export function calculateXPDistribution(
  playerRanking: number,
  totalPlayers: number
): number {
  const baseXP = 100;
  const rankingBonus = Math.max(0, (totalPlayers - playerRanking + 1) * 10);
  return baseXP + rankingBonus;
}

/**
 * Calculate final player rankings based on total scores
 */
export function calculateFinalRankings(
  playerScores: Array<{ playerId: number; totalScore: number }>
): Array<{ playerId: number; ranking: number }> {
  return playerScores
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((player, index) => ({
      playerId: player.playerId,
      ranking: index + 1,
    }));
}

/**
 * Weekly challenge categories and topics
 */
const CHALLENGE_CATEGORIES = {
  science: [
    "The Earth orbits the Sun",
    "Water boils at 100 degrees Celsius at sea level",
    "DNA contains genetic information",
    "Photosynthesis produces oxygen",
    "The human body has 206 bones",
  ],
  history: [
    "The Great Wall of China was built over many centuries",
    "The Renaissance began in Italy",
    "World War II ended in 1945",
    "The Industrial Revolution started in Britain",
    "Ancient Rome fell in 476 AD",
  ],
  technology: [
    "The internet was invented in the 1960s",
    "Artificial Intelligence uses machine learning",
    "Blockchain technology is decentralized",
    "Quantum computers use qubits",
    "5G networks are faster than 4G",
  ],
  geography: [
    "The Sahara is the largest hot desert",
    "Mount Everest is the tallest mountain",
    "The Amazon rainforest produces oxygen",
    "The Nile is the longest river",
    "Tokyo is the capital of Japan",
  ],
};

/**
 * Generate a random weekly challenge
 */
export function generateWeeklyChallenge(): {
  topic: string;
  category: string;
  description: string;
} {
  const categories = Object.keys(CHALLENGE_CATEGORIES) as Array<
    keyof typeof CHALLENGE_CATEGORIES
  >;
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];
  const topics = CHALLENGE_CATEGORIES[randomCategory];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];

  return {
    topic: randomTopic,
    category: randomCategory,
    description: `This week's challenge focuses on ${randomCategory}. Submit claims related to: "${randomTopic}"`,
  };
}

/**
 * Validate if a claim is related to the challenge topic
 */
export function isClaimRelatedToTopic(claim: string, topic: string): boolean {
  const claimLower = claim.toLowerCase();
  const topicWords = topic.toLowerCase().split(" ");
  return topicWords.some((word) => claimLower.includes(word));
}

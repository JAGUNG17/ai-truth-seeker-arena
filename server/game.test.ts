import { describe, it, expect } from "vitest";
import {
  generateRoomCode,
  validateClaimWithAI,
  calculateXPDistribution,
  calculateFinalRankings,
  generateWeeklyChallenge,
  isClaimRelatedToTopic,
} from "./game";

describe("Game Logic", () => {
  describe("generateRoomCode", () => {
    it("should generate an 8-character room code", () => {
      const code = generateRoomCode();
      expect(code).toHaveLength(8);
    });

    it("should only contain alphanumeric characters", () => {
      const code = generateRoomCode();
      expect(/^[A-Z0-9]{8}$/.test(code)).toBe(true);
    });

    it("should generate different codes", () => {
      const code1 = generateRoomCode();
      const code2 = generateRoomCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe("validateClaimWithAI", () => {
    it("should return a score between 0 and 100", async () => {
      const result = await validateClaimWithAI(
        "The Earth orbits the Sun",
        "astronomy"
      );
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it("should return an explanation", async () => {
      const result = await validateClaimWithAI(
        "Water boils at 100 degrees Celsius",
        "science"
      );
      expect(result.explanation).toBeDefined();
      expect(result.explanation.length).toBeGreaterThan(0);
    });

    it("should give higher scores to longer, detailed claims", async () => {
      const shortClaim = "True";
      const longClaim =
        "According to research, the Earth orbits the Sun in an elliptical path, completing one orbit every 365.25 days, which is why we have leap years.";

      const shortResult = await validateClaimWithAI(shortClaim, "science");
      const longResult = await validateClaimWithAI(longClaim, "science");

      expect(longResult.score).toBeGreaterThan(shortResult.score);
    });

    it("should penalize claims with excessive punctuation", async () => {
      const normalClaim = "The Earth orbits the Sun";
      const spammyClaim = "The Earth orbits the Sun!!!!!!";

      const normalResult = await validateClaimWithAI(normalClaim, "science");
      const spammyResult = await validateClaimWithAI(spammyClaim, "science");

      expect(spammyResult.score).toBeLessThan(normalResult.score);
    });

    it("should penalize all-caps claims", async () => {
      const normalClaim = "The Earth orbits the Sun";
      const capsLockClaim = "THE EARTH ORBITS THE SUN";

      const normalResult = await validateClaimWithAI(normalClaim, "science");
      const capsResult = await validateClaimWithAI(capsLockClaim, "science");

      expect(capsResult.score).toBeLessThan(normalResult.score);
    });
  });

  describe("calculateXPDistribution", () => {
    it("should give more XP to higher rankings", () => {
      const xp1st = calculateXPDistribution(1, 10);
      const xp5th = calculateXPDistribution(5, 10);
      const xp10th = calculateXPDistribution(10, 10);

      expect(xp1st).toBeGreaterThan(xp5th);
      expect(xp5th).toBeGreaterThan(xp10th);
    });

    it("should return at least base XP (100)", () => {
      const xp = calculateXPDistribution(10, 10);
      expect(xp).toBeGreaterThanOrEqual(100);
    });

    it("should scale with number of players", () => {
      const xp2Players = calculateXPDistribution(1, 2);
      const xp10Players = calculateXPDistribution(1, 10);

      expect(xp10Players).toBeGreaterThan(xp2Players);
    });
  });

  describe("calculateFinalRankings", () => {
    it("should rank players by score in descending order", () => {
      const players = [
        { playerId: 1, totalScore: 50 },
        { playerId: 2, totalScore: 100 },
        { playerId: 3, totalScore: 75 },
      ];

      const rankings = calculateFinalRankings(players);

      expect(rankings[0].playerId).toBe(2);
      expect(rankings[0].ranking).toBe(1);
      expect(rankings[1].playerId).toBe(3);
      expect(rankings[1].ranking).toBe(2);
      expect(rankings[2].playerId).toBe(1);
      expect(rankings[2].ranking).toBe(3);
    });

    it("should handle ties by maintaining order", () => {
      const players = [
        { playerId: 1, totalScore: 100 },
        { playerId: 2, totalScore: 100 },
      ];

      const rankings = calculateFinalRankings(players);

      expect(rankings).toHaveLength(2);
      expect(rankings[0].ranking).toBe(1);
      expect(rankings[1].ranking).toBe(2);
    });

    it("should handle single player", () => {
      const players = [{ playerId: 1, totalScore: 50 }];

      const rankings = calculateFinalRankings(players);

      expect(rankings).toHaveLength(1);
      expect(rankings[0].ranking).toBe(1);
    });
  });

  describe("generateWeeklyChallenge", () => {
    it("should generate a challenge with topic, category, and description", () => {
      const challenge = generateWeeklyChallenge();

      expect(challenge.topic).toBeDefined();
      expect(challenge.category).toBeDefined();
      expect(challenge.description).toBeDefined();
    });

    it("should have a valid category", () => {
      const challenge = generateWeeklyChallenge();
      const validCategories = ["science", "history", "technology", "geography"];

      expect(validCategories).toContain(challenge.category);
    });

    it("should generate different challenges", () => {
      const challenge1 = generateWeeklyChallenge();
      const challenge2 = generateWeeklyChallenge();

      // At least one property should be different (statistically very likely)
      const isDifferent =
        challenge1.topic !== challenge2.topic ||
        challenge1.category !== challenge2.category;

      expect(isDifferent).toBe(true);
    });
  });

  describe("isClaimRelatedToTopic", () => {
    it("should return true for related claims", () => {
      const claim = "The Earth is a planet that orbits the Sun";
      const topic = "Earth orbits the Sun";

      expect(isClaimRelatedToTopic(claim, topic)).toBe(true);
    });

    it("should be case-insensitive", () => {
      const claim = "WATER BOILS AT 100 DEGREES";
      const topic = "water boils";

      expect(isClaimRelatedToTopic(claim, topic)).toBe(true);
    });

    it("should return false for unrelated claims", () => {
      const claim = "The sky is blue";
      const topic = "quantum physics";

      expect(isClaimRelatedToTopic(claim, topic)).toBe(false);
    });

    it("should handle partial word matches", () => {
      const claim = "Renaissance art was beautiful";
      const topic = "The Renaissance began in Italy";

      expect(isClaimRelatedToTopic(claim, topic)).toBe(true);
    });
  });
});

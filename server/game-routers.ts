import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createGameSession,
  getGameSessionByRoomCode,
  addPlayerToSession,
  getSessionPlayers,
  createRound,
  getCurrentRound,
  submitClaim,
  updateClaimValidation,
  getRoundClaims,
  getCurrentWeeklyChallenge,
  getSessionLeaderboard,
  createLeaderboardEntry,
  updateGameSessionStatus,
  updatePlayerScore,
  type GameSession,
  type Player,
} from "./db";
import {
  generateRoomCode,
  validateClaimWithAI,
  calculateXPDistribution,
  calculateFinalRankings,
  generateWeeklyChallenge,
} from "./game";

// Helper to get player record by user and session
async function getPlayerRecord(userId: number, sessionId: number) {
  const players = await getSessionPlayers(sessionId);
  return players.find((p) => p.userId === userId);
}

export const gameRouter = router({
  /**
   * Create a new game session (room)
   */
  createSession: protectedProcedure
    .input(z.object({ totalRounds: z.number().min(1).max(10).default(5) }))
    .mutation(async ({ input }) => {
      const roomCode = generateRoomCode();
      await createGameSession(roomCode, input.totalRounds);
      const session = await getGameSessionByRoomCode(roomCode);
      return { roomCode, sessionId: session?.id };
    }),

  /**
   * Join an existing game session
   */
  joinSession: protectedProcedure
    .input(z.object({ roomCode: z.string().length(8) }))
    .mutation(async ({ ctx, input }) => {
      const session = await getGameSessionByRoomCode(input.roomCode);
      if (!session) throw new Error("Room not found");
      if (session.status !== "waiting")
        throw new Error("Game already started or finished");

      await addPlayerToSession(ctx.user.id, session.id);
      return { sessionId: session.id, session };
    }),

  /**
   * Get current game session status
   */
  getSessionStatus: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      // In production, would fetch from database
      // For now, return mock data
      return {
        sessionId: input.sessionId,
        status: "active",
        currentRound: 1,
        totalRounds: 5,
      };
    }),

  /**
   * Get all players in a session
   */
  getSessionPlayers: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      const players = await getSessionPlayers(input.sessionId);
      return players;
    }),

  /**
   * Submit a claim for the current round
   */
  submitClaim: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        statement: z.string().min(10).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const player = await getPlayerRecord(ctx.user.id, input.sessionId);
      if (!player) throw new Error("Player not in session");

      const round = await getCurrentRound(input.sessionId);
      if (!round) throw new Error("No active round");

      await submitClaim(player.id, round.id, input.statement);

      // Validate the claim with AI
      const challenge = await getCurrentWeeklyChallenge();
      const validation = await validateClaimWithAI(
        input.statement,
        challenge?.topic || "general"
      );

      // Update player score
      await updatePlayerScore(player.id, validation.score);

      return {
        score: validation.score,
        explanation: validation.explanation,
      };
    }),

  /**
   * Get leaderboard for a session
   */
  getLeaderboard: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      const leaderboard = await getSessionLeaderboard(input.sessionId);
      return leaderboard;
    }),

  /**
   * Get current weekly challenge
   */
  getWeeklyChallenge: publicProcedure.query(async () => {
    let challenge = await getCurrentWeeklyChallenge();
    if (!challenge) {
      const generated = generateWeeklyChallenge();
      return generated;
    }
    return challenge;
  }),

  /**
   * Start a game session (transition from waiting to active)
   */
  startSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ input }) => {
      await updateGameSessionStatus(input.sessionId, "active");
      await createRound(input.sessionId, 1);
      return { success: true };
    }),

  /**
   * End a game session and calculate final rankings
   */
  endSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ input }) => {
      const players = await getSessionPlayers(input.sessionId);
      const playerScores = players.map((p) => ({
        playerId: p.id,
        totalScore: p.totalScore,
      }));

      const rankings = calculateFinalRankings(playerScores);

      // Create leaderboard entries and calculate XP
      for (const ranking of rankings) {
        const xp = calculateXPDistribution(ranking.ranking, players.length);
        await createLeaderboardEntry(
          input.sessionId,
          ranking.playerId,
          ranking.ranking,
          playerScores.find((p) => p.playerId === ranking.playerId)?.totalScore ||
            0,
          xp
        );
      }

      await updateGameSessionStatus(input.sessionId, "finished");
      return { rankings, success: true };
    }),
});

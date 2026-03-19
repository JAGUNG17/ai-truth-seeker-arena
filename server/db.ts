import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, gameSessions, players, rounds, claims, weeklyChallenges, leaderboards } from "../drizzle/schema";
import { ENV } from './_core/env';

export type { GameSession, Player, Round, Claim, WeeklyChallenge, Leaderboard } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Game Session Queries
 */
export async function createGameSession(roomCode: string, totalRounds: number = 5) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(gameSessions).values({
    roomCode,
    totalRounds,
    status: 'waiting',
  });
  
  return result;
}

export async function getGameSessionByRoomCode(roomCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(gameSessions)
    .where(eq(gameSessions.roomCode, roomCode))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateGameSessionStatus(sessionId: number, status: 'waiting' | 'active' | 'finished') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(gameSessions)
    .set({ status, updatedAt: new Date() })
    .where(eq(gameSessions.id, sessionId));
}

/**
 * Player Queries
 */
export async function addPlayerToSession(userId: number, sessionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(players).values({
    userId,
    sessionId,
    status: 'joined',
  });
  
  return result;
}

export async function getSessionPlayers(sessionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(players)
    .where(eq(players.sessionId, sessionId));
  
  return result;
}

export async function updatePlayerScore(playerId: number, scoreIncrease: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(players)
    .set({ totalScore: sql`${players.totalScore} + ${scoreIncrease}` })
    .where(eq(players.id, playerId));
}

/**
 * Round Queries
 */
export async function createRound(sessionId: number, roundNumber: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(rounds).values({
    sessionId,
    roundNumber,
    status: 'active',
  });
  
  return result;
}

export async function getCurrentRound(sessionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(rounds)
    .where(eq(rounds.sessionId, sessionId))
    .orderBy(rounds.roundNumber)
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

/**
 * Claim Queries
 */
export async function submitClaim(playerId: number, roundId: number, statement: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(claims).values({
    playerId,
    roundId,
    statement,
  });
  
  return result;
}

export async function updateClaimValidation(claimId: number, score: number, explanation: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(claims)
    .set({ 
      validationScore: score, 
      consensusExplanation: explanation,
      validatedAt: new Date()
    })
    .where(eq(claims.id, claimId));
}

export async function getRoundClaims(roundId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(claims)
    .where(eq(claims.roundId, roundId));
  
  return result;
}

/**
 * Weekly Challenge Queries
 */
export async function getCurrentWeeklyChallenge() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const now = new Date();
  const result = await db.select().from(weeklyChallenges)
    .where(sql`${weeklyChallenges.validFrom} <= ${now} AND ${now} <= ${weeklyChallenges.validUntil}`)
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function createWeeklyChallenge(weekNumber: number, topic: string, category: string, description: string, validFrom: Date, validUntil: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(weeklyChallenges).values({
    weekNumber,
    topic,
    category,
    description,
    validFrom,
    validUntil,
  });
  
  return result;
}

/**
 * Leaderboard Queries
 */
export async function getSessionLeaderboard(sessionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(leaderboards)
    .where(eq(leaderboards.sessionId, sessionId))
    .orderBy(leaderboards.ranking);
  
  return result;
}

export async function createLeaderboardEntry(sessionId: number, playerId: number, ranking: number, score: number, xpEarned: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(leaderboards).values({
    sessionId,
    playerId,
    ranking,
    score,
    xpEarned,
  });
  
  return result;
}

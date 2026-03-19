import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Game Sessions: Represents a multiplayer game room
 * Each session has a unique room code and manages players
 */
export const gameSessions = mysqlTable("game_sessions", {
  id: int("id").autoincrement().primaryKey(),
  roomCode: varchar("roomCode", { length: 8 }).notNull().unique(), // Unique 8-char room code
  status: mysqlEnum("status", ["waiting", "active", "finished"]).default("waiting").notNull(),
  maxPlayers: int("maxPlayers").default(8).notNull(),
  totalRounds: int("totalRounds").default(5).notNull(),
  currentRound: int("currentRound").default(0).notNull(),
  weeklyChallengeTopic: varchar("weeklyChallengeTopic", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  startedAt: timestamp("startedAt"),
  endedAt: timestamp("endedAt"),
});

export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = typeof gameSessions.$inferInsert;

/**
 * Players: Tracks player participation in game sessions
 */
export const players = mysqlTable("players", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sessionId: int("sessionId").notNull(),
  totalScore: int("totalScore").default(0).notNull(),
  xpEarned: int("xpEarned").default(0).notNull(),
  finalRanking: int("finalRanking"),
  status: mysqlEnum("status", ["joined", "active", "finished", "left"]).default("joined").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  leftAt: timestamp("leftAt"),
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;

/**
 * Rounds: Represents each round within a game session
 */
export const rounds = mysqlTable("rounds", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  roundNumber: int("roundNumber").notNull(),
  status: mysqlEnum("status", ["active", "finished"]).default("active").notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  endedAt: timestamp("endedAt"),
});

export type Round = typeof rounds.$inferSelect;
export type InsertRound = typeof rounds.$inferInsert;

/**
 * Claims: Player claims/statements submitted during each round
 */
export const claims = mysqlTable("claims", {
  id: int("id").autoincrement().primaryKey(),
  playerId: int("playerId").notNull(),
  roundId: int("roundId").notNull(),
  statement: text("statement").notNull(),
  validationScore: int("validationScore"), // 0-100 based on AI consensus
  consensusExplanation: text("consensusExplanation"), // Why AI gave this score
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  validatedAt: timestamp("validatedAt"),
});

export type Claim = typeof claims.$inferSelect;
export type InsertClaim = typeof claims.$inferInsert;

/**
 * Weekly Challenges: Rotating challenge topics for weekly replayability
 */
export const weeklyChallenges = mysqlTable("weekly_challenges", {
  id: int("id").autoincrement().primaryKey(),
  weekNumber: int("weekNumber").notNull(),
  topic: varchar("topic", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // e.g., "science", "history", "technology"
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  validFrom: timestamp("validFrom").notNull(),
  validUntil: timestamp("validUntil").notNull(),
});

export type WeeklyChallenge = typeof weeklyChallenges.$inferSelect;
export type InsertWeeklyChallenge = typeof weeklyChallenges.$inferInsert;

/**
 * Leaderboards: Cached leaderboard snapshots for performance
 */
export const leaderboards = mysqlTable("leaderboards", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  playerId: int("playerId").notNull(),
  ranking: int("ranking").notNull(),
  score: int("score").notNull(),
  xpEarned: int("xpEarned").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Leaderboard = typeof leaderboards.$inferSelect;
export type InsertLeaderboard = typeof leaderboards.$inferInsert;
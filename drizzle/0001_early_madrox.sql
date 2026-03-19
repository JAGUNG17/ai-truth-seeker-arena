CREATE TABLE `claims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playerId` int NOT NULL,
	`roundId` int NOT NULL,
	`statement` text NOT NULL,
	`validationScore` int,
	`consensusExplanation` text,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`validatedAt` timestamp,
	CONSTRAINT `claims_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomCode` varchar(8) NOT NULL,
	`status` enum('waiting','active','finished') NOT NULL DEFAULT 'waiting',
	`maxPlayers` int NOT NULL DEFAULT 8,
	`totalRounds` int NOT NULL DEFAULT 5,
	`currentRound` int NOT NULL DEFAULT 0,
	`weeklyChallengeTopic` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`startedAt` timestamp,
	`endedAt` timestamp,
	CONSTRAINT `game_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `game_sessions_roomCode_unique` UNIQUE(`roomCode`)
);
--> statement-breakpoint
CREATE TABLE `leaderboards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`playerId` int NOT NULL,
	`ranking` int NOT NULL,
	`score` int NOT NULL,
	`xpEarned` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leaderboards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sessionId` int NOT NULL,
	`totalScore` int NOT NULL DEFAULT 0,
	`xpEarned` int NOT NULL DEFAULT 0,
	`finalRanking` int,
	`status` enum('joined','active','finished','left') NOT NULL DEFAULT 'joined',
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`leftAt` timestamp,
	CONSTRAINT `players_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rounds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`roundNumber` int NOT NULL,
	`status` enum('active','finished') NOT NULL DEFAULT 'active',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	CONSTRAINT `rounds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weekly_challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`weekNumber` int NOT NULL,
	`topic` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`validFrom` timestamp NOT NULL,
	`validUntil` timestamp NOT NULL,
	CONSTRAINT `weekly_challenges_id` PRIMARY KEY(`id`)
);

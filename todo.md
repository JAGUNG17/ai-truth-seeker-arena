# AI Truth-Seeker Arena - Project TODO

## Database & Schema
- [x] Design game_sessions table (room management, status, timestamps)
- [x] Design players table (user-session relationship, scores, XP)
- [x] Design rounds table (round number, status, timestamp)
- [x] Design claims table (player claims, AI validation scores)
- [x] Design weekly_challenges table (challenge topics, categories, timestamps)
- [x] Design leaderboards table (cached leaderboard data)
- [x] Create and apply database migrations

## Backend - Core Game Logic
- [x] Create tRPC procedure: createGameSession (room creation with unique code)
- [x] Create tRPC procedure: joinGameSession (join existing room)
- [ ] Create tRPC procedure: leaveGameSession (player exit)
- [x] Create tRPC procedure: submitClaim (player submits statement for validation)
- [x] Create tRPC procedure: getGameStatus (fetch current game state)
- [x] Create tRPC procedure: getLeaderboard (real-time leaderboard data)
- [ ] Implement game session auto-cleanup (5-15 min timeout)
- [x] Implement round management logic (advance rounds, end game)

## Backend - AI Validator & Consensus
- [x] Integrate heuristic-based validation for MVP
- [x] Implement Optimistic Democracy consensus scoring
- [x] Create validation scoring system (0-100 score based on consensus)
- [x] Implement consensus explanation generation

## Backend - Weekly Challenges & XP
- [x] Create weekly challenge generation system
- [x] Implement XP distribution based on final ranking
- [x] Create procedure: getWeeklyChallenge
- [ ] Create procedure: getPlayerStats (XP, total games, ranking)

## Frontend - Layout & Navigation
- [x] Create main layout with header and navigation
- [x] Design clean, functional UI theme
- [x] Create landing/lobby page

## Frontend - Game Lobby
- [x] Create "Create Room" dialog
- [x] Create "Join Room" dialog with code input
- [ ] Display active rooms and player counts
- [x] Show weekly challenge info on lobby

## Frontend - Gameplay Interface
- [x] Create game room view with room code display
- [x] Create claim submission form (text input)
- [x] Display current round info and timer
- [x] Show player list with real-time status
- [x] Create claim validation feedback display
- [ ] Implement round-by-round progression UI

## Frontend - Leaderboard
- [x] Create real-time leaderboard display
- [x] Show player rankings with scores
- [x] Display XP earned in current session
- [ ] Add final game summary with XP distribution

## Frontend - Game Instructions & Education
- [x] Create tutorial/instructions page explaining Intelligent Contracts
- [x] Create tutorial/instructions page explaining Optimistic Democracy
- [x] Add in-game tooltips and explanations
- [ ] Create help/FAQ section

## Frontend - Real-time Updates
- [x] Implement polling for real-time leaderboard updates
- [x] Implement real-time player join/leave notifications
- [ ] Implement real-time round progression

## Testing & Quality
- [x] Write vitest tests for game logic procedures
- [x] Write vitest tests for AI validation scoring
- [x] Write vitest tests for XP distribution
- [ ] Test multiplayer scenarios (concurrent joins, claims)
- [ ] Test session auto-cleanup
- [ ] Manual testing of full game flow

## Documentation & GitHub
- [ ] Write comprehensive README.md
- [ ] Document game mechanics and rules
- [ ] Document Intelligent Contracts concept
- [ ] Document Optimistic Democracy consensus
- [ ] Create GitHub repository (public)
- [ ] Upload code and documentation

## Deployment & Final
- [ ] Create checkpoint before GitHub publication
- [ ] Verify all features working
- [ ] Test on different browsers/devices

# AI Truth-Seeker Arena🍗

A multiplayer web-based mini-game that teaches **Intelligent Contracts** and **Optimistic Democracy** through engaging gameplay. Players submit claims and compete based on AI consensus validation, earning XP based on their final ranking.

## Overview

**AI Truth-Seeker Arena** is an educational game designed for GenLayer's community gatherings. It showcases how decentralized consensus mechanisms work by simulating an intelligent contract validator that scores player claims based on quality and accuracy metrics.

### Key Features

- **Multiplayer Rooms**: Create or join game sessions with unique 8-character room codes
- **AI Claim Validation**: Submit claims that are evaluated by an AI validator using consensus scoring
- **Round-Based Gameplay**: 5 rounds per game, each lasting 5-15 minutes
- **Real-Time Leaderboard**: Track player rankings and scores during gameplay
- **XP Distribution**: Earn XP based on final ranking (top performers earn more)
- **Weekly Challenges**: Rotating topics and categories for replayability
- **Educational Content**: Learn about Intelligent Contracts and Optimistic Democracy through gameplay

## How It Works

### Intelligent Contracts

In traditional blockchain systems, **smart contracts** are self-executing agreements with terms written into code. In AI Truth-Seeker Arena, the AI validator acts like an intelligent contract—it objectively evaluates claims based on predefined rules and metrics.

The validator scores each claim on a scale of 0-100:
- **80-100**: Highly accurate, well-reasoned, and detailed
- **60-79**: Mostly accurate with minor issues
- **40-59**: Partially true but contains significant inaccuracies
- **20-39**: Mostly inaccurate with some true elements
- **0-19**: Completely false or low quality

### Optimistic Democracy

**Optimistic Democracy** is a consensus mechanism where validators assume claims are truthful by default and only challenge them if they detect issues. In AI Truth-Seeker Arena, this principle is reflected in how players compete fairly in a decentralized system:

- All players have equal opportunity to submit claims
- The AI validator provides objective, transparent scoring
- Rankings are determined purely by claim quality
- Top performers are rewarded with more XP

This creates a fair, merit-based competition where honest and well-reasoned submissions are rewarded.

## Game Mechanics

### Starting a Game

1. **Create a Room**: Click "Create Room" to start a new game session. You'll receive an 8-character room code.
2. **Invite Players**: Share the room code with friends to let them join.
3. **Join a Room**: Enter an 8-character room code to join an existing game.

### During Gameplay

1. **View the Challenge**: Each week features a different topic (science, history, technology, geography).
2. **Submit Claims**: Write statements related to the weekly topic (minimum 10 characters).
3. **Get Scored**: The AI validator scores your claim (0-100) and provides an explanation.
4. **Compete**: Your score is added to your total. Compete across 5 rounds.
5. **Track Progress**: Watch the real-time leaderboard to see how you rank against other players.

### End of Game

- Final rankings are calculated based on total score
- XP is distributed: 1st place gets the most XP, last place gets the least
- Base XP: 100 + (number_of_players - ranking + 1) × 10

### Scoring Criteria

The AI validator evaluates claims based on:

- **Length & Detail**: Longer, more detailed claims score higher
- **Balanced Language**: Claims with qualifying words (however, but, although) score higher
- **Specific Information**: Claims with dates, percentages, or citations score higher
- **Quality**: All-caps claims or those with excessive punctuation score lower

## Technical Stack

- **Frontend**: React 19 + Tailwind CSS 4 + TypeScript
- **Backend**: Express 4 + tRPC 11 + Node.js
- **Database**: MySQL with Drizzle ORM
- **Authentication**: Manus OAuth
- **Testing**: Vitest

## Project Structure

```
ai-truth-seeker-arena/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx           # Landing page with auth
│   │   │   ├── Lobby.tsx          # Room creation/joining
│   │   │   └── GameRoom.tsx       # Main gameplay interface
│   │   ├── components/            # Reusable UI components
│   │   ├── lib/trpc.ts           # tRPC client
│   │   └── App.tsx               # Router setup
│   └── index.html
├── server/                 # Express backend
│   ├── game.ts            # Core game logic
│   ├── game-routers.ts    # tRPC procedures
│   ├── game.test.ts       # Unit tests
│   ├── db.ts              # Database helpers
│   └── routers.ts         # Main router
├── drizzle/               # Database schema
│   ├── schema.ts          # Table definitions
│   └── migrations/        # SQL migrations
└── package.json
```

## Database Schema

### Tables

- **game_sessions**: Represents a multiplayer game room
- **players**: Tracks player participation and scores
- **rounds**: Represents each round within a session
- **claims**: Player claims/statements with validation scores
- **weekly_challenges**: Rotating challenge topics
- **leaderboards**: Cached leaderboard snapshots

## API Endpoints (tRPC)

### Game Procedures

- `game.createSession()`: Create a new game room
- `game.joinSession(roomCode)`: Join an existing room
- `game.getSessionStatus(sessionId)`: Get current game state
- `game.getSessionPlayers(sessionId)`: Get list of players
- `game.submitClaim(sessionId, statement)`: Submit a claim for validation
- `game.getLeaderboard(sessionId)`: Get current leaderboard
- `game.getWeeklyChallenge()`: Get this week's challenge topic
- `game.startSession(sessionId)`: Start the game
- `game.endSession(sessionId)`: End the game and calculate rankings

## Installation & Setup

### Prerequisites

- Node.js 22+
- pnpm package manager
- MySQL database

### Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run database migrations
pnpm drizzle-kit generate
pnpm drizzle-kit migrate

# Start development server
pnpm dev

# Run tests
pnpm test
```

### Build

```bash
pnpm build
pnpm start
```

## Testing

The project includes comprehensive unit tests for game logic:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Test Coverage

- Room code generation
- Claim validation scoring
- XP distribution calculations
- Final ranking calculations
- Weekly challenge generation
- Claim-topic relevance checking

## Future Enhancements

- **LLM Integration**: Replace heuristic validation with real LLM-based AI consensus
- **Real-Time Multiplayer**: Implement WebSocket for true real-time gameplay
- **Advanced Analytics**: Track player statistics and performance over time
- **Seasonal Leaderboards**: Maintain global leaderboards across multiple games
- **Achievements & Badges**: Reward players for specific accomplishments
- **Mobile App**: React Native version for mobile devices
- **Social Features**: Friend lists, game invitations, chat

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Contact

For questions or feedback about AI Truth-Seeker Arena, please reach out to the GenLayer community on Discord.

---

**Built for GenLayer's Community** | Learn blockchain concepts through gameplay

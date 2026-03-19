import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function GameRoom() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [claim, setClaim] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastScore, setLastScore] = useState<{ score: number; explanation: string } | null>(null);

  const sessionIdNum = parseInt(sessionId || "0", 10);

  // Fetch game status
  const { data: gameStatus } = trpc.game.getSessionStatus.useQuery(
    { sessionId: sessionIdNum },
    { enabled: !!sessionIdNum }
  );

  // Fetch players
  const { data: players } = trpc.game.getSessionPlayers.useQuery(
    { sessionId: sessionIdNum },
    { enabled: !!sessionIdNum, refetchInterval: 2000 }
  );

  // Fetch leaderboard
  const { data: leaderboard } = trpc.game.getLeaderboard.useQuery(
    { sessionId: sessionIdNum },
    { enabled: !!sessionIdNum, refetchInterval: 3000 }
  );

  // Fetch weekly challenge
  const { data: challenge } = trpc.game.getWeeklyChallenge.useQuery();

  // Submit claim mutation
  const submitClaimMutation = trpc.game.submitClaim.useMutation();

  const handleSubmitClaim = async () => {
    if (!claim.trim() || claim.length < 10) {
      alert("Claim must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitClaimMutation.mutateAsync({
        sessionId: sessionIdNum,
        statement: claim,
      });
      setLastScore(result);
      setClaim("");
    } catch (error) {
      console.error("Failed to submit claim:", error);
      alert("Failed to submit claim. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sessionIdNum) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Invalid session. Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Game Room</h1>
          <p className="text-slate-600">Round {gameStatus?.currentRound || 1} of {gameStatus?.totalRounds || 5}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Challenge */}
            {challenge && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">This Week's Challenge</CardTitle>
                  <CardDescription>{challenge.category.toUpperCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 font-semibold mb-2">{challenge.topic}</p>
                  <p className="text-sm text-slate-600">{challenge.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Claim Submission */}
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Claim</CardTitle>
                <CardDescription>
                  Share a statement related to this week's topic. The AI validator will score it based on quality and accuracy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  placeholder="Enter your claim here (minimum 10 characters)..."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">
                    {claim.length}/500 characters
                  </span>
                  <Button
                    onClick={handleSubmitClaim}
                    disabled={isSubmitting || claim.length < 10}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      "Submit Claim"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Last Score */}
            {lastScore && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold text-green-900">
                      Validation Score: {lastScore.score}/100
                    </p>
                    <p className="text-sm text-green-800">
                      {lastScore.explanation}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Sidebar: Players & Leaderboard */}
          <div className="space-y-6">
            {/* Players in Room */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Players ({players?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {players?.map((player) => (
                    <div
                      key={player.id}
                      className="p-2 bg-slate-50 rounded flex justify-between items-center"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        Player {player.userId}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {player.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard && leaderboard.length > 0 ? (
                    leaderboard.slice(0, 5).map((entry) => (
                      <div
                        key={entry.id}
                        className="flex justify-between items-center p-2 bg-slate-50 rounded"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            #{entry.ranking}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-600">
                            {entry.score} pts
                          </p>
                          <p className="text-xs text-slate-600">
                            {entry.xpEarned} XP
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600">No scores yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Game Info */}
            <Card className="bg-slate-50">
              <CardHeader>
                <CardTitle className="text-sm">How Scoring Works</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-2">
                <p>
                  <strong>80-100:</strong> Highly accurate, well-reasoned
                </p>
                <p>
                  <strong>60-79:</strong> Mostly accurate with minor issues
                </p>
                <p>
                  <strong>40-59:</strong> Partially true, some inaccuracies
                </p>
                <p>
                  <strong>0-39:</strong> Mostly false or low quality
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

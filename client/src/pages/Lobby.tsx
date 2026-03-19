import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function Lobby() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createSessionMutation = trpc.game.createSession.useMutation();
  const joinSessionMutation = trpc.game.joinSession.useMutation();

  const handleCreateRoom = async () => {
    setIsLoading(true);
    try {
      const result = await createSessionMutation.mutateAsync({ totalRounds: 5 });
      if (result.sessionId) {
        setLocation(`/game/${result.sessionId}`);
      }
    } catch (error) {
      console.error("Failed to create room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return;
    setIsLoading(true);
    try {
      const result = await joinSessionMutation.mutateAsync({ roomCode });
      if (result.sessionId) {
        setLocation(`/game/${result.sessionId}`);
      }
    } catch (error) {
      console.error("Failed to join room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            AI Truth-Seeker Arena
          </h1>
          <p className="text-lg text-slate-600">
            Learn Intelligent Contracts & Optimistic Democracy Through Gameplay
          </p>
        </div>

        {/* Welcome Card */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Welcome, {user?.name || "Player"}!</CardTitle>
            <CardDescription>
              Join a multiplayer game where you submit claims and compete based on AI consensus validation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Each game consists of 5 rounds. Submit your best claims and earn XP based on your final ranking.
            </p>
          </CardContent>
        </Card>

        {/* Game Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Create Room */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Create a Room</CardTitle>
              <CardDescription>
                Start a new game and invite friends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Create a new game room with a unique code. Share the code with friends to let them join.
              </p>
              <Button
                onClick={handleCreateRoom}
                disabled={isLoading}
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Room"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Join Room */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Join a Room</CardTitle>
              <CardDescription>
                Enter a room code to join an existing game
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter 8-character room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={8}
                className="font-mono text-center text-lg tracking-widest"
              />
              <Button
                onClick={handleJoinRoom}
                disabled={isLoading || roomCode.length !== 8}
                size="lg"
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Room"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Game Concepts */}
        <Card className="border-0 shadow-lg bg-blue-50">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Intelligent Contracts</h3>
                <p className="text-sm text-slate-600">
                  Your claims are evaluated by an AI validator using a consensus mechanism. The validator acts like a smart contract, objectively scoring your statements based on quality and accuracy.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Optimistic Democracy</h3>
                <p className="text-sm text-slate-600">
                  Players compete fairly in a decentralized consensus system. Your ranking is determined by how well your claims perform against the AI validator, promoting honest and well-reasoned submissions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import Lobby from "./Lobby";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-4xl font-bold text-slate-900">
            AI Truth-Seeker Arena
          </h1>
          <p className="text-lg text-slate-600">
            Learn Intelligent Contracts & Optimistic Democracy Through Multiplayer Gameplay
          </p>
          <p className="text-sm text-slate-500">
            Submit claims, compete with other players, and earn XP based on AI consensus validation.
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            size="lg"
            className="w-full"
          >
            Sign In to Play
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">
            AI Truth-Seeker Arena
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Welcome, {user?.name || "Player"}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main>
        <Lobby />
      </main>
    </div>
  );
}

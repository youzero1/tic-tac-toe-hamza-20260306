import Leaderboard from '@/components/Leaderboard';

export const dynamic = 'force-dynamic';

export default function LeaderboardPage() {
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">🏆 Leaderboard</h1>
        <p className="page-subtitle">Top players ranked by wins and win percentage.</p>
      </div>
      <Leaderboard />
    </div>
  );
}

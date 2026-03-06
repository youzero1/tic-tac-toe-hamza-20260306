import { NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Player } from '@/entities/Player';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Player);

    const players = await repo.find({
      order: { wins: 'DESC', draws: 'DESC' },
    });

    const ranked = players.map((p) => {
      const total = p.wins + p.losses + p.draws;
      const winPct = total > 0 ? Math.round((p.wins / total) * 100) : 0;
      return {
        id: p.id,
        username: p.username,
        wins: p.wins,
        losses: p.losses,
        draws: p.draws,
        total,
        winPct,
        createdAt: p.createdAt,
      };
    });

    return NextResponse.json(ranked);
  } catch (error) {
    console.error('GET /api/leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Player } from '@/entities/Player';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Player);
    const players = await repo.find({ order: { createdAt: 'DESC' } });
    return NextResponse.json(players);
  } catch (error) {
    console.error('GET /api/players error:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username } = body;

    if (!username || typeof username !== 'string' || !username.trim()) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const cleanUsername = username.trim();
    const ds = await getDataSource();
    const repo = ds.getRepository(Player);

    // Check if exists
    const existing = await repo.findOne({ where: { username: cleanUsername } });
    if (existing) {
      return NextResponse.json(existing);
    }

    const player = repo.create({ username: cleanUsername });
    const saved = await repo.save(player);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/players error:', error);
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
  }
}

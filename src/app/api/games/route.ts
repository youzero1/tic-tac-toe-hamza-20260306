import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Game } from '@/entities/Game';
import { Player } from '@/entities/Player';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const playerId = searchParams.get('playerId');

    const ds = await getDataSource();
    const repo = ds.getRepository(Game);

    const qb = repo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.playerX', 'playerX')
      .leftJoinAndSelect('game.playerO', 'playerO')
      .leftJoinAndSelect('game.winner', 'winner')
      .where('game.status != :status', { status: 'in_progress' })
      .orderBy('game.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (playerId) {
      qb.andWhere(
        '(playerX.id = :pid OR playerO.id = :pid)',
        { pid: parseInt(playerId, 10) }
      );
    }

    const [games, total] = await qb.getManyAndCount();

    return NextResponse.json({
      games: games.map((g) => ({
        id: g.id,
        playerX: { id: g.playerX.id, username: g.playerX.username },
        playerO: { id: g.playerO.id, username: g.playerO.username },
        winner: g.winner ? { id: g.winner.id, username: g.winner.username } : null,
        status: g.status,
        moves: JSON.parse(g.moves || '[]'),
        createdAt: g.createdAt,
        completedAt: g.completedAt,
      })),
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('GET /api/games error:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerXId, playerOId, winnerId, moves, status } = body;

    if (!playerXId || !playerOId) {
      return NextResponse.json({ error: 'playerXId and playerOId are required' }, { status: 400 });
    }

    const ds = await getDataSource();
    const playerRepo = ds.getRepository(Player);
    const gameRepo = ds.getRepository(Game);

    const playerX = await playerRepo.findOne({ where: { id: playerXId } });
    const playerO = await playerRepo.findOne({ where: { id: playerOId } });

    if (!playerX || !playerO) {
      return NextResponse.json({ error: 'Players not found' }, { status: 404 });
    }

    let winner: Player | null = null;
    if (winnerId) {
      winner = await playerRepo.findOne({ where: { id: winnerId } }) || null;
    }

    // Update player stats
    if (status === 'draw') {
      playerX.draws += 1;
      playerO.draws += 1;
    } else if (winner) {
      if (winner.id === playerX.id) {
        playerX.wins += 1;
        playerO.losses += 1;
      } else {
        playerO.wins += 1;
        playerX.losses += 1;
      }
    }

    await playerRepo.save([playerX, playerO]);

    const game = gameRepo.create({
      playerX,
      playerO,
      winner,
      moves: JSON.stringify(moves || []),
      status: status || 'completed',
      completedAt: new Date(),
    });

    const saved = await gameRepo.save(game);

    return NextResponse.json(
      {
        id: saved.id,
        status: saved.status,
        createdAt: saved.createdAt,
        completedAt: saved.completedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/games error:', error);
    return NextResponse.json({ error: 'Failed to save game' }, { status: 500 });
  }
}

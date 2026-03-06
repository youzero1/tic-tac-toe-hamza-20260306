import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Player } from '@/entities/Player';
import { Game } from '@/entities/Game';
import path from 'path';

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  const dbPath = process.env.DATABASE_PATH || './database.sqlite';
  const resolvedPath = path.isAbsolute(dbPath)
    ? dbPath
    : path.join(process.cwd(), dbPath);

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: resolvedPath,
    entities: [Player, Game],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  return dataSource;
}

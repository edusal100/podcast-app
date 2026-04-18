import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("podcast.db");

// init — call once on app start
export function initDb() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS progress (
      episode_id TEXT PRIMARY KEY,
      position INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
}

// save progress
export function saveProgress(episodeId: string, position: number, duration: number) {
  db.runSync(
    `INSERT OR REPLACE INTO progress (episode_id, position, duration, updated_at)
     VALUES (?, ?, ?, ?)`,
    [episodeId, position, duration, Date.now()]
  );
}

// get progress
export function getProgress(episodeId: string): number {
  const row = db.getFirstSync<{ position: number }>(
    `SELECT position FROM progress WHERE episode_id = ?`,
    [episodeId]
  );
  return row?.position ?? 0;
}

// clean entries older than 30 days
export function cleanOldProgress() {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  db.runSync(`DELETE FROM progress WHERE updated_at < ?`, [cutoff]);
}
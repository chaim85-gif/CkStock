import { spawnSync } from 'child_process';

/**
 * Database helper that wraps the team-db CLI (Turso sync).
 * Uses spawnSync with shell:false to avoid bash variable expansion
 * of $ characters in bcrypt hashes and other special characters.
 */
function runQuery(sql) {
  try {
    const result = spawnSync('team-db', [sql], {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
      timeout: 30000,
      shell: false,
    });

    if (result.error) {
      console.error('DB spawn error:', result.error.message?.substring(0, 200));
      return [];
    }

    if (result.stderr && result.stderr.trim()) {
      console.error('DB stderr:', result.stderr.substring(0, 200));
    }

    const stdout = (result.stdout || '').trim();
    if (!stdout) return [];
    return JSON.parse(stdout);
  } catch (err) {
    console.error('DB query error:', err.message?.substring(0, 300));
    return [];
  }
}

export function query(sql) {
  return runQuery(sql);
}

export default { query };
/**
 * Fix auth - re-insert user with proper bcrypt hash
 * This fixes the corrupted hash from the initial seed with execSync
 */
import { spawnSync } from 'child_process';
import bcrypt from 'bcryptjs';

const hash = bcrypt.hashSync('demo1234', 10);
console.log('Generated hash:', hash);

// Delete old corrupted user and re-insert
const delSql = "DELETE FROM users WHERE email = 'admin@ckstock.co.il'";
const delResult = spawnSync('team-db', [delSql], { encoding: 'utf-8', shell: false });
console.log('Delete result:', (delResult.stdout || '').trim());

const id = crypto.randomUUID();
const escHash = hash.replace(/'/g, "''");
const insSql = `INSERT INTO users (id, email, password_hash, tenant_id, role) VALUES ('${id}', 'admin@ckstock.co.il', '${escHash}', 'demo-tenant-001', 'admin')`;
const insResult = spawnSync('team-db', [insSql], { encoding: 'utf-8', shell: false });
console.log('Insert result:', (insResult.stdout || '').trim());
if (insResult.stderr?.trim()) console.error('Insert stderr:', insResult.stderr);

// Verify
const verSql = "SELECT id, email, password_hash, role FROM users WHERE email = 'admin@ckstock.co.il'";
const verResult = spawnSync('team-db', [verSql], { encoding: 'utf-8', shell: false });
const users = JSON.parse((verResult.stdout || '[]').trim());
if (users.length > 0) {
  console.log('Stored hash:', users[0].password_hash);
  const valid = bcrypt.compareSync('demo1234', users[0].password_hash);
  console.log('Password valid:', valid);
}

console.log('\nDone! Auth fixed.');
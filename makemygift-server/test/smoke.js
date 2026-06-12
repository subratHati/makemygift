import { app } from '../src/index.js';

const server = app.listen(0);
await new Promise((r) => server.once('listening', r));
const base = `http://localhost:${server.address().port}`;

let pass = 0, fail = 0;
function check(name, cond, detail) {
  if (cond) { console.log(`  \u2713 ${name}`); pass++; }
  else { console.log(`  \u2717 ${name}${detail ? ' \u2014 ' + detail : ''}`); fail++; }
}
const J = (r) => r.json();

const health = await J(await fetch(`${base}/health`));
console.log('1. health:', JSON.stringify(health));
check('health ok', health.ok === true);
check('store reported', health.db === 'in-memory');

const createRes = await fetch(`${base}/api/gifts`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientName: 'Priya', fromName: 'Aarav', occasion: 'Birthday',
    message: 'You make every room brighter.', closingLine: 'Happy Birthday',
    mirrorQuestion: 'In which month were you born', revealType: 'photo',
  }),
});
const created = await createRes.json();
console.log('2. create:', createRes.status);
check('create -> 201', createRes.status === 201);
check('has publicId', !!created.gift?.publicId);
check('defaults to draft', created.gift?.status === 'draft');
check('openCount starts at 0', created.gift?.openCount === 0);
check('fields persisted', created.gift?.message === 'You make every room brighter.');

const id = created.gift.publicId;
const f1 = await fetch(`${base}/api/gifts/${id}`);
const f2 = await fetch(`${base}/api/gifts/${id}`);
console.log('3. fetch x2:', f1.status, f2.status);
check('first fetch -> 200', f1.status === 200);
check('replayable: second fetch -> 200 (no lock)', f2.status === 200);

const bad = await fetch(`${base}/api/gifts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fromName: 'x' }) });
check('missing recipientName -> 400', bad.status === 400);
const miss = await fetch(`${base}/api/gifts/nope`);
check('unknown id -> 404', miss.status === 404);

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
server.close();
process.exitCode = fail ? 1 : 0;

// Guard for `npm run deploy`: production is published only from the deploy branch,
// with a clean working tree, in the same state as on GitHub. Cross-platform (plain Node + git).
import { execFileSync } from 'node:child_process';

const BRANCH = 'deploy/cloudflare';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const fail = message => { console.error(`\n✗ Wdrożenie wstrzymane: ${message}\n`); process.exit(1); };

const current = git('rev-parse', '--abbrev-ref', 'HEAD');
if (current !== BRANCH) fail(`jesteś na gałęzi „${current}”. Wdrażamy wyłącznie z „${BRANCH}”:\n  git switch ${BRANCH} && git merge --ff-only main`);

if (git('status', '--porcelain')) fail('są niezacommitowane zmiany. Wdrażamy tylko stan zapisany w gałęzi.');

try { git('fetch', '--quiet', 'origin', BRANCH); }
catch { fail(`nie udało się pobrać origin/${BRANCH}. Sprawdź połączenie z GitHubem.`); }

const local = git('rev-parse', 'HEAD');
const remote = git('rev-parse', `origin/${BRANCH}`);
if (local !== remote) fail(`lokalna gałąź różni się od origin/${BRANCH}. Najpierw wypchnij albo pobierz zmiany, żeby gałąź na GitHubie pokazywała to, co jest na produkcji.`);

console.log(`✓ ${BRANCH} @ ${local.slice(0, 7)}, zgodna z origin. Wdrażam.`);

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tempParent = fs.realpathSync(os.tmpdir());
const owned = [];
after(() => {
  for (const dir of owned) {
    assert.equal(fs.realpathSync(dir), dir);
    assert.equal(path.dirname(dir), tempParent);
    assert.ok(path.basename(dir).startsWith('tl-package-'));
    fs.rmSync(dir, { recursive: true });
  }
});
const run = (script, args, cwd) => spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8', windowsHide: true, timeout: 10000 });

for (const layout of ['plugin', 'skill-only']) test(`${layout}: isolated runtime tools, version and config boundary`, async () => {
  const base = fs.realpathSync(fs.mkdtempSync(path.join(tempParent, 'tl-package-'))); owned.push(base);
  const install = path.join(base, 'installed');
  const skill = layout === 'plugin' ? path.join(install, 'skills', 'task-lifecycle') : install;
  fs.cpSync(path.join(root, 'skills', 'task-lifecycle'), skill, { recursive: true });
  if (layout === 'plugin') {
    fs.copyFileSync(path.join(root, 'plugin.json'), path.join(install, 'plugin.json'));
    fs.mkdirSync(path.join(install, 'scripts'));
    for (const name of ['validate-config.mjs', 'check-citations.mjs']) fs.copyFileSync(path.join(root, 'scripts', name), path.join(install, 'scripts', name));
  }
  const validatorPath = path.join(skill, 'scripts', 'validate-config.mjs');
  const V = await import(pathToFileURL(validatorPath).href);
  const version = fs.readFileSync(path.join(skill, 'VERSION'), 'utf8').trim();
  assert.equal(version, JSON.parse(fs.readFileSync(path.join(root, 'plugin.json'), 'utf8')).version);
  assert.equal(V.installationRoot(validatorPath), install);
  const home = path.join(base, 'consumer-home'); fs.mkdirSync(path.join(home, '.config', 'task-lifecycle'), { recursive: true });
  const record = path.join(base, 'approval.md'); fs.writeFileSync(record, '# Fixture approval\n');
  const config = { schemaVersion: 2, approvalSource: { messageId: 'host-native-message', quote: 'Fixture only', record }, delegation: { enabled: false } };
  fs.writeFileSync(path.join(home, '.config', 'task-lifecycle', 'config.json'), JSON.stringify(config));
  const valid = V.validate([], { HOME: home }, { userInfo: () => ({ homedir: home }) });
  assert.equal(valid.status, 'valid', JSON.stringify(valid.reasons));
  assert.equal(valid.schemaVersion, 1); assert.equal(valid.validator.version, '2');
  fs.mkdirSync(path.join(install, '.config', 'task-lifecycle'), { recursive: true });
  fs.writeFileSync(path.join(install, '.config', 'task-lifecycle', 'config.json'), JSON.stringify(config));
  const forbidden = V.validate([], { HOME: install }, { userInfo: () => ({ homedir: install }) });
  assert.ok(forbidden.reasons.some(x => x.code === 'config-location-forbidden'), JSON.stringify(forbidden));
  const source = path.join(base, 'citation.md');
  fs.writeFileSync(source, '`task-recognition-and-routing.md` line 1 "# task-recognition-and-routing"\n');
  const canonical = run(path.join(skill, 'scripts', 'check-citations.mjs'), ['--root', skill, source], base);
  assert.equal(canonical.status, 0, canonical.stdout + canonical.stderr);
  assert.match(canonical.stdout, /^OK\t/);
  const cli = run(validatorPath, ['--unknown-option'], base);
  assert.equal(cli.status, 2, cli.stderr); assert.equal(JSON.parse(cli.stdout).validator.version, '2');
  if (layout === 'plugin') {
    const wrapper = await import(pathToFileURL(path.join(install, 'scripts', 'validate-config.mjs')).href);
    assert.equal(wrapper.validate, V.validate, 'wrapper must export the same function, not a second implementation');
    const forwarded = run(path.join(install, 'scripts', 'validate-config.mjs'), ['--unknown-option'], base);
    assert.equal(forwarded.status, cli.status); assert.equal(forwarded.stdout, cli.stdout);
    const cites = run(path.join(install, 'scripts', 'check-citations.mjs'), ['--root', skill, source], base);
    assert.equal(cites.status, canonical.status); assert.equal(cites.stdout, canonical.stdout); assert.equal(cites.stderr, canonical.stderr);
  } else {
    assert.equal(fs.existsSync(path.join(base, 'scripts')), false);
    assert.equal(fs.existsSync(path.join(base, 'assets')), false);
  }
});

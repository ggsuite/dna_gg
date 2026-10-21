// @license
// Copyright (c) ggsuite
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

// Tests the prompt hook against real git repositories in a temp folder: a
// bare "remote" per repo, clones beside them, the hook's buffer in its own
// home.

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, test } from 'node:test';

import {
  findTargets,
  onEnd,
  onPrompt,
  personOf,
  pmRepoUrl,
  promptsBranch,
  redact,
  slug,
  sync,
} from '../../dna/dot-claude/hooks/pm-prompts.mjs';

const git = (cwd, ...args) =>
  execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();

let root;
let remotes;

function bare(name) {
  const dir = path.join(remotes, `${name}.git`);
  git(remotes, 'init', '-q', '--bare', '-b', 'main', dir);
  return dir;
}

function clone(name, folder, { pmRepo, email } = {}) {
  const dir = path.join(folder, name);
  fs.mkdirSync(folder, { recursive: true });
  git(folder, 'clone', '-q', path.join(remotes, `${name}.git`), dir);
  git(dir, 'config', 'user.email', email ?? 'tim@example.com');
  git(dir, 'config', 'user.name', 'Tim');
  if (pmRepo !== undefined) {
    fs.mkdirSync(path.join(dir, '.claude', 'hooks'), { recursive: true });
    fs.writeFileSync(
      path.join(dir, '.claude', 'hooks', 'pm-prompts.json'),
      JSON.stringify({ pmRepo }),
    );
  }
  return dir;
}

// A project management repo with a people.md on main.
function pmRepo(name, people) {
  bare(name);
  const dir = clone(name, path.join(root, 'seed'));
  fs.mkdirSync(path.join(dir, 'doc', 'team'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'doc', 'team', 'people.md'), people);
  git(dir, 'add', '.');
  git(dir, 'commit', '-q', '-m', 'Add the team');
  git(dir, 'push', '-q', 'origin', 'HEAD:main');
}

const people = [
  '# People',
  '',
  '## Tim',
  '',
  '- Areas: import',
  '- Git: tim@example.com, tim@home.example',
  '',
  '## Jörg',
  '',
  '- Git: joerg@example.com',
  '',
].join('\n');

function branchFiles(name) {
  const dir = path.join(remotes, `${name}.git`);
  const listed = git(
    dir,
    'ls-tree',
    '-r',
    '--name-only',
    `refs/heads/${promptsBranch}`,
  );
  return Object.fromEntries(
    listed
      .split('\n')
      .filter(Boolean)
      .map((f) => [f, git(dir, 'show', `${promptsBranch}:${f}`)]),
  );
}

function prompt(projectDir, session, text) {
  process.env.CLAUDE_PROJECT_DIR = projectDir;
  onPrompt({ session_id: session, cwd: projectDir, prompt: text });
}

const buffered = () =>
  fs.existsSync(path.join(root, 'home', 'sessions'))
    ? fs.readdirSync(path.join(root, 'home', 'sessions'))
    : [];

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-prompts-'));
  remotes = path.join(root, 'remote', 'org');
  fs.mkdirSync(remotes, { recursive: true });
  process.env.PM_PROMPTS_HOME = path.join(root, 'home');
});

afterEach(() => {
  delete process.env.CLAUDE_PROJECT_DIR;
  delete process.env.PM_PROMPTS_HOME;
  fs.rmSync(root, { recursive: true, force: true });
});

// .............................................................................
describe('redact', () => {
  test('replaces tokens, keyed secrets and long random strings', () => {
    const text = [
      'gh: ghp_abcdefghijklmnopqrstuvwxyz0123456789',
      'npm npm_abcdefghijklmnopqrstuvwxyz01',
      'Authorization: Bearer abcdefghijklmnop1234',
      'password=geheim123 and token: "a b c d e f"',
      'azure 4wd5xjq2kvn7ghy3lmz6tpb8rcs9fqe2hjw5kxd7nvm3gpz4qrt6',
      'mixed AbCdEfGhIjKlMnOpQrStUvWxYz012345',
    ].join('\n');
    const result = redact(text);
    assert.doesNotMatch(result, /ghp_|npm_a|abcdefghijklmnop1234|geheim/);
    assert.doesNotMatch(result, /4wd5xjq|AbCdEf|a b c d e f/);
    assert.match(result, /Bearer \[redacted\]/);
    assert.match(result, /password=\[redacted\]/);
  });

  test('keeps commit hashes, paths, words and short values', () => {
    const text = [
      'commit 3787cf3a1b2c4d5e6f708192a3b4c5d6e7f80912',
      'see doc/2026-Q4/tickets/import_race_data_from_the_timing_app.md',
      'ds_dataservices_pm_architecture_inventory',
      'the token: abc',
    ].join('\n');
    assert.equal(redact(text), text);
  });
});

// .............................................................................
describe('pmRepoUrl', () => {
  test('puts the repo beside the origin', () => {
    assert.equal(
      pmRepoUrl('ds_dataservices_pm', 'https://dev.azure.com/o/p/_git/ds-x'),
      'https://dev.azure.com/o/p/_git/ds_dataservices_pm',
    );
    assert.equal(
      pmRepoUrl('rljson-pm', 'git@github.com:rljson/io.git'),
      'git@github.com:rljson/rljson-pm.git',
    );
    assert.equal(
      pmRepoUrl('pm', 'git@ssh.dev.azure.com:v3/o/p/ds-x'),
      'git@ssh.dev.azure.com:v3/o/p/pm',
    );
  });

  test('takes a full URL as is, nothing without a name', () => {
    const url = 'https://github.com/other/pm.git';
    assert.equal(pmRepoUrl(url, 'git@github.com:a/b.git'), url);
    assert.equal(pmRepoUrl('git@host:a/pm.git', ''), 'git@host:a/pm.git');
    assert.equal(pmRepoUrl('', 'git@github.com:a/b.git'), '');
    assert.equal(pmRepoUrl('pm', ''), '');
  });
});

// .............................................................................
describe('people', () => {
  test('finds the person by any of the listed emails', () => {
    assert.equal(personOf('tim@home.example', people), 'Tim');
    assert.equal(personOf('JOERG@example.com', people), 'Jörg');
    assert.equal(personOf('anna@example.com', people), '');
    assert.equal(personOf('', people), '');
  });

  test('spells out umlauts in folder names', () => {
    assert.equal(slug('Göran'), 'goeran');
    assert.equal(slug('Jörg Müller'), 'joerg-mueller');
    assert.equal(slug('ds_dataservices_pm'), 'ds-dataservices-pm');
  });
});

// .............................................................................
describe('the hook', () => {
  test('pushes the prompts of a repo to the prompts branch', () => {
    pmRepo('the-pm', people);
    bare('code');
    const code = clone('code', path.join(root, 'work'), { pmRepo: 'the-pm' });

    prompt(code, 'aaaaaaaa-1111', 'Fix the import\n# not a heading');
    prompt(code, 'aaaaaaaa-1111', 'My token is ghp_abcdefghijklmnopqrstuvwx1234');
    onEnd({ session_id: 'aaaaaaaa-1111' });
    sync();

    const files = branchFiles('the-pm');
    const names = Object.keys(files);
    assert.equal(names.length, 1);
    assert.match(
      names[0],
      /^doc\/prompts\/tim\/\d{4}-\d{2}\/\d{4}-\d{2}-\d{2}_code_aaaaaaaa\.md$/,
    );
    const content = files[names[0]];
    assert.match(content, /^# \d{4}-\d{2}-\d{2} · code · aaaaaaaa/);
    assert.match(content, /- Person: Tim\n- Repo: code\n/);
    assert.match(content, /## \d\d:\d\d\n\nFix the import\n\\# not a heading/);
    assert.match(content, /My token is \[redacted\]/);
    assert.deepEqual(buffered(), []);

    // main stays untouched
    const pm = path.join(remotes, 'the-pm.git');
    assert.equal(git(pm, 'ls-tree', '-r', '--name-only', 'main'), 'doc/team/people.md');
  });

  test('appends a resumed session to the file it started', () => {
    pmRepo('the-pm', people);
    bare('code');
    const code = clone('code', path.join(root, 'work'), { pmRepo: 'the-pm' });

    prompt(code, 'bbbbbbbb-2222', 'First');
    onEnd({ session_id: 'bbbbbbbb-2222' });
    sync();
    prompt(code, 'bbbbbbbb-2222', 'Second');
    sync();
    prompt(code, 'bbbbbbbb-2222', 'Third');
    onEnd({ session_id: 'bbbbbbbb-2222' });
    sync();

    const [content] = Object.values(branchFiles('the-pm'));
    assert.equal(content.match(/^# /gm).length, 1);
    assert.match(content, /First[\s\S]*Second[\s\S]*Third/);
    assert.equal(content.match(/Second/g).length, 1);
    assert.deepEqual(buffered(), []);
  });

  test('files an unknown developer under _unknown', () => {
    pmRepo('the-pm', people);
    bare('code');
    const code = clone('code', path.join(root, 'work'), {
      pmRepo: 'the-pm',
      email: 'anna@example.com',
    });

    prompt(code, 'cccccccc-3333', 'Hello');
    onEnd({ session_id: 'cccccccc-3333' });
    sync();

    const [[name, content]] = Object.entries(branchFiles('the-pm'));
    assert.match(name, /^doc\/prompts\/_unknown\//);
    assert.match(content, /- Person: anna@example.com/);
  });

  test('reports a ticket folder to the repos of its repos', () => {
    pmRepo('pm-a', people);
    pmRepo('pm-b', people);
    bare('one');
    bare('two');
    bare('three');
    const ticket = path.join(root, 'workspace', 'my_ticket');
    clone('one', ticket, { pmRepo: 'pm-a' });
    clone('two', ticket, { pmRepo: 'pm-b' });
    clone('three', ticket, { pmRepo: '' });
    fs.mkdirSync(path.join(ticket, '.claude', 'hooks'), { recursive: true });
    fs.writeFileSync(
      path.join(ticket, '.claude', 'hooks', 'pm-prompts.json'),
      '{ "pmRepo": "" }',
    );

    const { targets, repos } = findTargets(ticket);
    assert.deepEqual(repos, ['one', 'two']);
    assert.equal(targets.length, 2);

    prompt(ticket, 'dddddddd-4444', 'Change both');
    onEnd({ session_id: 'dddddddd-4444' });
    sync();

    for (const pm of ['pm-a', 'pm-b']) {
      const [[name, content]] = Object.entries(branchFiles(pm));
      assert.match(name, /_my-ticket_dddddddd\.md$/);
      assert.match(content, /- Folder: my_ticket\n- Repos: one, two\n/);
    }
  });

  test('keeps nothing where no repo names a project management repo', () => {
    bare('code');
    const code = clone('code', path.join(root, 'work'), { pmRepo: '' });
    const plain = clone('code', path.join(root, 'plain'));

    prompt(code, 'eeeeeeee-5555', 'Hello');
    prompt(plain, 'ffffffff-6666', 'Hello');
    assert.deepEqual(buffered(), []);
  });

  test('keeps the buffer while the repo cannot be reached', () => {
    bare('code');
    const code = clone('code', path.join(root, 'work'), { pmRepo: 'missing' });

    prompt(code, 'gggggggg-7777', 'Hello');
    onEnd({ session_id: 'gggggggg-7777' });
    sync();

    assert.deepEqual(buffered().sort(), [
      'gggggggg-7777.jsonl',
      'gggggggg-7777.state.json',
    ]);
    const log = fs.readFileSync(path.join(root, 'home', 'sync.log'), 'utf8');
    assert.match(log, /sync .*missing\.git: fetch HEAD/);
  });
});

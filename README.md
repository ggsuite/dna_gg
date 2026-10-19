# dna_gg

The DNA layer for the `gg` CLI workflow: ticket, commit, push, review,
publish.

## Guides

- `dna/doc/guides/develop-guide.md`,
  `dna/doc/guides/develop-without-ai-guide.md` — the ticket driven
  workflow, with and without an AI
- `dna/doc/guides/for-ai/ai-dev-guide.md` — the same workflow as
  instructions for an agent
- `dna/doc/guides/install-guide/install-gg-guide.md`,
  `dna/doc/guides/install-guide/install-gg-workspace-guide.md` — install
  `gg` and set up a workspace

## CLAUDE.md

- `dna/CLAUDE.md` — points the agent to the `ai-dev-guide` and the
  skills. helix writes it into the managed block of the consumer's
  `CLAUDE.md` (`<!-- helix:claude_md:start/end -->`), everything outside
  the block stays with the repo.

## Skills

All skills of this layer are prefixed with `gg-`:

- `/gg` — lists the skills below and says which one comes next
- `/gg-ticket` — creates a ticket and adds the repos it needs
- `/gg-commit` — proposes a message and commits through `gg do commit`
- `/gg-push` — pushes the ticket branches
- `/gg-review` — writes the blog posts and opens the pull requests
- `/gg-publish` — releases the ticket
- `/gg-cleanup` — removes what the ticket left behind

## Scripts

- `dna/scripts/delete-feature-branch.js` — the one script this layer calls
  itself, from `/gg-cleanup`, with the two functions it imports:
  `dna/scripts/functions/colors.js` and
  `dna/scripts/functions/run-command.js`

These three files are byte-identical copies of their originals in
[dna_scripts](https://github.com/ggdna/dna_scripts). They are duplicated
on purpose so that this layer does not drag the whole script set into
every repo that only wants the gg workflow. A repo that wants the full
set lists `dna_scripts` as a layer of its own — the copies are identical,
so both layers together produce exactly the same files.

## Layers

Builds on [dna_install](https://github.com/ggdna/dna_install) for the
install overview and [dna_index](https://github.com/ggdna/dna_index) for
the repo index every gg repo keeps.

It extends the `@tooling` section of the install overview through
`dna/doc/guides/install-guide.overrides.md`: it adds `Install gg` and
appends the `Workspace` section.

## Variables

- `dnaCopyrightHolder` — the name in the license header of every file
- `dnaCompany`, `dnaGitOrg`, `dnaGitOrgUrl` — the organization repos are
  created in
- `dnaJiraPrefix` — the prefix of a ticket id
- `dnaGitQuickCheckPipelineName` — the name the branch rules require
- `dnaPubDevPublisher` — the pub.dev publisher packages are transferred to

`dnaCopyrightHolder`, `dnaCompany` and `dnaJiraPrefix` name the
organization, so they are never inherited: every layer or project listing
this one sets them in its own `dna/_vars.json`. `helix init` and
`helix add` ask for the missing ones.

## Usage

Declare it as a dev-dependency and initialize once:

```bash
pnpm add -D @ggdna/dna-gg   # TypeScript projects
dart pub add dev:dna_gg     # Dart projects
helix init
```

The placed test instantiates and verifies the DNA on every test run.

## Development

The `dna/` folder is hand-authored source and is never generated. The repo
instantiates its own DNA — run `dart test` after changes; commit first, a
file the DNA would overwrite must not carry uncommitted work.

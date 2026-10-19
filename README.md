# dna_gg

English | [Deutsch](README.de.md)

[![CI](https://github.com/ggsuite/dna_gg/actions/workflows/quick_check.yaml/badge.svg)](https://github.com/ggsuite/dna_gg/actions/workflows/quick_check.yaml)

Gives a repo the gg ticket workflow from ticket to release: guides, agent
instructions and the /gg skills.

## Motivation

A ticket often changes several repos at once and runs through the same steps
every time: create the ticket, commit, push, review, publish and clean up. Each
step has its own `gg` command and its own rules — the checks must be green
before a commit, the blog posts are written before the pull requests open, and
`gg do publish` is interactive, so the user runs it, not the agent. A developer
and an agent working together should know at every point which step comes
next.

This layer puts the same workflow into every repo: the guides for working with
and without an AI, the instructions an agent reads from `CLAUDE.md`, and one
skill per step. Its content started out in the former dna_base and became a
layer of its own.

## Usage

Declare it as a dev-dependency and initialize once:

```bash
pnpm add -D @ggdna/dna-gg   # TypeScript projects
dart pub add dev:dna_gg     # Dart projects
helix init
```

`helix init` places a test that instantiates and verifies the DNA on every
test run. It copies the guides to `doc/guides/`, the skills to
`.claude/skills/` and writes `dna/CLAUDE.md` into the managed block of the
repo's `CLAUDE.md`. Together with the parent layers the repo also gets the
install overview and the index guide in `doc/`, the GitHub setup guide in
`guides/`, `scripts/setup-github-repo.js` and
`.github/workflows/quick_check.yaml`.

A gg workspace gets the layer from `gg do init workspace`. Start Claude Code in
the workspace and type `/gg-ticket` to begin a ticket; `/gg` lists the skills
and says which one comes next.

## Guides

- `dna/doc/guides/develop-guide.md` — the ticket workflow with Claude Code:
  install, prepare the workspace, then one skill per step
- `dna/doc/guides/develop-without-ai-guide.md` — the same workflow with the
  `gg do` commands typed by hand
- `dna/doc/guides/for-ai/ai-dev-guide.md` — the workflow as instructions for an
  agent: ask for the ticket data, choose the project management repo and the
  code repos, keep the publish config current, commit, push, review, publish
- `dna/doc/guides/install-guide/install-gg-guide.md` — install the `gg` CLI and
  put the pub cache on the `PATH`
- `dna/doc/guides/install-guide/install-gg-workspace-guide.md` — create a gg
  workspace with `gg do init workspace` and add the repos
- `dna/doc/guides/install-guide.overrides.md` — extends the install overview of
  dna_install, see [Layers](#layers)

## Skills

All skills of this layer carry the `gg-` prefix, except `/gg` itself:

- `/gg` — lists the skills below in the order of a ticket's life and says which
  one comes next
- `/gg-ticket` — creates a ticket and adds the project management repo and the
  code repos it needs
- `/gg-commit` — proposes a message and commits through `gg do commit`, or
  `gg one do commit` inside a single repo
- `/gg-push` — pushes the ticket branches with `gg do push`
- `/gg-review` — writes the blog posts, opens the pull requests with
  `gg do review` and reviews the changes
- `/gg-publish` — prepares the release and hands `gg do publish` over to the
  user
- `/gg-cleanup` — removes the feature branches and the ticket folder a
  published ticket left behind

## Configuration

- `dna/CLAUDE.md` — points the agent to the AI development guide and the
  skills. helix writes it into the managed block of the consuming repo's
  `CLAUDE.md` (`<!-- helix:claude_md:start -->` to
  `<!-- helix:claude_md:end -->`); everything outside the block stays with the
  repo

## Scope

The layer describes the workflow; the `gg` CLI that runs it is a separate
package, which the install guide sets up. The layer leaves the GitHub settings
and the quick check workflow to dna_github, the install overview to
dna_install, the index files to dna_index, the blog posts to dna_blog and the
project management repo to dna_plan. It ships no scripts of its own.

## Layers

- [dna_install](https://github.com/ggdna/dna_install) — the install overview
  and the install guides of the tools a development machine needs, plus the
  `/install` skill
- [dna_index](https://github.com/ggdna/dna_index) — the guide, the template and
  the `/index` skill for the index file every gg repo keeps; `/gg-ticket` reads
  the index files to choose the repos of a ticket
- [dna_github](https://github.com/ggdna/dna_github) — the GitHub setup guide,
  `scripts/setup-github-repo.js` and the quick check workflow the branch rules
  require

The layer extends the `@tooling` section of dna_install's install overview
through `dna/doc/guides/install-guide.overrides.md`: it replaces the list of
that section with one that adds `Install gg`, and appends a `Workspace` section
with the workspace guide.

## Variables

- `dnaCopyrightHolder` — the holder named in the copyright header of every
  placed file
- `dnaCompany` — the company the install guide of `gg` names
- `dnaJiraPrefix` — the prefix of a ticket id in the examples of the guides and
  skills, e.g. `GGS-145`; its casing is kept
- `dnaGitQuickCheckPipelineName` — the name of the quick check job of
  dna_github's workflow, which the branch rules require; this layer sets it to
  `Quick Check`
- `dnaGitOrg`, `dnaGitOrgUrl` — the GitHub organization and its URL; no file of
  this layer uses them, layers combined with it such as dna_readme do
- `dnaPubDevPublisher` — the pub.dev publisher of the organization's packages;
  no file of this layer reads it

`mustOverride` in `dna/_dna.json` forces every repo or layer that lists this
layer to set `dnaCopyrightHolder`, `dnaCompany` and `dnaJiraPrefix` in its own
`dna/_vars.json`, because they name the organization; `helix init` and
`helix add` ask for the missing ones. `dnaGitQuickCheckPipelineName` is the
exception: dna_github makes every layer set it, this layer sets it once, and
the repos and layers listing dna_gg inherit it.

## Development

The `dna/` folder is hand-authored source and is never generated. The repo
instantiates its own DNA — run `dart test` after changes; commit first, a file
the DNA would overwrite must not carry uncommitted work.

Edit the files below `dna/`, never the files the test writes: their copies in
`doc/`, `.claude/` and the managed block of `CLAUDE.md`, and the files of the
parent layers in `guides/`, `scripts/` and `.github/`.

## License

MIT — see [LICENSE](LICENSE).

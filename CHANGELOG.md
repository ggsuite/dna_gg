# Changelog

## 0.13.1 - 2026-10-21

## 0.13.0 - 2026-10-21

## 0.12.0 - 2026-10-19

- The ticket plan names the requirements the ticket fulfils
- Engineer the requirements before planning a ticket when the project
management repo has none that cover it

## 0.11.1 - 2026-10-19

## 0.11.0 - 2026-10-19

## 0.10.0 - 2026-10-18

## 0.9.0 - 2026-10-15

## 0.8.1 - 2026-10-14

## 0.8.0 - 2026-10-13

## 0.7.1 - 2026-10-06

## 0.7.0 - 2026-10-04

## 0.6.0 - 2026-10-01

## 0.5.1 - 2026-09-22

## 0.5.0 - 2026-09-21

## 0.4.1 - 2026-09-15

## 0.4.0 - 2026-09-10

### Changed

- `ai-dev-guide` and `/ticket`: read the PM repo's `doc/guides/pm-repo-guide.md`
when it exists (shipped by `dna_plan`) — it says how the PM repo is
structured and how a ticket is planned there.

## 0.3.0 - 2026-09-09

### Added

- `dna/CLAUDE.md` — points the agent to the ai-dev-guide and the skills;
helix 1.6 writes it into the managed block of the consumer's `CLAUDE.md`.

### Changed

- `ai-dev-guide` and `/ticket`: choose the project management repo right
after creating the ticket and add it first, plan the ticket in the PM repo
optionally, and make the implementation optional — a ticket may end with
the PM repo alone.
- `install-gg-workspace-guide`: `gg do init workspace` instantiates
`dna_gg` in the workspace folder.

## 0.2.0 - 2026-09-07

## 0.1.2 - 2026-08-20

### Fixed

- The quick check pipeline ran `npx @tssuite/gg-js`, which npm reports as
deprecated ("Package no longer supported"). It now runs
`npx @tssuite/ggwsm`, the package that replaced it.

## 0.1.1 - 2026-08-19

### Changed

- Inherit scripts from `dna_scripts` instead of shipping its own copies.
Same files, same content — deduplicated across the family.

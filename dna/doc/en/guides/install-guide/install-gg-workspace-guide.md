<!--
@license
Copyright (c) dnaCopyrightHolder

Use of this source code is governed by terms that can be
found in the LICENSE file in the root of this package.
-->

# Create a gg workspace

## @dev Create a dev dir

```bash
mkdir -p ~/dev2
cd ~/dev2
```

## @gg Init a gg workspace

```bash
gg do init workspace
```

This creates the `.ocean` folder and instantiates the latest `dna_gg` in
the workspace folder: the gg guides, the skills and the managed block of
`CLAUDE.md`. It does what `gg dna init` and
`gg dna add dna_gg --workspace` do by hand — `add` builds the DNA itself,
no `gg dna build` follows — but keeps their pub files out of the
workspace folder. Every ticket gets a copy of the skills.

## @repositories Add your repositories

```bash
gg do add dnaOrgUrl
```

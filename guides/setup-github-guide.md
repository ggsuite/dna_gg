# Setup GitHub Guide

This guide sets up a GitHub repository with squash-only pull requests, a
protected default branch and a required quick check.

## 1. Add dna_github

```bash
gg dna add dna_github
gg dna build
```

This adds `scripts/setup-github-repo.js` and
`.github/workflows/quick_check.yaml` to your repository.

## 2. Merge the changes into main

Commit the changes, open a pull request and merge it into `main`. The quick
check workflow must exist on `main` before the branch rules can require it.

## 3. Preview the settings

```bash
node scripts/setup-github-repo.js
```

Prints the repository and the settings that would be applied, without
changing anything. 

Requires the [GitHub CLI](https://cli.github.com) (`gh auth login`).

## 4. Apply the settings

```bash
node scripts/setup-github-repo.js --apply
```

This:

- allows only squash merges, enables auto merge and deletes branches after
  merge
- creates or updates the `Default` ruleset on the default branch: no deletion,
  no force push, linear history, pull requests required and the quick check
  must pass

Add `--require-review` to also require one approving review and resolved
review threads.

## 5. Make the README check blocking

The quick check runs `node scripts/check-readme.js` when the repo has that
script; `dna_readme` ships it. A repo without it skips the check.

By default a README finding shows up as a warning on the run and the quick
check stays green. Once the README passes, make findings fail the quick check:

```bash
gh variable set README_CHECK --body required
```

Delete the variable to make the check advisory again:

```bash
gh variable delete README_CHECK
```

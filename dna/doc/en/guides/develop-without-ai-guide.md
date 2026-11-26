<!--
@license
Copyright (c) dnaCopyrightHolder

Use of this source code is governed by terms that can be
found in the LICENSE file in the root of this package.
-->

# Develop without AI

## @prepare Prepare everything

If you have not done that yet:

[Install the required software](./install-guide.md)

[Initialize a gg workspace](./install-guide/install-gg-workspace-guide.md)

## @switch Switch into your workspace

```bash
cd ~/dev/
```

## @repos Add repos to the ticket

```bash
gg do add repo1 repo2
```

Name all repos in one call: every call refreshes the ocean and builds
the dependency graph again.

## @workspace Open the workspace in Vscode

```bash
gg do code
```

## @implement Implement

Implement your features based on the guides

## @commit Commit

```bash
gg do commit
```

## @push Push

```bash
gg do push
```

## @review Review

```bash
gg do review
```

## @publish Publish

Publish from the workspace root and name the ticket with `-i`:

```bash
cd ~/dev/
gg do publish -i <ticket>
```

At the end gg moves the ticket folder to the trash. On Windows this fails
while a terminal sits in the ticket folder ("used by another process").

<!--
@license
Copyright (c) dnaCopyrightHolder

Use of this source code is governed by terms that can be
found in the LICENSE file in the root of this package.
-->

# Ohne KI entwickeln

## @prepare Alles vorbereiten <a id="prepare-everything"></a>

Falls noch nicht geschehen:

[Die benötigte Software installieren](./install-guide.md)

[Einen gg-Workspace initialisieren](./install-guide/install-gg-workspace-guide.md)

## @switch In den Workspace wechseln <a id="switch-into-your-workspace"></a>

```bash
cd ~/dev/
```

## @repos Repos zum Ticket hinzufügen <a id="add-repos-to-the-ticket"></a>

```bash
gg do add repo1 repo2
```

Alle Repos in einem Aufruf nennen: Jeder Aufruf aktualisiert den Ocean und
baut den Abhängigkeitsgraphen neu auf.

## @workspace Den Workspace in VS Code öffnen <a id="open-the-workspace-in-vscode"></a>

```bash
gg do code
```

## @implement Implementieren <a id="implement"></a>

Die Features anhand der Leitfäden implementieren.

## @commit Committen <a id="commit"></a>

```bash
gg do commit
```

## @push Pushen <a id="push"></a>

```bash
gg do push
```

## @review Review

```bash
gg do review
```

## @publish Veröffentlichen <a id="publish"></a>

Aus dem Workspace-Wurzelordner veröffentlichen und das Ticket mit `-i`
angeben:

```bash
cd ~/dev/
gg do publish -i <ticket>
```

Am Ende verschiebt gg den Ticket-Ordner in den Papierkorb. Unter Windows
schlägt das fehl, solange ein Terminal im Ticket-Ordner steht („used by
another process“).

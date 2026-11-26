<!--
@license
Copyright (c) dnaCopyrightHolder

Use of this source code is governed by terms that can be
found in the LICENSE file in the root of this package.
-->

# gg installieren

`gg` ist die einheitliche Dart-CLI für die Entwicklung bei dnaCompany. Sie
führt Pre-Commit-Prüfungen in einem einzelnen Repository aus und steuert
Commits, Pushes, Reviews und Veröffentlichungen über alle Repositories eines
Tickets hinweg.

## @prerequisites Voraussetzungen <a id="prerequisites"></a>

Zuerst [Flutter](./install-flutter-guide.md) installieren. Es liefert den
unten verwendeten Befehl `dart`.

```bash
dart --version
```

## @gg gg installieren <a id="install-gg"></a>

```bash
dart pub global activate gg
```

## @pub Den Pub-Cache zum PATH hinzufügen <a id="add-the-pub-cache-to-your-path"></a>

Global aktivierte Dart-Programme werden in den Pub-Cache installiert. Dessen
Ordner `bin` zum `PATH` hinzufügen, sonst wird der Befehl `gg` nicht
gefunden.

Mac und Linux:

```bash
echo 'export PATH="$HOME/.pub-cache/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Unter Windows folgenden Ordner zur Umgebungsvariable `Path` hinzufügen:

```text
%LOCALAPPDATA%\Pub\Cache\bin
```

Danach das Terminal neu starten.

## @installation Installation prüfen <a id="verify-installation"></a>

```bash
gg --help
```

## @gg-2 gg aktualisieren <a id="update-gg"></a>

Die Aktivierung erneut ausführen, um die neueste Version zu installieren:

```bash
dart pub global activate gg
```

## @usage Verwendung <a id="usage"></a>

`gg` arbeitet ticketbasiert: Innerhalb eines Tickets ausgeführt, wirkt jede
Aktion auf alle Repositories, die zu diesem Ticket gehören.

```bash
gg                # the command groups: do, can, did
gg do -h          # everything you can act on
gg can commit     # check before committing
```

Siehe auch den [Entwicklungsleitfaden](../develop-guide.md).

# dna_gg

[English](README.md) | Deutsch

[![CI](https://github.com/ggsuite/dna_gg/actions/workflows/quick_check.yaml/badge.svg)](https://github.com/ggsuite/dna_gg/actions/workflows/quick_check.yaml)

Gibt einem Repo den gg-Ticket-Ablauf vom Ticket bis zum Release: Guides,
Agenten-Anweisungen und die /gg-Skills.

## Motivation

Ein Ticket ändert oft mehrere Repos zugleich und durchläuft jedes Mal dieselben
Schritte: Ticket anlegen, committen, pushen, reviewen, veröffentlichen und
aufräumen. Jeder Schritt hat seinen eigenen `gg`-Befehl und seine eigenen
Regeln — vor einem Commit müssen die Checks grün sein, die Blogbeiträge
entstehen, bevor die Pull Requests aufgehen, und `gg do publish` ist
interaktiv, also startet es der Nutzer und nicht der Agent. Entwickler und
Agent sollen gemeinsam an jeder Stelle wissen, welcher Schritt als Nächstes
kommt.

Diese Schicht bringt denselben Ablauf in jedes Repo: die Guides für die Arbeit
mit und ohne KI, die Anweisungen, die ein Agent aus `CLAUDE.md` liest, und einen
Skill pro Schritt. Ihr Inhalt stammt aus dem früheren dna_base und wurde zu
einer eigenen Schicht.

## Verwendung

Als Dev-Dependency eintragen und einmal initialisieren:

```bash
pnpm add -D @ggdna/dna-gg   # TypeScript projects
dart pub add dev:dna_gg     # Dart projects
helix init
```

`helix init` legt einen Test ab, der die DNA bei jedem Testlauf instanziiert
und prüft. Er kopiert die Guides nach `doc/guides/`, die Skills nach
`.claude/skills/` und schreibt `dna/CLAUDE.md` in den verwalteten Block der
`CLAUDE.md` des Repos. Über die Eltern-Schichten bekommt das Repo außerdem die
Installationsübersicht und den Index-Guide in `doc/`, den GitHub-Setup-Guide in
`guides/`, `scripts/setup-github-repo.js` und
`.github/workflows/quick_check.yaml`.

Ein gg-Workspace bekommt die Schicht über `gg do init workspace`. Starte Claude
Code im Workspace und tippe `/gg-ticket`, um ein Ticket zu beginnen; `/gg`
listet die Skills und sagt, welcher als Nächstes kommt.

## Guides

- `dna/doc/guides/develop-guide.md` — der Ticket-Ablauf mit Claude Code:
  installieren, den Workspace vorbereiten, dann ein Skill pro Schritt
- `dna/doc/guides/develop-without-ai-guide.md` — derselbe Ablauf mit den
  `gg do`-Befehlen von Hand
- `dna/doc/guides/for-ai/ai-dev-guide.md` — der Ablauf als Anweisungen für
  einen Agenten: nach den Ticketdaten fragen, das Projektmanagement-Repo und die
  Code-Repos wählen, die Publish-Konfiguration aktuell halten, committen,
  pushen, reviewen, veröffentlichen
- `dna/doc/guides/install-guide/install-gg-guide.md` — die `gg`-CLI
  installieren und den Pub-Cache in den `PATH` aufnehmen
- `dna/doc/guides/install-guide/install-gg-workspace-guide.md` — einen
  gg-Workspace mit `gg do init workspace` anlegen und die Repos hinzufügen
- `dna/doc/guides/install-guide.overrides.md` — erweitert die
  Installationsübersicht von dna_install, siehe [Schichten](#schichten)

## Skills

Alle Skills dieser Schicht tragen das Präfix `gg-`, außer `/gg` selbst:

- `/gg` — listet die Skills unten in der Reihenfolge eines Ticket-Lebens und
  sagt, welcher als Nächstes kommt
- `/gg-ticket` — legt ein Ticket an und fügt das Projektmanagement-Repo und die
  Code-Repos hinzu, die es braucht
- `/gg-commit` — schlägt eine Nachricht vor und committet über `gg do commit`,
  oder `gg one do commit` innerhalb eines einzelnen Repos
- `/gg-push` — pusht die Ticket-Branches mit `gg do push`
- `/gg-review` — schreibt die Blogbeiträge, öffnet die Pull Requests mit
  `gg do review` und reviewt die Änderungen
- `/gg-publish` — bereitet das Release vor und übergibt `gg do publish` an den
  Nutzer
- `/gg-cleanup` — entfernt die Feature-Branches und den Ticket-Ordner, die ein
  veröffentlichtes Ticket zurückgelassen hat

## Konfiguration

- `dna/CLAUDE.md` — verweist den Agenten auf den KI-Entwicklungs-Guide und die
  Skills. helix schreibt sie in den verwalteten Block der `CLAUDE.md` des
  nutzenden Repos (`<!-- helix:claude_md:start -->` bis
  `<!-- helix:claude_md:end -->`); alles außerhalb des Blocks bleibt beim Repo

## Umfang

Die Schicht beschreibt den Ablauf; die `gg`-CLI, die ihn ausführt, ist ein
eigenes Paket, das der Installations-Guide einrichtet. Die Schicht überlässt
die GitHub-Einstellungen und den Quick-Check-Workflow dna_github, die
Installationsübersicht dna_install, die Index-Dateien dna_index, die
Blogbeiträge dna_blog und das Projektmanagement-Repo dna_plan. Sie liefert
keine eigenen Skripte.

## Schichten

- [dna_install](https://github.com/ggdna/dna_install) — die
  Installationsübersicht und die Installations-Guides der Werkzeuge, die ein
  Entwicklungsrechner braucht, dazu der Skill `/install`
- [dna_index](https://github.com/ggdna/dna_index) — der Guide, das Template und
  der Skill `/index` für die Index-Datei, die jedes gg-Repo führt; `/gg-ticket`
  liest die Index-Dateien, um die Repos eines Tickets zu wählen
- [dna_github](https://github.com/ggdna/dna_github) — der GitHub-Setup-Guide,
  `scripts/setup-github-repo.js` und der Quick-Check-Workflow, den die
  Branch-Regeln verlangen

Die Schicht erweitert den Abschnitt `@tooling` der Installationsübersicht von
dna_install über `dna/doc/guides/install-guide.overrides.md`: Sie ersetzt die
Liste dieses Abschnitts durch eine, die `Install gg` ergänzt, und hängt einen
Abschnitt `Workspace` mit dem Workspace-Guide an.

## Variablen

- `dnaCopyrightHolder` — der Rechteinhaber im Copyright-Kopf jeder abgelegten
  Datei
- `dnaCompany` — die Firma, die der Installations-Guide von `gg` nennt
- `dnaJiraPrefix` — das Präfix einer Ticket-ID in den Beispielen der Guides und
  Skills, z. B. `GGS-145`; seine Schreibweise bleibt erhalten
- `dnaGitQuickCheckPipelineName` — der Name des Quick-Check-Jobs im Workflow
  von dna_github, den die Branch-Regeln verlangen; diese Schicht setzt ihn auf
  `Quick Check`
- `dnaGitOrg`, `dnaGitOrgUrl` — die GitHub-Organisation und ihre URL; keine
  Datei dieser Schicht nutzt sie, Schichten, die mit ihr kombiniert werden, wie
  dna_readme, schon
- `dnaPubDevPublisher` — der pub.dev-Publisher der Pakete der Organisation;
  keine Datei dieser Schicht liest ihn

`mustOverride` in `dna/_dna.json` zwingt jedes Repo und jede Schicht, die diese
Schicht einbindet, `dnaCopyrightHolder`, `dnaCompany` und `dnaJiraPrefix` in der
eigenen `dna/_vars.json` zu setzen, weil sie die Organisation nennen;
`helix init` und `helix add` fragen nach den fehlenden.
`dnaGitQuickCheckPipelineName` ist die Ausnahme: dna_github lässt jede Schicht
ihn setzen, diese Schicht setzt ihn einmal, und die Repos und Schichten, die
dna_gg einbinden, erben ihn.

## Entwicklung

Der Ordner `dna/` ist handgeschriebene Quelle und wird nie generiert. Das Repo
instanziiert seine eigene DNA — nach Änderungen `dart test` laufen lassen;
vorher committen, denn eine Datei, die die DNA überschreiben würde, darf keine
uncommittete Arbeit enthalten.

Bearbeite die Dateien unter `dna/`, nie die Dateien, die der Test schreibt:
ihre Kopien in `doc/`, `.claude/` und im verwalteten Block der `CLAUDE.md` und
die Dateien der Eltern-Schichten in `guides/`, `scripts/` und `.github/`.

## Lizenz

MIT — siehe [LICENSE](LICENSE).

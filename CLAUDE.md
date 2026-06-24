# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A dependency-free, static flashcards web app (vanilla HTML/CSS/JS, no build step, no
package manager, no tests). Deployed at https://projects.kathas.no/flashcards. Also doubles
as an Alias-style word game. Open `index.html` directly or serve the folder over any static
HTTP server (e.g. `python3 -m http.server`) — `fetch` of `data.json` requires HTTP rather
than `file://`.

External libraries are loaded via CDN `<script>`/`<link>` tags in `index.html`, not npm:
- **KaTeX** (+ auto-render) — renders LaTeX math in questions/answers
- **PapaParse** — parses Google Sheets CSV exports
- **lucide** — icons

## Architecture

Three files do everything: `index.html` (two `<main>` "screens": `#main-menu` and
`#flashcards`, toggled via `style.display`), `styles.css`, and `script.js`.

**Data is decoupled from code via a manifest.** `data.json` maps each collection name to a
JSON file under `data/`. On load, `fetchCollections()` fetches the manifest, then fetches
every referenced file in parallel and reassembles them (in manifest order) into the global
`data` object. **To add a collection, create `data/<name>.json` and register it in
`data.json`** — no JS changes needed.

**Collection file shape** (see `data/sample-1.json` for the canonical example): `title`,
`description`, `credit`, and `questions`. A question is either a plain string (prompt-only,
e.g. Alias / icebreakers) or `{ "q": ..., "a": ... }` (answer is concealed/blurred until
the card or answer is clicked).

Two special collection mechanisms, both resolved at load time:
- **`combine: [...]`** — `resolveCombinedQuestions()` merges the `questions` arrays of the
  listed collections into this one (the manifest entries must also exist). Used for
  "all" collections like `IN2140-all`.
- **`"google sheets": "<csv-url>"`** — when present, `loadCollection()` ignores `questions`
  and instead downloads/parses the CSV with PapaParse; column 1 → `q`, column 2 (if any) → `a`.

**State** lives in module-level globals in `script.js` (`questions`, `data`,
`currentQuestion`, `shuffle`, `previousQuestions`, etc.). The current collection is reflected
in the URL via `?collection=<name>` (`history.pushState`), so a deep link auto-opens that
collection on load.

**LaTeX:** all user-facing text goes through `setMathText(element, text)` rather than
direct `textContent` assignment, so math renders everywhere (cards, list view). Supported
delimiters: `$...$` / `\(...\)` inline, `$$...$$` / `\[...\]` display.

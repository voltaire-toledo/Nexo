# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Nexo is an offline-first, single-file browser tool that finds and merges duplicate entries in **unencrypted Bitwarden JSON exports**. It never touches the network and never displays secret values (passwords, TOTP, FIDO2). The product is `Nexo.html` — open it directly in a browser; there is no build step, no bundler, and zero runtime dependencies.

## Critical architecture fact

**`Nexo.html` is the entire application.** All real logic — parsing, duplicate clustering, scoring, conflict/stub detection, merge synthesis, rendering, and CLI-script generation — lives in the single inline `<script>` block starting at `Nexo.html:2294` (CSS is the `<style>` block above it). Everything before that line is HTML/CSS.

`vault-logic.js` and `test-vault.js` are **standalone stubs/scratch files**, not imports. `Nexo.html` does not load them (the CSP forbids external scripts). `vault-logic.js` contains a simplified, out-of-date copy of a couple of functions; the README's claim that "all logic is in vault-logic.js" is inaccurate — trust `Nexo.html`. When changing behavior, edit `Nexo.html`. Only touch the stubs if the task is specifically about them.

### Pipeline inside Nexo.html (follow this order when tracing behavior)
1. `handleFileUpload` → `parseAndAnalyzeData` → `validateBitwardenFormat` — rejects encrypted exports.
2. `parseItemsSafely` / `createSafeItem` — maps raw items into a **safe shape** that records `hasPassword`/`hasTOTP`/`hasFido2` booleans and intentionally avoids surfacing secret values in the UI. Preserve this boundary: the UI must never render real password/TOTP/FIDO2 values (only presence indicators and `maskPassword`).
3. `findDuplicates` → `createCluster` — groups by login/card/identity/name keys.
4. `rankAndSuggest` + `isStub` + `calculateClusterMatchScore` — weighted scoring (see PRD.md §4: favorite +10, password history +5, +1/field, native folder +20, recency tiebreaker). Decides which records are stubs to delete vs. conflicts to protect.
5. `buildClusterMatchTags` / `buildItemComparisonChips` / `buildCompactItemDetails` — differential UI (the `≠` wavy-underline highlighting of fields that diverge).
6. `previewMerge` → `synthesizeRecord` → `executeMerge` — creates a union record placed in a `[ MERGED ]` folder.
7. Output: `exportCleanedData` (cleaned JSON) and `showCLIScripts` (generates Bash + PowerShell `bw` deletion scripts).

### Known wart
There are **two `showCLIScripts` definitions** (`Nexo.html:4222` and `Nexo.html:4400`); the second shadows the first. If you edit CLI-script generation, edit the live one (the later definition) and consider removing the dead one.

## Running / testing

There is no test framework. Verification is manual and offline:

- **Run the app**: open `Nexo.html` in a browser (double-click, or `start Nexo.html` on Windows).
- **CLI smoke-test of an export's shape**: `node test-vault.js <path-to-export.json>` — prints item/folder counts and a sample; does not exercise the real clustering engine.
- **Manual test plan**: `TEST_GUIDE.md` is the authoritative checklist (security/offline checks, selection, export, dark mode, keyboard shortcuts).
- `vault.json` and `.playground/*.json` are sample/real-shaped Bitwarden exports for manual testing.

### Security invariants to verify after any change (from TEST_GUIDE.md)
- **Zero network requests** — DevTools Network tab must stay empty. No CDNs, fonts, or remote `src`.
- **No CSP violations** — the page ships a strict CSP at `Nexo.html:7` (`default-src 'none'`; inline script/style only; `img-src data:`). Any external resource or eval will break it.
- **No secrets in the DOM** — searching the rendered Sources for `password`/`totp`/`fido2` should only hit presence checks/comments, never value access.

## Theming

UI uses the "Burned Teal" palette via CSS variables in `:root` (anchor `#233F4C`). Dark mode is automatic via `@media (prefers-color-scheme: dark)` — there is no manual toggle, so test both by switching the OS theme and reloading.

## Releasing

Releases are tag-triggered. Pushing a tag matching `v*` or `X.Y.Z` runs `.github/workflows/release.yml`, which bundles `Nexo.html` + docs + `assets/` into `Nexo-<tag>.zip` and publishes a GitHub Release. `RELEASE.md` is the step-by-step manual procedure. `origin` is `https://github.com/voltaire-toledo/Nexo.git`.

## Direction (not yet built)

`AUTOMATION_NOTES.md` describes the intended evolution: extract the clustering/scoring/merge core out of the DOM into a shared module, add Bitwarden CLI (`bw`) adapters for live intake/apply, and add a TUI as a second client. None of this exists yet — today everything is coupled to the DOM inside `Nexo.html`. Keep this in mind if asked to "modularize" or add a non-browser entry point.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

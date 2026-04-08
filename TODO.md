# Nexo - TODO

**Last Updated:** March 31, 2026  
**Project Directory:** `/Users/me/CODE/gh-me/bw-dupefinder/`

## Legend
- [ ] Not Started
- [🚧] In Progress
- [✅] Complete
- [⏸️] Blocked/Deferred

---

## Phase 1: Core Functionality (Complete ✅)
- [✅] Create `Nexo.html` base file
- [✅] Implement intelligent duplicate detection engine (4 strategies)
- [✅] Build file validation & security checks (CSP, extension detection)

## Phase 2: User Interface (Complete ✅)
- [✅] Create cluster grouping and matching criteria tags
- [✅] Implement detailed item cards (Name, User, Folder, Dates, Notes)
- [✅] Add batch actions ("Keep Newest", "Select All")
- [✅] Implement "Vault Health" completeness scoring

## Phase 3: Export & Security (Complete ✅)
- [✅] Implement Cleaned JSON Export (Migration Workflow)
- [✅] Add "Clear Data" and memory wiping features
- [✅] Sanitize all user data (textContent implementation)

## Phase 4: Polish & UX (Complete ✅)
- [✅] Implement keyboard shortcuts with GitHub-style `<kbd>` CSS
- [✅] Add dark mode and responsive breakpoints
- [✅] Implement smooth scrolling and "Back to Top" functionality

## Phase 5: Nexo Intelligence Engine (Complete ✅)
- [✅] Implement Weighted Scoring (Favorite, History, Completeness)
- [✅] Build Primary Key Grouping (Login, Card, Identity)
- [✅] Add SSO Suffix Detection (prevent auto-selection)
- [✅] Add Import Folder Prioritization
- [✅] Implement Conflict Detection (Password mismatch)

## Phase 6: Synthesis & Merging (Complete ✅)
- [✅] Implement "Review & Merge" UI Workflow
- [✅] Build Synthesis Engine (Union of URIs, Appended Notes)
- [✅] Automate original-item deletion upon merge approval
- [✅] Create dynamic `[ MERGED ]` folder targeting

## Phase 7: Precision Pro Refinement (Complete ✅)
- [✅] Implement **Burned Teal** Brand Palette (#233F4C)
- [✅] Implement **Differential Highlighting** (≠ icons + wavy underlines)
- [✅] Fix double FileOpen dialog bug
- [✅] Relocate liability disclaimer to footer band

## Phase 8: Automation & Skills (Complete ✅)
- [✅] Create `export_vault.sh` with source-safe `safe_exit` logic
- [✅] Codify `airgapped-utility` workspace skill
- [✅] Codify `pro-utilitarian-ui` workspace skill

---

## Current Status Summary

### ✅ Implementation Complete (v1.2)
Nexo is now a full-fledged duplicate-cleanup engine. It doesn't just find duplicates; it highlights their differences and offers a safer path to synthesize related records.

### 🚧 Final Testing (Future Session)
1. Verify synthesized JSON imports correctly into Bitwarden Mobile apps.
2. Performance test with 20,000+ items to ensure wavy-underline rendering remains fluid.

## Phase 9: UI/UX Review Flow Refactor (In Progress 🚧)
- [🚧] Replace the long cluster-card feed with a triage-first list-detail layout.
- [🚧] Add review tabs for `Needs Review`, `Merge Candidates`, `Conflicts`, and `All Clusters`.
- [🚧] Introduce compact cluster rows with one selected cluster shown in a focused compare panel.
- [🚧] Keep field-level diffs, merge previews, and destructive actions behind progressive disclosure.
- [⏸️] Defer the REPL-style terminal confirmation pane to the next release.
- [ ] Define the "default triage queue" ordering so the riskiest records appear first.
- [ ] Add a compact row schema for cluster type, confidence, actions needed, and suggested outcome.
- [ ] Design a side-by-side compare panel that highlights only differing fields by default.
- [ ] Design a merge preview card that summarizes what will be preserved before approval.
- [ ] Add a mobile drill-in review flow that preserves context when the detail panel takes over the screen.
- [ ] Validate that the new review flow can handle 1,000+ records without feeling visually noisy.

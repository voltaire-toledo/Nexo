# Graph Report - .  (2026-04-30)

## Corpus Check
- 17 files · ~114,815 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 162 nodes · 233 edges · 26 communities detected
- Extraction: 88% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]

## God Nodes (most connected - your core abstractions)
1. `Nexo Application` - 31 edges
2. `isoFor()` - 12 edges
3. `Bitwarden JSON Export` - 12 edges
4. `pushItems()` - 11 edges
5. `makeLoginItem()` - 10 edges
6. `makeLoginItem (generate-test-vault.js)` - 8 edges
7. `Bitwarden Vault` - 8 edges
8. `uniqueNoiseRecord()` - 7 edges
9. `Nexo.html — Main Application` - 7 edges
10. `Nexo Home Page UI` - 7 edges

## Surprising Connections (you probably didn't know these)
- `parseItemsSafely (vault-logic.js)` --semantically_similar_to--> `parseItemsSafely (Nexo.html)`  [INFERRED] [semantically similar]
  vault-logic.js → Nexo.html
- `findDuplicates (vault-logic.js)` --semantically_similar_to--> `findDuplicates (Nexo.html)`  [INFERRED] [semantically similar]
  vault-logic.js → Nexo.html
- `calculateCompleteness (test-vault.js)` --semantically_similar_to--> `calculateCompleteness (Nexo.html)`  [INFERRED] [semantically similar]
  test-vault.js → Nexo.html
- `getFolderName (test-vault.js)` --semantically_similar_to--> `getFolderName (Nexo.html)`  [INFERRED] [semantically similar]
  test-vault.js → Nexo.html
- `TEST_GUIDE.md — Quick Test Guide` --references--> `test.json — Deterministic Vault Fixture`  [AMBIGUOUS]
  TEST_GUIDE.md → generate-test-vault.js

## Hyperedges (group relationships)
- **Test Fixture Scenario Families (generator, fixture, PRD v2 spec)** — generate_test_vault_script, generate_test_vault_testjson, prd_v2_test_fixture_strategy [EXTRACTED 1.00]
- **Duplicate Detection Pipeline (parse → find → cluster → rank)** — nexo_html_parseitemssafely, nexo_html_findduplicates, nexo_html_createcluster, nexo_html_rankandsuggest [INFERRED 0.90]
- **v2 Keep-First Review Model (PRD v2, Lessons Learned, Comparison State)** — prd_v2_keep_first_model, lessons_delete_first_antipattern, prd_v2_comparison_state_layer [EXTRACTED 1.00]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.22
Nodes (24): baseItem(), cardCluster(), conflictCluster(), exactReasonCluster(), identityCluster(), isoFor(), makeCardItem(), makeCustomFields() (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (16): AUTOMATION_NOTES.md — Automation & TUI Feasibility, Shared Analysis Core (Adapter Architecture), Bitwarden Export JSON Format, Differential Highlighting (≠ wavy underlines), generate-test-vault.js — Deterministic Test Vault Generator, test.json — Deterministic Vault Fixture, Modularization Recommendation (core/adapters/ui separation), Nexo.html — Main Application (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (16): baseItem (generate-test-vault.js), cardCluster (generate-test-vault.js), conflictCluster (generate-test-vault.js), createRng (generate-test-vault.js), exactReasonCluster (generate-test-vault.js), identityCluster (generate-test-vault.js), makeCardItem (generate-test-vault.js), makeIdentityItem (generate-test-vault.js) (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (15): Stub Detection (Subset Record Identification), buildClusterMatchTags (Nexo.html), calculateCompleteness (Nexo.html), createCluster (Nexo.html), extractDomain (Nexo.html), findDuplicates (Nexo.html), isStub (Nexo.html), rankAndSuggest (Nexo.html) (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.21
Nodes (12): Disclaimer & Legal Notice, Nexo App UI - Main Screen (dlmodes), Nexo Application, Nexo Dark Theme UI Screenshot, Nexo Dark UI Theme, GitHub Repository Link, Nexo Light Theme UI, Offline Browser-Side Processing (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.31
Nodes (10): Central Accent Circle, Rounded Square Background, Nexo Brand Identity, Amber/Orange Accent Color (#C9822B), Cream/Off-White Stroke Color (#F3EFE4), Dark Teal Background Color (#1E3D46), Diagonal Connecting Stroke, Stylized Letter N Letterform (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.33
Nodes (7): Bitwarden Vault, Bitwarden CLI Export Tab, Step 1: Export Vault (Unencrypted JSON), Offline / Private Processing Mode, Vault Merge Feature, Vault Merger Feature, Web Vault Export Tab

### Community 7 - "Community 7"
Cohesion: 0.43
Nodes (7): Bitwarden JSON Export, File Upload Drop Zone, CLI Deletion Script, Duplicate Finder Feature, JSON Export Workflow (Migration), Recommended Workflow (Surgical & Safe), Recommended Workflow (Surgical and Safe)

### Community 8 - "Community 8"
Cohesion: 0.4
Nodes (5): Disclaimer & Liability Warning, File Upload Drop Zone, Nexo Home Page UI, Legal Notice - Bitwarden Trademark, Select File Button

### Community 9 - "Community 9"
Cohesion: 0.4
Nodes (5): CLI Deletion Script, TOTP and Passkeys Records, Vault Trash (Soft Delete), TOTP and Passkeys (Recoverable Records), Bitwarden Vault Trash

### Community 10 - "Community 10"
Cohesion: 0.5
Nodes (4): createSafeItem (Nexo.html), maskPassword (Nexo.html), parseItemsSafely (Nexo.html), parseItemsSafely (vault-logic.js)

### Community 11 - "Community 11"
Cohesion: 0.83
Nodes (4): LESSONS_LEARNED.md — v1 to v2 Retrospective, PRD.md — Nexo v1.2 Product Requirements, PRD_V2.md — Nexo v2 Product Requirements, TODO.md — Project Phase Tracker

### Community 12 - "Community 12"
Cohesion: 0.5
Nodes (4): [ MERGED ] Folder Targeting, Synthetic Merged Record Anti-Pattern, Review & Merge Synthesis Workflow, In-Place Amendment Merge Model

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (4): Duplicate Detection Feature, JSON Import Warning - Duplicate Risk, Alternative JSON Export Workflow (For Migrations), Recommended Workflow (Surgical & Safe)

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (3): Bitwarden CLI Export Tab, Step 1 - Export Vault (Unencrypted JSON), Web Vault Export Tab

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (3): Bitwarden CLI, Bitwarden Web Vault, Step 1: Export Vault (Unencrypted JSON)

### Community 18 - "Community 18"
Cohesion: 0.67
Nodes (3): Warning: Import to Non-Empty Vault Creates Duplicates, Alternative JSON Export Workflow (For Migrations), Password Manager Migration (1Password, Proton Pass)

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (2): getFolderName (Nexo.html), getFolderName (test-vault.js)

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (2): Delete-First Review Anti-Pattern, Keep-First Review Model

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (2): Bitwarden CLI Adapter, TUI (Terminal UI) Second Client Concept

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (1): exportCleanedData (Nexo.html)

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (1): Zero-Keep Warning State

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (1): Cluster Resolution State

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (1): Action Package (Durable Review + Execution Contract)

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (1): Selective Cleaning Workflow

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (1): Seamless Migration Workflow (Cross-Manager)

## Ambiguous Edges - Review These
- `test.json — Deterministic Vault Fixture` → `TEST_GUIDE.md — Quick Test Guide`  [AMBIGUOUS]
  TEST_GUIDE.md · relation: references

## Knowledge Gaps
- **57 isolated node(s):** `extractDomain (Nexo.html)`, `getFolderName (Nexo.html)`, `exportCleanedData (Nexo.html)`, `buildClusterMatchTags (Nexo.html)`, `maskPassword (Nexo.html)` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 19`** (2 nodes): `getFolderName (Nexo.html)`, `getFolderName (test-vault.js)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `Delete-First Review Anti-Pattern`, `Keep-First Review Model`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `Bitwarden CLI Adapter`, `TUI (Terminal UI) Second Client Concept`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `exportCleanedData (Nexo.html)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `Zero-Keep Warning State`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `Cluster Resolution State`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `Action Package (Durable Review + Execution Contract)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `Selective Cleaning Workflow`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `Seamless Migration Workflow (Cross-Manager)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `test.json — Deterministic Vault Fixture` and `TEST_GUIDE.md — Quick Test Guide`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `Nexo Application` connect `Community 4` to `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 13`, `Community 16`, `Community 17`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `Nexo Logo` connect `Community 5` to `Community 4`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `Nexo Home Page UI` connect `Community 8` to `Community 18`, `Community 4`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Nexo Application` (e.g. with `Nexo Dark UI Theme` and `Bitwarden JSON Export`) actually correct?**
  _`Nexo Application` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Bitwarden JSON Export` (e.g. with `Nexo Application` and `Step 1: Export Vault (Unencrypted JSON)`) actually correct?**
  _`Bitwarden JSON Export` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `extractDomain (Nexo.html)`, `getFolderName (Nexo.html)`, `exportCleanedData (Nexo.html)` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
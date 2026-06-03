# Graph Report - .  (2026-06-02)

## Corpus Check
- 27 files · ~117,694 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 164 nodes · 210 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 77% EXTRACTED · 23% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 166,685 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Bitwarden Export & App Intake|Bitwarden Export & App Intake]]
- [[_COMMUNITY_Merge & Safe-Item Pipeline|Merge & Safe-Item Pipeline]]
- [[_COMMUNITY_Graphify Extraction Pipeline|Graphify Extraction Pipeline]]
- [[_COMMUNITY_Graphify Outputs & Query|Graphify Outputs & Query]]
- [[_COMMUNITY_Scoring & Stub Detection|Scoring & Stub Detection]]
- [[_COMMUNITY_Nexo Logo Design|Nexo Logo Design]]
- [[_COMMUNITY_Graph Build & Analysis|Graph Build & Analysis]]
- [[_COMMUNITY_Export Script & Automation Roadmap|Export Script & Automation Roadmap]]
- [[_COMMUNITY_Deletion Safety & Recoverable Records|Deletion Safety & Recoverable Records]]
- [[_COMMUNITY_test-vault.js Module|test-vault.js Module]]
- [[_COMMUNITY_Vault Export Tabs|Vault Export Tabs]]
- [[_COMMUNITY_Differential Comparison UI|Differential Comparison UI]]
- [[_COMMUNITY_Migration Import Workflow|Migration Import Workflow]]
- [[_COMMUNITY_Audit Trail & Honesty Rules|Audit Trail & Honesty Rules]]
- [[_COMMUNITY_Release Packaging|Release Packaging]]
- [[_COMMUNITY_test-vault.js Script|test-vault.js Script]]
- [[_COMMUNITY_vault-logic.js Logic Module|vault-logic.js Logic Module]]

## God Nodes (most connected - your core abstractions)
1. `Nexo Application` - 31 edges
2. `Bitwarden JSON Export File` - 12 edges
3. `graph.json output` - 12 edges
4. `Bitwarden Vault` - 8 edges
5. `Nexo Home Page UI` - 7 edges
6. `Semantic extraction (Part B subagents)` - 7 edges
7. `graphify pipeline` - 6 edges
8. `AST structural extraction (Part A)` - 6 edges
9. `Build graph, cluster, analyze` - 6 edges
10. `findDuplicates` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Bitwarden CLI Adapter` --conceptually_related_to--> `export_vault.sh Bitwarden Export Script`  [INFERRED]
  AUTOMATION_NOTES.md → export_vault.sh
- `Conflict Detection` --references--> `createCluster`  [INFERRED]
  PRD.md → Nexo.html
- `Union Synthesis Logic` --references--> `synthesizeRecord`  [INFERRED]
  PRD.md → Nexo.html
- `Nexo README` --references--> `synthesizeRecord`  [INFERRED]
  README.md → Nexo.html
- `Nexo TODO Tracker` --references--> `export_vault.sh Bitwarden Export Script`  [EXTRACTED]
  TODO.md → export_vault.sh

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Core build pipeline: detect to outputs** — graphify_skill_detect, graphify_skill_ast_extraction, graphify_skill_semantic_extraction, graphify_skill_merge_extract, graphify_skill_build_cluster, graphify_skill_graph_json [EXTRACTED 0.90]
- **Read-time graph query interfaces** — references_query_query, references_query_path, references_query_explain, references_exports_mcp_server [INFERRED 0.80]
- **Graph export formats** — references_exports_neo4j, references_exports_svg, references_exports_graphml, graphify_skill_html_export, graphify_skill_obsidian_export [EXTRACTED 0.85]
- **Merge Synthesis Pipeline** — nexo_previewmerge, nexo_synthesizerecord, nexo_executemerge, nexo_mergedfolder [EXTRACTED 0.85]
- **Ingest and Cluster Pipeline** — nexo_handlefileupload, nexo_parseandanalyzedata, nexo_validatebitwardenformat, nexo_parseitemssafely, nexo_findduplicates, nexo_createcluster [EXTRACTED 0.85]
- **Weighted Scoring and Ranking Engine** — nexo_rankandsuggest, nexo_isstub, nexo_calculateclustermatchscore, prd_weighted_scoring [INFERRED 0.85]

## Communities (18 total, 5 thin omitted)

### Community 0 - "Bitwarden Export & App Intake"
Cohesion: 0.10
Nodes (38): Bitwarden CLI, Bitwarden JSON Export File, Bitwarden Vault, Bitwarden Web Vault, Disclaimer & Legal Notice, Nexo App UI - Main Screen (dlmodes), Duplicate Detection Feature, File Upload Drop Zone (+30 more)

### Community 1 - "Merge & Safe-Item Pipeline"
Cohesion: 0.11
Nodes (22): Action Package Schema, Dry-Run Verification Step, Nexo CLAUDE.md Guidance, buildMergeDraft, createSafeItem, executeMerge, exportCleanedData, extractDomain (+14 more)

### Community 2 - "Graphify Extraction Pipeline"
Cohesion: 0.12
Nodes (20): graphify skill trigger, AST structural extraction (Part A), Cumulative cost/token tracker, graphify.detect.detect (Step 2), Find-GraphifyPython interpreter detection, Gemini extraction backend, Merge AST + semantic (Part C), graphify pipeline (+12 more)

### Community 3 - "Graphify Outputs & Query"
Cohesion: 0.14
Nodes (16): Fast path for existing graph, graph.json output, HTML graph visualization export, Obsidian vault export, graphify add URL ingest, GraphML export, MCP stdio server, Neo4j Cypher export (+8 more)

### Community 4 - "Scoring & Stub Detection"
Cohesion: 0.19
Nodes (13): buildClusterMatchTags, calculateClusterMatchScore, calculateCompleteness, createCluster, isImportFolder, isStub, normalizeUsername, rankAndSuggest (+5 more)

### Community 5 - "Nexo Logo Design"
Cohesion: 0.31
Nodes (10): Central Accent Circle, Rounded Square Background, Nexo Brand Identity, Amber/Orange Accent Color (#C9822B), Cream/Off-White Stroke Color (#F3EFE4), Dark Teal Background Color (#1E3D46), Diagonal Connecting Stroke, Stylized Letter N Letterform (+2 more)

### Community 6 - "Graph Build & Analysis"
Cohesion: 0.25
Nodes (9): Build graph, cluster, analyze, Community Detection, God Nodes, GRAPH_REPORT.md output, Knowledge Graph, Label communities, Wiki export, Whisper transcribe_all (+1 more)

### Community 7 - "Export Script & Automation Roadmap"
Cohesion: 0.29
Nodes (7): Bitwarden CLI Adapter, Shared Core Extraction, TUI Second Client, export_vault.sh script, safe_exit(), export_vault.sh Bitwarden Export Script, Nexo TODO Tracker

### Community 8 - "Deletion Safety & Recoverable Records"
Cohesion: 0.40
Nodes (5): CLI Deletion Script, TOTP and Passkeys Records, Vault Trash, TOTP and Passkeys (Recoverable Records), Bitwarden Vault Trash

### Community 10 - "Vault Export Tabs"
Cohesion: 0.67
Nodes (3): Bitwarden CLI Export Tab, Step 1 - Export Vault (Unencrypted JSON), Web Vault Export Tab

### Community 11 - "Differential Comparison UI"
Cohesion: 0.67
Nodes (3): buildCompactItemDetails, buildItemComparisonChips, Differential Highlighting

### Community 12 - "Migration Import Workflow"
Cohesion: 0.67
Nodes (3): Warning: Import to Non-Empty Vault Creates Duplicates, Alternative JSON Export Workflow (For Migrations), Password Manager Migration (1Password, Proton Pass)

## Knowledge Gaps
- **55 isolated node(s):** `fs`, `path`, `test-vault.js — CLI Vault Analysis Script`, `vault-logic.js — Pure Logic Module`, `Nexo App UI - Main Screen (dlmodes)` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Nexo Application` connect `Bitwarden Export & App Intake` to `Vault Export Tabs`, `Nexo Logo Design`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `Build graph, cluster, analyze` connect `Graph Build & Analysis` to `Graphify Extraction Pipeline`, `Graphify Outputs & Query`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `graph.json output` connect `Graphify Outputs & Query` to `Graph Build & Analysis`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Nexo Application` (e.g. with `Bitwarden JSON Export File` and `Nexo Dark UI Theme`) actually correct?**
  _`Nexo Application` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Bitwarden JSON Export File` (e.g. with `Nexo Application` and `Duplicate Finder Feature`) actually correct?**
  _`Bitwarden JSON Export File` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `graph.json output` (e.g. with `HTML graph visualization export` and `Obsidian vault export`) actually correct?**
  _`graph.json output` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `Bitwarden Vault` (e.g. with `Bitwarden CLI Export Tab` and `Duplicate Finder Feature`) actually correct?**
  _`Bitwarden Vault` has 6 INFERRED edges - model-reasoned connections that need verification._
# Graph Report - VT-Nexo  (2026-06-03)

## Corpus Check
- 20 files · ~116,739 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 337 nodes · 367 edges · 30 communities (22 shown, 8 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8fc70ff5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

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
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]

## God Nodes (most connected - your core abstractions)
1. `Nexo Application` - 31 edges
2. `Nexo - TODO` - 12 edges
3. `Bitwarden JSON Export File` - 12 edges
4. `graph.json output` - 12 edges
5. `/graphify` - 11 edges
6. `What You Must Do When Invoked` - 11 edges
7. `Quick Start Testing` - 11 edges
8. `Release Guide` - 9 edges
9. `Quick Test Guide` - 9 edges
10. `Product Requirements Document: Nexo` - 8 edges

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

## Communities (30 total, 8 thin omitted)

### Community 0 - "Bitwarden Export & App Intake"
Cohesion: 0.08
Nodes (44): Bitwarden CLI, Bitwarden CLI Export Tab, Bitwarden JSON Export File, Bitwarden Vault, Bitwarden Web Vault, Disclaimer & Legal Notice, Nexo App UI - Main Screen (dlmodes), Duplicate Detection Feature (+36 more)

### Community 1 - "Merge & Safe-Item Pipeline"
Cohesion: 0.10
Nodes (24): Action Package Schema, Dry-Run Verification Step, Shared Core Extraction, TUI Second Client, Nexo CLAUDE.md Guidance, buildMergeDraft, createSafeItem, executeMerge (+16 more)

### Community 2 - "Graphify Extraction Pipeline"
Cohesion: 0.08
Nodes (29): graphify skill trigger, AST structural extraction (Part A), Build graph, cluster, analyze, Community Detection, Cumulative cost/token tracker, graphify.detect.detect (Step 2), Find-GraphifyPython interpreter detection, Gemini extraction backend (+21 more)

### Community 3 - "Graphify Outputs & Query"
Cohesion: 0.14
Nodes (16): Fast path for existing graph, graph.json output, HTML graph visualization export, Obsidian vault export, graphify add URL ingest, GraphML export, MCP stdio server, Neo4j Cypher export (+8 more)

### Community 4 - "Scoring & Stub Detection"
Cohesion: 0.13
Nodes (18): Bitwarden CLI Adapter, export_vault.sh script, safe_exit(), export_vault.sh Bitwarden Export Script, buildClusterMatchTags, calculateClusterMatchScore, calculateCompleteness, createCluster (+10 more)

### Community 5 - "Nexo Logo Design"
Cohesion: 0.31
Nodes (10): Central Accent Circle, Rounded Square Background, Nexo Brand Identity, Amber/Orange Accent Color (#C9822B), Cream/Off-White Stroke Color (#F3EFE4), Dark Teal Background Color (#1E3D46), Diagonal Connecting Stroke, Stylized Letter N Letterform (+2 more)

### Community 6 - "Graph Build & Analysis"
Cohesion: 0.07
Nodes (26): 10. Cross-Browser Testing (Optional), 1. Open the Tool, 2. Security Verification (Before Loading Data), 3. Test with Your Bitwarden Export, 4. Review Duplicate Detection, 5. Test Selection Features, 6. Test Export Functionality, 7. Test Clear Data (+18 more)

### Community 7 - "Export Script & Automation Roadmap"
Cohesion: 0.11
Nodes (18): 1. Split "review" from "execution format", 2. Add a CLI-assisted intake mode, 3. Save a review package, 4. Add a dry-run verification step, Adapters, Architecture Recommendation, Automation Notes, Bottom Line (+10 more)

### Community 8 - "Deletion Safety & Recoverable Records"
Cohesion: 0.40
Nodes (5): CLI Deletion Script, TOTP and Passkeys Records, Vault Trash, TOTP and Passkeys (Recoverable Records), Bitwarden Vault Trash

### Community 10 - "Vault Export Tabs"
Cohesion: 0.11
Nodes (18): 1. Executive Summary, 2. Goals & Objectives, 3.1 Nexo Matching Engine, 3.2 Synthesis & Merging, 3.3 Precision UI, 3. Functional Requirements, 4.1 Scoring Weights, 4. Technical Architecture (+10 more)

### Community 11 - "Differential Comparison UI"
Cohesion: 0.67
Nodes (3): buildCompactItemDetails, buildItemComparisonChips, Differential Highlighting

### Community 12 - "Migration Import Workflow"
Cohesion: 0.13
Nodes (14): Current Status Summary, 🚧 Final Testing (Future Session), ✅ Implementation Complete (v1.2), Legend, Nexo - TODO, Phase 1: Core Functionality (Complete ✅), Phase 2: User Interface (Complete ✅), Phase 3: Export & Security (Complete ✅) (+6 more)

### Community 14 - "Audit Trail & Honesty Rules"
Cohesion: 0.07
Nodes (26): EXTRACTED/INFERRED/AMBIGUOUS audit trail, For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands (+18 more)

### Community 18 - "Community 18"
Cohesion: 0.17
Nodes (10): Critical architecture fact, Direction (not yet built), graphify, Known wart, Pipeline inside Nexo.html (follow this order when tracing behavior), Releasing, Running / testing, Security invariants to verify after any change (from TEST_GUIDE.md) (+2 more)

### Community 19 - "Community 19"
Cohesion: 0.17
Nodes (11): 1. Selective Cleaning (Safe & Recoverable), 2. Seamless Migration (Cross-Manager), 3. Expert Mode: Import the Cleaned JSON back into your Vault, ⚠️ Conflict & SSO Protection, ≠ Differential Highlighting, ⚠️ Disclaimer & Liability Warning, Features, Legal Notice (+3 more)

### Community 20 - "Community 20"
Cohesion: 0.20
Nodes (9): 1. Review the Working Tree, 2. Stage the Release Files, 3. Commit the Changes, 4. Push the Main Branch, 5. Create and Push the Release Tag, 6. Verify the Release, 7. If You Need to Rebuild the Release, Prerequisites (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (7): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 22 - "Community 22"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 23 - "Community 23"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 24 - "Community 24"
Cohesion: 0.50
Nodes (3): For /graphify explain, For /graphify path, graphify reference: query, path, explain

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **179 isolated node(s):** `fs`, `path`, `graphify`, `Usage`, `What graphify is for` (+174 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Nexo Application` connect `Bitwarden Export & App Intake` to `Nexo Logo Design`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `Build graph, cluster, analyze` connect `Graphify Extraction Pipeline` to `Graphify Outputs & Query`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `graph.json output` connect `Graphify Outputs & Query` to `Graphify Extraction Pipeline`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Nexo Application` (e.g. with `Bitwarden JSON Export File` and `Nexo Dark UI Theme`) actually correct?**
  _`Nexo Application` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Bitwarden JSON Export File` (e.g. with `Nexo Application` and `Duplicate Finder Feature`) actually correct?**
  _`Bitwarden JSON Export File` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `graph.json output` (e.g. with `HTML graph visualization export` and `Obsidian vault export`) actually correct?**
  _`graph.json output` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fs`, `path`, `graphify` to the rest of the system?**
  _186 weakly-connected nodes found - possible documentation gaps or missing edges._
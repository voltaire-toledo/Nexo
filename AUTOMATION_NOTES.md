# Automation Notes

## Goal

Reduce the gap between analysis and applying changes so Nexo is not permanently tied to:

1. manual Bitwarden JSON export
2. browser-only review
3. manual re-import or script handoff

## What The Current App Already Has

- A local analysis engine that groups duplicates into clusters.
- A scoring layer that can already distinguish merge candidates from conflicts.
- A change model that already knows which records are marked for deletion and which synthetic merge records should be created.
- A generated CLI handoff path in [Nexo.html](/Users/me/CODE/gh-me/Nexo/Nexo.html), which proves the product already has an implicit operation plan, even if the final execution format is still in flux.

## Near-Term Automation Wins

### 1. Split "review" from "execution format"

The UI should produce one internal action package, then render that package into different adapters:

- clean JSON export
- Bash or PowerShell plan
- future direct CLI apply mode

This keeps the review UX stable while the script format evolves.

### 2. Add a CLI-assisted intake mode

Instead of asking the user to export JSON manually, add a local companion command that:

- checks `bw status`
- unlocks with `bw unlock --raw` when needed
- retrieves the current vault data
- launches the same analysis engine

This is the fastest route to reducing friction without rewriting the product as a TUI first.

### 3. Save a review package

Large vault cleanups are session-based work. A saved package should preserve:

- selected queue and filters
- pending deletions
- merge drafts
- review notes
- source metadata such as vault snapshot time

That package becomes the durable contract between analysis and execution.

### 4. Add a dry-run verification step

Before any apply step, Nexo should re-check that each targeted record still exists and still matches the expected fingerprint.

That matters much more in a live CLI or TUI workflow than it does in the current export-only flow.

## TUI Feasibility

### Short Answer

Yes, a TUI is feasible, but the right first move is not "replace the browser app with a terminal UI."

The right first move is:

1. extract the analysis and change-planning logic into a shared core
2. add a live Bitwarden adapter
3. build a thin TUI on top of that shared core

### Why A TUI Is Plausible

Bitwarden's CLI already exposes enough surface area for a live workflow:

- vault export
- item creation
- item editing
- item deletion
- vault sync
- a local `bw serve` mode that exposes a REST API from the CLI

Official reference:

- https://bitwarden.com/help/cli/

That means Nexo does not need browser file upload to exist as a product. It only needs a reliable adapter into the vault data plane.

### Architecture Recommendation

#### Core

Move the clustering, scoring, conflict detection, merge synthesis, and action planning into a shared module that is independent from the DOM.

#### Adapters

Implement separate data adapters:

- `export-json` adapter
- `bw-cli` adapter
- future `bw-serve` adapter

Implement separate execution adapters:

- cleaned JSON writer
- CLI action package renderer
- live apply executor

#### UIs

Keep the browser UI as the visual review workbench.

Add a TUI later as a second client for the same core:

- queue on the left
- selected cluster detail on the right
- command bar for approve, merge, hold, and apply

### Risks Specific To A Live TUI

- No real transaction boundary: create and delete steps can partially succeed unless Nexo adds its own checkpointing.
- Vault drift: a record can change between analysis and apply.
- Sync timing: the client should explicitly sync before scan and after apply.
- Error recovery: failed apply operations need a resumable journal.

Those are solvable, but they argue for a shared action package and resumable apply model before a full live-edit terminal product.

### Recommended Sequence

1. Extract the analysis engine into a shared core module.
2. Introduce a formal action package schema.
3. Add CLI-assisted intake.
4. Add CLI-assisted apply with dry-run validation.
5. Build a thin TUI on top of the shared core and live adapter.

### Bottom Line

The TUI idea is viable, but it should be treated as a second interface over a shared core, not as a rewrite target.

If the goal is to remove manual export and re-import as soon as possible, the fastest path is:

1. keep the browser review workbench
2. add a local Bitwarden CLI adapter
3. standardize the action package
4. build the TUI once the live adapter is stable

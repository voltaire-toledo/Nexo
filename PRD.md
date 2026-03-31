# Product Requirements Document: Nexo

**Version:** 1.2  
**Last Updated:** March 31, 2026  
**Status:** Implementation Complete  
**Working Directory:** `/Users/me/CODE/gh-me/bw-dupefinder/`

## 1. Executive Summary

Nexo is a security-focused, offline-first application for cleaning Bitwarden exports. Beyond simple duplicate finding, it uses a weighted scoring engine to identify record stubs, detect password conflicts, and synthesize complementary records into unified entries.

## 2. Goals & Objectives

### Primary Goals
- **Weighted Intelligence**: Move beyond exact matches to understand "Stubs" vs. "Master" records.
- **Data Synthesis**: Offer automated "Review & Merge" for complementary data (TOTP, Notes, URIs).
- **Conflict Awareness**: Prevent accidental data loss by flagging password mismatches.
- **Brand Identity**: Implement the "Burned Teal" professional palette.

### Value Proposition
The tool reduces 10,000+ records into actionable clusters, providing visual proof of divergence (≠) and one-click synthesis, ensuring users can clean their vaults with surgical precision.

## 3. Functional Requirements

### 3.1 Nexo Matching Engine
- **FR-1.1: Weighted Scoring.** Rank items by completeness, favorite status, and revision history.
- **FR-1.2: Identity Matching.** Group items by primary keys (Username/URI, Card Number, Email) while ignoring transient metadata like SSO suffixes.
- **FR-1.3: Conflict Detection.** Flag items with identical identities but different passwords as "Conflicts" (disabling auto-selection).
- **FR-1.4: Stub Detection.** Automatically mark records for deletion if they are true subsets of a more complete record.

### 3.2 Synthesis & Merging
- **FR-2.1: Review & Merge.** Detect "Complementary" records (e.g., one has TOTP, other has Notes) and offer a synthesis workflow.
- **FR-2.2: Union Logic.** Create a new record containing the union of all URIs, appended notes, and preserved security factors.
- **FR-2.3: Folder Targeting.** Place synthesized records into a specialized `[ MERGED ]` vault folder.

### 3.3 Precision UI
- **FR-3.1: Differential Highlighting.** Use wavy underlines and bolding to pinpoint exactly which field values differ in a cluster.
- **FR-3.2: Burned Teal Palette.** High-contrast, brand-aligned theme (#233F4C Anchor).
- **FR-3.3: Action Persistence.** Sticky status bar and "Back to Top" for large-scale vault navigation.

## 4. Technical Architecture

### 4.1 Scoring Weights
- **Favorite Status**: +10 pts
- **Password History**: +5 pts
- **Completeness**: +1 pt per metadata field
- **Recency**: Tie-breaker (Newest revision wins)
- **Folder Priority**: Native folders (+20 pts) vs. Import folders.

## 5. Acceptance Criteria (v1.2)

✅ Weighted scoring engine implemented.  
✅ Field-level divergence (≠) UI implemented.  
✅ Review & Merge synthesis modal implemented.  
✅ Burned Teal branding integrated.  
✅ Terminal-safe export script provided.  

## 6. Legal Notes

- Bitwarden® is a registered trademark of Bitwarden Inc.
- Nexo is an independent project and is not affiliated with, endorsed by, or sponsored by Bitwarden Inc.

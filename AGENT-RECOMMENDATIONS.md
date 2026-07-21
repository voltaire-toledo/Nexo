# Nexo.html — Code Review & Recommendations

Scope: full review of `Nexo.html` (4,344 lines — CSS `<style>` block, HTML body, and the single inline `<script>` block starting at line 2077) covering JavaScript best practices, accessibility, DRY/YAGNI adherence, and logic/condition complexity. Line numbers refer to the current state of `Nexo.html` on branch `cosmetic-review-ux`.

This file lists what was found, why it matters, and what to do about it — ordered roughly by severity within each category. Nothing here is a blocker; the app works and is already thoughtfully built (batched rendering, `content-visibility`, WCAG-tuned CSS variables, `prefers-reduced-motion` support). The findings below are the gaps worth closing.

---

## 1. Correctness / Logic Bugs

These are the highest-priority items because they affect the accuracy of a tool whose entire value proposition is "tell me confidently which duplicate is safe to delete."

### 1.1 Fallback-grouping detection uses unsafe substring matching on a composite key
**Where:** `findDuplicates()`, `Nexo.html:2664-2721` (the sentinel check is at `Nexo.html:2703`)

```js
const domain = item.uris.length > 0 ? extractDomain(item.uris[0]) : 'no-uri';
const user = normalizeUsername(item.username) || 'no-user';
const key = `${user}|${domain}`;
...
if (key.includes('no-user') || key.includes('no-uri') || key.includes('no-number') || key.includes('no-email')) {
    // treat as fallback: also require exact name match before clustering
```

The code decides whether a group is a "real" primary-key match or a "no primary key, fall back to name match" group by searching for sentinel substrings (`'no-user'`, `'no-uri'`, etc.) inside the **joined** key string, rather than checking the actual field values before joining. Because the delimiter (`|`) doesn't prevent a substring match from spanning across the two joined fields, a perfectly ordinary domain or username can coincidentally contain one of these substrings and be misclassified.

Concrete failure case: a login with domain `casino-uri.com` — a real, parseable domain — produces the key `someuser|casino-uri.com`. `"someuser|casino-uri.com".includes('no-uri')` is **true** (`...casi` + `no-uri` + `.com`), even though this item has a perfectly valid URI and username. That group is incorrectly routed into the "fallback" branch, which additionally requires an *exact* item-name match before clustering. Two genuine duplicates (same user, same domain, different item names — a very common real-world case, e.g. imported once as "Casino Uri" and again as "casino-uri.com") will silently **not** be flagged as duplicates at all.

**Consequence:** Silent false negatives in duplicate detection that are extremely hard for a user to notice (nothing is grouped, so there's nothing on screen to raise suspicion) and hard for a developer to reproduce without knowing the exact trigger.

**Recommendation:** Compute the fallback condition from the actual field values at grouping time, not from string-searching the joined key, e.g.:
```js
const isFallbackKey = domain === 'no-uri' || user === 'no-user' /* etc. per category */;
groups.login[key] = groups.login[key] || { items: [], isFallback: isFallbackKey };
```
Then branch on `groupEntry.isFallback` instead of `key.includes(...)`.

### 1.2 Two divergent "which item is best" scoring formulas can disagree
**Where:** `getBestKeepCandidate()` (`Nexo.html:2241-2252`) vs. `rankAndSuggest()` (`Nexo.html:2787-2831`)

Both functions rank a cluster's items by "mastery," and both start from the identical formula:
```js
calculateCompleteness(item) + (item.favorite ? 10 : 0) + (item.hasPasswordHistory ? 5 : 0)
```
but `rankAndSuggest` additionally applies a native-folder priority penalty (`Nexo.html:2804-2807`, `-20` if the item lives in an "import" folder and its rival doesn't) before comparing scores. `getBestKeepCandidate` never applies that penalty.

`getBestKeepCandidate` is what decides the item labeled **"Baseline"** and displayed first in every cluster (`getClusterDisplayItems`, `Nexo.html:3444-3459`), and it's also what "100% Match" preset's `keepOne` selection mode uses (`Nexo.html:2271-2282`). `rankAndSuggest` is what actually decides which items get their checkbox pre-marked for deletion in the default/`recommended` flow.

Because the two formulas can rank differently whenever an import-folder item would otherwise win on completeness/favorite/history, it's possible for the UI to show item A as "Baseline" (implying "the one being kept") while `rankAndSuggest` has actually left item **B** unmarked and pre-selected **A** for deletion. The user sees a checked "Baseline" card with a strikethrough name — visually contradicting the label.

**Consequence:** The core trust signal of the tool (which record is safe to keep) can visually contradict the actual pre-selected action, in exactly the cases (import-folder duplicates) the ranking penalty exists to help with.

**Recommendation:** Extract one shared function, e.g. `getMasteryScore(item, { penalizeImportFolder } = {})`, and have both call sites use it with the same flag (or just always apply the folder penalty — it's hard to see why baseline-display should ignore it). This also collapses a DRY violation and a correctness bug in one fix.

### 1.3 `formatDate`'s try/catch never actually catches anything
**Where:** `Nexo.html:3783-3790`

```js
function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (e) {
        return dateStr;
    }
}
```
`new Date(garbage)` does not throw in modern JS engines — it produces an `Invalid Date` object, and `.toLocaleDateString()`/`.toLocaleTimeString()` on an invalid date return the literal string `"Invalid Date"` rather than throwing. The `catch` block is dead code that gives a false impression of defensive handling.

**Consequence:** A malformed `creationDate`/`revisionDate` in a vault export (e.g., from a third-party import) renders as the string "Invalid Date Invalid Date" in the UI instead of falling back to the raw value or an "(unknown)" placeholder, and no error is ever logged.

**Recommendation:**
```js
function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}
```

### 1.4 Generated Bash and PowerShell scripts have drifted apart
**Where:** `showCLIScripts()`, `Nexo.html:3990-4183`

The Bash generator explicitly checks that `bw` is on `PATH` before doing anything else (`Nexo.html:4061-4064`):
```bash
if ! command -v bw >/dev/null 2>&1; then
  print_failure 'Bitwarden CLI is not installed or not on PATH'
  return 1
fi
```
The PowerShell generator has no equivalent check — it goes straight to `bw unlock --raw` (`Nexo.html:4166-4171`). If `bw` isn't installed, PowerShell users get a raw, uncontextualized command-not-found error instead of the friendly message Bash users get.

**Consequence:** Inconsistent user experience between the two generated scripts for the exact same failure mode, purely because the logic was hand-duplicated rather than shared — a direct symptom of the DRY issue in §2.3 below.

**Recommendation:** Add the equivalent `Get-Command bw` check to the PowerShell template, and — per §2.3 — restructure both generators from one shared data/step model so this kind of drift can't happen again silently.

---

## 2. DRY Violations

### 2.1 Duplicated cluster-scoring formula
Same root cause as §1.2 — the completeness/favorite/history formula is copy-pasted between `getBestKeepCandidate` (`Nexo.html:2243-2244`) and `rankAndSuggest` (`Nexo.html:2800-2801`). Fixing §1.2 also fixes this.

### 2.2 `buildItemComparisonChips` is ~90 lines of near-identical repeated blocks
**Where:** `Nexo.html:3473-3559`

Every field (username, folder, URI, password, notes, TOTP, FIDO2, and then card-specific and identity-specific fields) follows the same shape:
```js
if (includeRow(other => other.someField)) {
    pushChip('Label', item.someField || '(none)', item.someField ? 'difference' : 'absent difference', ...);
}
```
repeated ~15 times with small variations in extractor/label/formatting. This is copy-paste boilerplate, not intentionally distinct logic — the kind of code where a fix or tweak (e.g., changing how "absent" values are labeled) has to be manually re-applied in 15 places, and where it's easy for one of the fifteen to accidentally skip escaping or use the wrong comparator.

**Recommendation:** Replace with a declarative field-descriptor table and a single loop:
```js
const FIELD_DESCRIPTORS = [
    { label: 'User', extractor: i => i.username, ... },
    { label: 'Folder', extractor: i => getFolderName(i.folderId), ... },
    // ...
];
FIELD_DESCRIPTORS
    .filter(f => !f.appliesTo || f.appliesTo(item.type))
    .forEach(f => { if (includeRow(f.extractor)) pushChip(f.label, f.format(item), ...); });
```
This shrinks the function to roughly a quarter of its size and makes the per-field behavior easy to audit in one place.

### 2.3 `showCLIScripts` duplicates an entire "plan" twice (Bash + PowerShell)
**Where:** `Nexo.html:3990-4183`

The function builds two ~90-line scripts via manual string concatenation (`bashScript +=`, `psScript +=`), independently encoding the same sequence of steps (check prerequisites → unlock → sync → create merges → delete items → report). Nothing enforces that the two stay in the same order or handle the same failure modes — see §1.4 for the concrete drift this has already caused.

**Recommendation:** Model the action plan once as data (e.g., `{ steps: ['checkBw', 'unlock', 'sync', 'createMerges', 'deleteItems'] }` plus the `itemsArray`/`mergesArray` payload already computed), and write two small renderers (`renderBashStep(step)` / `renderPowerShellStep(step)`) driven by that shared plan. At minimum, split the current single 230-line function into `buildBashScript(itemsArray, mergesArray)` and `buildPowerShellScript(itemsArray, mergesArray)` so each is independently readable and testable, even without unifying the templating.

### 2.4 Dead code left over from refactors
- `escapeDoubleQuoted` (`Nexo.html:4025`) is defined but never called anywhere in the file — `escapeShellSingleQuoted` and `escapePowerShellDoubleQuoted` are the ones actually used. Remove it.
- `.item-delete-checkbox` CSS class (`Nexo.html:785-791`, distinct from the actually-used `.item-delete-checkbox-inline` at `Nexo.html:881-886`) is never applied to any element — the only reference to it is a defensive `querySelector('.item-delete-checkbox-inline, .item-delete-checkbox')` fallback at `Nexo.html:2165` that will never match. This is a leftover from the "compact item details" UI refactor (per git history). Remove the unused CSS rule and drop it from the selector fallback.

**Consequence:** Minor, but dead code accumulates reviewer confusion over time — a future change to "the checkbox" risks being applied to the wrong (unused) selector.

### 2.5 "Created"/"Last Edited" pair is built twice per item
**Where:** `renderItemCard()` (`Nexo.html:3695-3704`, always rendered inline in the header) and `buildCompactItemDetails()` (`Nexo.html:3663-3674`, rendered again inside the expandable report)

Both call `renderCompactDetailPair` + `hasFieldDifferenceAgainstBaseline` for the same two fields (`creationDate`, `revisionDate`) independently. Functionally harmless (cheap computation), but it means the "created/edited" markup-and-diff logic exists in two places that must be kept in sync by hand if the format ever changes.

**Recommendation:** Extract a `buildCreatedEditedPairs(item, baselineItem)` helper used by both call sites.

---

## 3. YAGNI / Overcomplexity

### 3.1 Dense, hard-to-verify heuristics with no explanation
**Where:** `rankAndSuggest()`, `Nexo.html:2791-2796`

```js
const usernames = cluster.items.map(i => normalizeUsername(i.username));
const baseUsernames = usernames.map(u => u.replace(/\s*\(.*?\)\s*$/, '').trim());
const hasSSOSuffixMatches = new Set(baseUsernames).size < baseUsernames.length && new Set(usernames).size > 1;

const names = cluster.items.map(i => i.name.toLowerCase().trim());
const hasURLNameDivergence = names.some(n => n.includes('.') && names.some(m => !m.includes('.') && m.split(' ')[0] === n.split('.')[0]));
```
Both lines encode a specific real-world heuristic (SSO-suffixed usernames like `"user@corp.com (SSO)"`, and URL-vs-display-name divergence like `"netflix.com"` vs `"Netflix"`) in a single dense expression with no comment showing example inputs/outputs. `hasURLNameDivergence` in particular is fragile: it only compares the *first word* of the non-URL name (`m.split(' ')[0]`) against the text before the *first dot* of the URL-like name (`n.split('.')[0]`), so `"My Netflix Account"` vs `"netflix.com"` would **not** be detected (first word is "my", not "netflix"), silently missing the case the heuristic exists for.

**Consequence:** Nobody reading this code six months from now (including future-you) can quickly verify what inputs trigger these guards, and the guards themselves have real gaps that will silently under- or over-suppress auto-selection.

**Recommendation:** Extract each into a named function with a doc comment showing 2-3 concrete before/after examples, e.g. `function hasSsoSuffixVariant(usernames) { ... }`. Since there's no test framework in this project, a clear comment with worked examples is the main verification tool available — invest in it here specifically because the logic is non-obvious.

### 3.2 Three different, subtly different selection strategies
**Where:** `CLUSTER_PRESETS` (`Nexo.html:2093-2124`), dispatched by `applyPresetSelections()` (`Nexo.html:2254-2283`)

The app has three selection algorithms — `recommended` (→ `rankAndSuggest`, folder-penalty-aware), `keepOne` (→ `getBestKeepCandidate`, not folder-penalty-aware — see §1.2), and `none` — chosen per-preset. This is a reasonable product idea (different confidence tiers deserve different defaults), but the *scoring* itself only needed to vary by the folder-penalty flag, not by calling two independently-maintained ranking functions. Combined with §1.2, this is the root complexity that produced the correctness bug.

**Recommendation:** Once §1.2's shared `getMasteryScore` helper exists, `keepOne` becomes "same ranking as recommended, but delete everyone except rank #1 unconditionally," which is far easier to reason about and audit than "a second, similar-but-different ranking function."

### 3.3 Overlong functions mixing multiple responsibilities
- `showCLIScripts()` (`Nexo.html:3990-4183`, ~193 lines) — data prep + two full script templates + DOM writes, all in one function (see §2.3).
- `buildItemComparisonChips()` (`Nexo.html:3473-3559`, ~86 lines) — one large function with type-specific branches inline (see §2.2).

Neither is incorrect, but both make it hard to change one part (e.g., "add a new card field") without re-reading the entire function to find the right spot and confirm you're following the existing pattern correctly.

### 3.4 Fragile selector-based tab switching
**Where:** `switchScriptTab()` (`Nexo.html:4195-4203`) and `switchExportTab()` (`Nexo.html:4208-4216`)

```js
document.querySelector(`#cliScriptModal .script-tab[onclick*="${tab}"]`).classList.add('active');
```
Finding "the tab that was clicked" by substring-matching against the `onclick` attribute string is a brittle coupling between markup and behavior — it silently breaks if the `onclick` handler text is ever reformatted (e.g., adding a second argument, renaming the function, or switching to `addEventListener`), and `querySelector` here will throw on returning `null` if the match fails (no defensive check).

**Recommendation:** Give each tab button a `data-tab="bash"` / `data-tab="web"` attribute and select on that instead of pattern-matching executable JS text: `[data-tab="${tab}"]`.

---

## 4. Accessibility

### 4.1 Modals have no dialog semantics, focus management, or Escape-to-close
**Where:** `#mergeModal` (`Nexo.html:1975-1994`), `#cliScriptModal` (`Nexo.html:1997-2054`), opened via `previewMerge()`/`showCLIScripts()` and closed via `closeMergeModal()`/`closeCLIModal()`

Neither modal has `role="dialog"`, `aria-modal="true"`, or `aria-labelledby` pointing at its header. Opening a modal doesn't move focus into it (e.g. to the close button or first field), and closing doesn't return focus to whatever triggered it. There's also no `Escape` key handler anywhere in the file (confirmed — no `keydown` listener checks for `Escape`) even though the click-outside-to-close pattern is already implemented (`Nexo.html:2390-2400`).

**Consequence:** Keyboard and screen-reader users get no indication a dialog opened, can tab focus into the (visually hidden) page content behind the overlay, and have no keyboard-only way to dismiss it besides tabbing all the way to the Cancel/close button. This is one of the most common and most impactful accessibility gaps for custom modal implementations.

**Recommendation:**
- Add `role="dialog"` + `aria-modal="true"` + `aria-labelledby="<header-id>"` to both `.modal-content` elements.
- On open, move focus to the modal (e.g. its close button); on close, restore focus to the element that opened it.
- Add a simple focus trap (cycle Tab/Shift+Tab within the modal while open).
- Add a document-level `keydown` handler that closes the topmost open modal on `Escape`.

### 4.2 Upload zone nests a real `<button>` inside a `role="button"` container
**Where:** `Nexo.html:1815-1840`

```html
<div class="upload-zone" id="uploadZone" tabindex="0" role="button" aria-label="Upload a Bitwarden JSON export">
    ...
    <button class="btn btn-primary">Select File</button>
    ...
</div>
```
The outer `<div>` is a keyboard-and-click-activatable `role="button"` (handles `Enter`/`Space` at `Nexo.html:2357-2362` and `click` at `Nexo.html:2356`), and it wraps a genuine native `<button>` that does the same thing via event bubbling. This produces two independently-focusable controls (Tab stops at the div, then again at the inner button) that both trigger the identical action, and can cause assistive tech to announce "button" nested inside "button," which is confusing.

**Recommendation:** Since the zone now contains a real interactive `<button>`, drop `role="button"`/`tabindex="0"`/the `keydown` handler from the wrapping `<div>` and let the native button be the single keyboard/AT-focusable trigger; keep the `dragover`/`drop` handlers on the div (they don't require it to be focusable) and keep a click handler on the div only for the non-button "click-to-browse" area if that's still desired, e.g. by checking `e.target === uploadZone`.

### 4.3 Per-item delete checkboxes have a generic, non-distinguishing label
**Where:** `renderItemCard()`, `Nexo.html:3711-3718`

```html
<input type="checkbox" class="item-delete-checkbox-inline" ... aria-label="Mark item for deletion">
```
Every checkbox in every cluster shares the exact same `aria-label`. A screen-reader user navigating the page's form controls list (a common navigation pattern, e.g. NVDA/JAWS "list all form fields") hears "Mark for deletion, checkbox" repeated once per item with no way to tell which record each one belongs to.

**Recommendation:** Include the item name: `aria-label="Mark ${escapeAttribute(item.name)} for deletion"`.

### 4.4 All feedback is a blocking `alert()`/`confirm()`
**Where:** throughout — e.g. `Nexo.html:2453`, `2528-2532`, `2539-2540`, `3346`, `3913-3919`, `3954-3965`, `3991-3993`, `4227`, `4247`, `4269`

Every success/error/confirmation message in the app — file-type errors, invalid-JSON errors, merge confirmations, export confirmations, "clear all data" confirmation, CLI-script availability warnings — goes through native `alert()`/`confirm()`. These are technically screen-reader-accessible (native OS dialogs), but they're synchronous/blocking, impossible to theme (they ignore the light/dark palette this app otherwise takes care to support), and can't be automated/tested via the browser DOM the way an in-page element can.

**Recommendation:** Not urgent, but worth planning: replace with an in-page `aria-live="assertive"` toast/banner component for notices, and a lightweight custom confirm dialog (reusing the modal accessibility fixes from §4.1) for the two destructive confirmations (`clearAllData`, `exportCleanedData`). This also unblocks writing any future automated UI tests, since `window.confirm` currently has to be stubbed/mocked to test any of these flows.

### 4.5 No live-region announcement for updated counts
**Where:** `updateStats()`, `Nexo.html:3850-3890`, and the `.status-metrics` markup at `Nexo.html:1879-1897`

The "Vault Items / Clusters / To Delete / To Merge" counters update via `textContent` whenever a checkbox is toggled, but the container has no `aria-live` region, so screen-reader users aren't told the numbers changed after an action.

**Recommendation:** Add `aria-live="polite"` (and `aria-atomic="true"`) to `.status-metrics`, or to a dedicated visually-hidden summary element updated alongside it, so the count change is announced without being disruptive.

---

## 5. JavaScript Best Practices / Architecture

These are lower-urgency than the sections above — they mostly reflect the "not yet built" modularization direction already called out in `AUTOMATION_NOTES.md` — but are worth tracking as the codebase grows.

### 5.1 Everything lives in one global scope with implicit global functions
**Where:** the entire `<script>` block, `Nexo.html:2077-4342`

There's no IIFE, module, or namespace object — every `function`/`let`/`const` at the top level of the script is a global. This is necessary today because markup is generated via `innerHTML` strings with inline `onclick="functionName(...)"` handlers (e.g. `Nexo.html:3420`, `3424`, `3587`, `3715`), which requires the referenced function to be reachable from the global scope (non-module `<script>` top-level function declarations become properties of `window`, which is what makes inline handlers work at all).

**Consequence:** No accidental-collision protection (any new top-level `const items = ...` anywhere would silently shadow/clash with app state), and the coupling between "generated markup" and "must stay a global function with this exact name" makes safe renames harder than they should be (`switchScriptTab`/`switchExportTab`'s brittle selector matching in §3.4 is a direct symptom of this).

**Recommendation:** Not a rewrite — but when `AUTOMATION_NOTES.md`'s planned extraction of clustering/scoring/merge logic into a shared module happens, prefer `data-action="previewMerge" data-cluster-index="${clusterIndex}"` attributes plus one delegated `click` listener (the file already does exactly this pattern for the "click-to-copy" `<code>` elements at `Nexo.html:2383-2388` — extend it) over more inline `onclick` strings. This also removes the need for functions like `previewMerge`/`selectAllInCluster`/`toggleItemDeletion` to be global at all.

### 5.2 Scoring weights are magic numbers repeated across the file
**Where:** e.g. `+10` (favorite), `+5` (password history), `-20` (import folder) at `Nexo.html:2243-2244`, `2800-2801`, `2806-2807`; field weights of `25` each at `Nexo.html:2951-2956`

These numbers encode the actual product rules from PRD.md §4 but appear as unlabeled literals at each call site. Combined with §1.2/§2.1, consolidating the scoring logic into one function is also the natural place to name these as constants (`FAVORITE_BONUS = 10`, `PASSWORD_HISTORY_BONUS = 5`, `IMPORT_FOLDER_PENALTY = 20`), which makes the PRD-to-code mapping traceable and any future rebalancing a one-line change instead of a multi-file search.

### 5.3 Repeated `document.getElementById` lookups for the same elements
**Where:** e.g. `document.getElementById('resultsSection')` appears in both `scrollToResults()` (`Nexo.html:3897`) and `updateStats()`/`clearAllData()`; several other IDs (`exportGuide`, `gettingStarted`, `clusterPresetToolbar`, etc.) are looked up repeatedly across `updateStats()` and `clearAllData()`.

Low severity (the DOM lookups are cheap and the app is not performance-constrained), but `updateStats()` and `clearAllData()` in particular each re-toggle the same five section-visibility classes independently (`Nexo.html:3858-3862` vs. `4257-4267`) — a shared `setResultsViewVisible(hasResults)` helper would remove the duplication and guarantee the two code paths can't drift on which sections should show/hide together.

---

## Summary / Suggested Priority Order

| # | Finding | Category | Effort |
|---|---|---|---|
| 1.1 | Substring match on composite key silently mis-groups duplicates (`casino-uri.com` case) | Correctness | Small |
| 1.2 | `getBestKeepCandidate` vs `rankAndSuggest` scoring divergence (Baseline label can contradict actual selection) | Correctness | Small–Medium |
| 1.4 | PowerShell script missing the `bw`-installed check Bash has | Correctness | Trivial |
| 1.3 | `formatDate` catch block is unreachable | Correctness | Trivial |
| 4.1 | Modals lack dialog semantics / focus trap / Escape-to-close | Accessibility | Medium |
| 4.3 | Per-item checkbox `aria-label` doesn't name the item | Accessibility | Trivial |
| 4.2 | Upload zone nests two redundant interactive controls | Accessibility | Small |
| 2.1/3.2 | Unify cluster scoring into one shared function (fixes 1.2 as a side effect) | DRY/Complexity | Small–Medium |
| 2.3/1.4 | Split/unify `showCLIScripts` bash+PowerShell generation | DRY/Complexity | Medium |
| 2.2 | Table-drive `buildItemComparisonChips` | DRY/Complexity | Medium |
| 3.1 | Document/extract the SSO-suffix and URL-name-divergence heuristics | Complexity | Small |
| 2.4 | Delete dead code (`escapeDoubleQuoted`, `.item-delete-checkbox`) | DRY | Trivial |
| 3.4 | Replace `onclick*=` substring tab selection with `data-tab` | Complexity | Trivial |
| 4.4/4.5 | Replace `alert`/`confirm` with in-page accessible components | Accessibility | Larger (plan ahead) |
| 5.1/5.2/5.3 | Architecture cleanups (delegation, named constants, shared visibility helper) | Best practice | Ongoing |

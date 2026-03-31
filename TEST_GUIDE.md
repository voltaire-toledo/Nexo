# Quick Test Guide

## Files Created

✅ **Nexo.html** (57KB) - Main application  
✅ **README.md** (9.2KB) - User documentation  
✅ **PRD.md** (11KB) - Product requirements  
✅ **TODO.md** (12KB) - Project tracker  

## Quick Start Testing

### 1. Open the Tool
```bash
# On macOS, open with default browser:
open Nexo.html

# Or simply double-click the file in Finder
```

### 2. Security Verification (Before Loading Data)

**Check #1: Offline Mode**
- Open browser DevTools (F12 or Cmd+Option+I)
- Go to Network tab
- The page should show ZERO network requests ✅

**Check #2: Extensions Warning**
- If you have browser extensions, you should see a yellow warning banner
- Suggests opening in Incognito mode

**Check #3: Content Security Policy**
- Open DevTools → Console
- No CSP violations should appear

### 3. Test with Your Bitwarden Export

**Upload the file:**
- Drag and drop `bitwarden_export_20260326081541.json` onto the upload zone
- OR click "Select File" button

**Expected Behavior:**
- Loading spinner appears briefly
- Results section shows:
  - Total items count
  - Number of duplicate clusters found
  - Items to delete (starts at 0)

### 4. Review Duplicate Detection

**What to check:**
- [ ] Clusters are grouped logically
- [ ] Match criteria tags are shown (e.g., "Exact Name Match")
- [ ] Each item shows:
  - Name
  - Username (if present)
  - URIs
  - Folder name
  - Creation/revision dates
  - Password status (✓ Present or ✗ None - NOT the actual password)
  - Completeness score percentage

**What NOT to see:**
- ❌ Actual password values
- ❌ TOTP secrets
- ❌ FIDO2 credentials
- ❌ Full notes content (only first 50 chars)

### 5. Test Selection Features

**Try these actions:**
- [ ] Check/uncheck individual items
- [ ] Click "Keep Newest in Cluster" - should mark older items for deletion
- [ ] Click "Select All in Cluster" - should mark all items in that cluster
- [ ] Verify the "Items to Delete" counter updates

### 6. Test Export Functionality

**Export test:**
1. Select at least one item for deletion
2. Click "Download Cleaned Export" button
3. Confirm the dialog
4. Check download folder for file: `bitwarden_cleaned_YYYYMMDDTHHMMSS.json`

**Verify exported JSON:**
```bash
# Check the structure (should be valid JSON)
cat bitwarden_cleaned_*.json | jq '.items | length'

# Or open in text editor and verify:
# - Has "folders" array
# - Has "items" array
# - Items marked for deletion are NOT present
# - All other items are unchanged
```

### 7. Test Clear Data

**Clear data test:**
1. Click "Clear Data" button
2. Confirm the dialog
3. Page should reset to initial upload state
4. File input should be cleared

### 8. Keyboard Shortcuts

**Test shortcuts:**
- [ ] Press `Cmd+O` (Mac) or `Ctrl+O` (Win/Linux) → Should open file picker
- [ ] Press `Cmd+S` (Mac) or `Ctrl+S` (Win/Linux) → Should export (if items selected)

### 9. Dark Mode Test

**Dark mode verification:**
1. Change system theme to dark mode
2. Refresh the page
3. Colors should adjust automatically

### 10. Cross-Browser Testing (Optional)

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (macOS only)

## Security Audit Checklist

Run these checks in browser DevTools:

### Network Tab
```
✅ Expected: 0 requests
❌ Red flag: Any HTTP/HTTPS requests
```

### Console Tab
```
✅ Expected: No errors, no CSP violations
❌ Red flag: CSP errors, failed resource loads
```

### Sources/Debugger Tab
```
Search for: "password"
✅ Expected: Only comments and "hasPassword" checks
❌ Red flag: item.login.password value access

Search for: "totp"
✅ Expected: Only comments
❌ Red flag: Any totp value access

Search for: "fido2"
✅ Expected: Only comments
❌ Red flag: Any fido2Credentials access
```

## Common Issues & Solutions

### Issue: "Encrypted exports are not supported"
**Solution:** Re-export from Bitwarden as unencrypted JSON:
- Tools → Export Vault
- Format: `.json` (not `.json (Encrypted)`)

### Issue: No duplicates found (but you know there are some)
**Reason:** Detection strategies might not catch all edge cases
**Solution:** This is expected - the tool uses specific patterns:
- Exact name matches
- Name + username matches
- URI + username matches
- Fuzzy username matches

### Issue: Extension warning shows up
**Solution:** This is intentional!
- Open in Incognito/Private mode, OR
- Temporarily disable extensions

### Issue: Files won't upload in some browsers
**Solution:** 
- Try a different browser
- Check if file is truly .json format
- Verify file isn't corrupted (open in text editor)

## Re-import to Bitwarden

**After cleaning duplicates:**

1. **Backup first!** Keep your original export file
2. In Bitwarden: Tools → Import Data
3. Format: "Bitwarden (json)"
4. Select your cleaned JSON file
5. Click "Import Data"

⚠️ **Important:** Bitwarden ADDS items on import, it doesn't replace them!

**Recommended workflow:**
- Test in a fresh Bitwarden account first, OR
- Manually delete the duplicate items from Bitwarden BEFORE re-importing

## Performance Benchmarks

Expected performance on modern hardware:

| Items | Analysis Time | UI Render Time |
|-------|--------------|----------------|
| 100   | < 0.5s       | < 0.5s         |
| 1000  | < 2s         | < 1s           |
| 5000  | < 5s         | < 3s           |

## Next Steps

After testing:
- [ ] Update TODO.md with test results
- [ ] Document any bugs or issues found
- [ ] Consider edge cases for v2 improvements
- [ ] Share feedback on detection accuracy

## Support

For issues or questions:
1. Check README.md troubleshooting section
2. Review PRD.md for technical details
3. Inspect browser console for errors
4. Verify using unencrypted JSON export

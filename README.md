# Nexo

> Find duplicates. Merge what matters. Bring order to your Bitwarden Vault.

A secure, offline-first utility for analyzing duplicate entries in Bitwarden vault exports.

![Version](https://img.shields.io/badge/version-0.1-teal)
![License](https://img.shields.io/badge/license-MIT-green)
![Security](https://img.shields.io/badge/security-offline--only-brightgreen)


## 🔒 Security & Privacy

- **100% Offline**: Works completely offline in airgapped environments.
- **Zero External Dependencies**: Single HTML file with zero remote calls (no CDNs, no fonts).
- **Weighted Duplicate Intelligence**: Matching logic that distinguishes stubs from complete records.

## Features

### 🧬 Review & Merge
Identify items with identical credentials but unique data (TOTP, FIDO2 Passkeys, Notes, Custom Fields). Merge them into a **union record** and automatically move originals to the Trash.

### ≠ Differential Highlighting
Instantly see exactly where records differ. Divergent fields are highlighted with **wavy underlines** and bolding, accompanied by the divergence (≠) icon.

### ⚠️ Conflict & SSO Protection
Prevents accidental data loss by flagging password mismatches as "Conflicts" and preventing auto-selection on SSO-tagged accounts.

## Use Cases & Workflows

### 1. Selective Cleaning (Safe & Recoverable)
The most robust way to clean your vault:
1. **Analyze**: Upload your exported Bitwarden Vault (JSON) to identify duplicates.
2. **Review & Merge**: The utility will use its built-in weight system to auto-recommend duplicate records marked for deletion or synthesize complementary records into a `MERGED` folder for your Vault.
3. **CLI Delete**: Use **"Get CLI Deletion Script"** and Nexo will generate a script for you to edit/download. The script will come in two flavors: PowerShell (Windows) and Bash (macOS, Linux).
4. **Safety**: Run the script and only the ones you selected to be deleted or merged will be processed. Deleted items will be stored in your Vault's Trash (up to 30 days)for easy retrieval.

### 2. Seamless Migration (Cross-Manager)
Use the **"Download JSON"** export if migrating to a **new/empty vault** or a different password manager that can import your passwords from Bitwarden, like 1Password or Proton Pass

### 3. Expert Mode: Import the Cleaned JSON back into your Vault
This will get your Vault back into a much cleaner state sooner, and it was always part of the original design. 

> [!CAUTION]
> When importing a new JSON, with all your unique and merged records, into your Bitwarden vault, it is highly recommended to: 
> - Delete all the records currently in your Vault so they end up in the Trash directory, or…
> - Import them into a new and empty directory.
>
> Not doing so will only guarantee duplicate records to be introduced back into your Vault. Bitwarden will not replace the records.

## ⚠️ Disclaimer & Liability Warning

This utility is provided "as is" without warranty of any kind. The creators cannot be held liable for inadvertent deletion of your records. **Always maintain a secure, original backup of your Bitwarden vault before using this tool.** You use this utility at your own risk.

## Legal Notice

Bitwarden® is a registered trademark of Bitwarden Inc. Nexo is an independent project and is not affiliated with, endorsed by, or sponsored by Bitwarden Inc.

---


Made for Bitwarden power users who want local-first cleanup.

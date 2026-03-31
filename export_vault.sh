#!/bin/bash

# Simple script to export Bitwarden vault to JSON

# Helper function to exit or return safely
safe_exit() {
    if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
        exit "$1"
    else
        return "$1"
    fi
}

# Check if logged in
if ! bw status | grep -q '"status":"authenticated"'; then
    echo "Error: Not logged in to Bitwarden. Please run 'bw login' first."
    safe_exit 1
fi

# Unlock vault if not already unlocked
if [ -z "$BW_SESSION" ]; then
    echo "Vault is locked. Please enter your master password to unlock:"
    export BW_SESSION=$(bw unlock --raw)
fi

# Export vault
OUTPUT_FILE="bitwarden_export_$(date +%Y%m%d%H%M%S).json"
echo "Exporting vault to $OUTPUT_FILE..."
bw export --format json --output "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    echo "Export successful: $OUTPUT_FILE"
else
    echo "Export failed."
fi

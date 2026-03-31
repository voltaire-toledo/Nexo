const fs = require('fs');
const path = require('path');

/**
 * This script allows you to test Bitwarden JSON exports from the CLI.
 * Usage: node test-vault.js <path-to-your-export.json>
 */

// 1. Get the filename from the command line arguments
const filePath = process.argv[2];

if (!filePath) {
    console.error('❌ Error: Please provide a file path.');
    console.log('Usage: node test-vault.js your-file.json');
    process.exit(1);
}

// 2. Load the file
console.log(`Reading: ${filePath}...`);
let data;
try {
    const raw = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(raw);
} catch (e) {
    console.error(`❌ Failed to read or parse JSON: ${e.message}`);
    process.exit(1);
}

// 3. Mock the functions from your HTML file
const folders = data.folders || [];

function getFolderName(folderId) {
    if (!folderId) return '';
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.name : '';
}

function calculateCompleteness(item) {
    let score = 0;
    if (item.name && item.name !== 'Unnamed Item') score++;
    if (item.login && item.login.username) score++;
    if (item.login && item.login.password) score++;
    if (item.login && item.login.uris && item.login.uris.length > 0) score++;
    if (item.notes) score++;
    return Math.round((score / 5) * 100);
}

// 4. Run Analysis
console.log('--- Vault Analysis ---');
console.log(`Total Items: ${data.items.length}`);
console.log(`Folders:     ${folders.length}`);

const itemsWithNoFolder = data.items.filter(i => !i.folderId).length;
console.log(`Unfiled Items: ${itemsWithNoFolder}`);

// Example: List the first 5 items and their folders
console.log('\n--- Sample Items ---');
data.items.slice(0, 5).forEach((item, idx) => {
    const folderName = getFolderName(item.folderId) || '(None)';
    const health = calculateCompleteness(item);
    console.log(`${idx + 1}. [${folderName}] ${item.name} (${health}% complete)`);
});

console.log('\n✅ Script executed successfully.');

/**
 * vault-logic.js - The Single Source of Truth
 * This contains only pure logic that can run in any environment.
 */

export function parseItemsSafely(rawItems) {
    return rawItems.map((item, index) => {
        const safeItem = {
            id: item.id || `item-${index}`,
            folderId: item.folderId || null,
            type: item.type || 1,
            name: item.name || 'Unnamed Item',
            notes: item.notes || null,
            favorite: item.favorite || false,
            creationDate: item.creationDate || null,
            revisionDate: item.revisionDate || null,
            hasPasswordHistory: item.passwordHistory && item.passwordHistory.length > 0,
            hasCustomFields: item.fields && item.fields.length > 0,
            username: null,
            uris: [],
            hasPassword: false,
            hasTOTP: false,
            hasFido2: false,
            password: null,
            originalIndex: index
        };

        if (item.type === 1 && item.login) {
            safeItem.username = item.login.username || null;
            safeItem.hasTOTP = !!item.login.totp;
            safeItem.hasFido2 = !!(item.login.fido2Credentials && item.login.fido2Credentials.length > 0);
            safeItem.uris = (item.login.uris || []).map(u => u.uri).filter(u => u);
            safeItem.password = item.login.password;
            safeItem.hasPassword = !!item.login.password;
        }
        return safeItem;
    });
}

export function findDuplicates(items, getFolderName) {
    const clusters = [];
    const groups = { login: {}, card: {}, identity: {}, nameOnly: {} };

    items.forEach(item => {
        // ... (Same grouping logic we used before)
        const key = item.name.toLowerCase().trim(); // Simplification for example
        if (!groups.nameOnly[key]) groups.nameOnly[key] = [];
        groups.nameOnly[key].push(item);
    });

    Object.values(groups.nameOnly).forEach(group => {
        if (group.length >= 2) {
            clusters.push({ items: group, matchCriteria: ['Name Match'] });
        }
    });

    return clusters;
}

const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, 'test.json');
const TEST_FOLDER_ID = '00000000-0000-4000-8000-000000000001';
const TEST_IMPORT_FOLDER_ID = '00000000-0000-4000-8000-000000000002';
const BASE_TIMESTAMP = Date.parse('2024-01-01T12:00:00.000Z');
const SEED = 424242;

const rng = createRng(SEED);
let itemCounter = 100;

const exportData = {
    encrypted: false,
    folders: [
        { name: 'test', id: TEST_FOLDER_ID },
        { name: 'test import', id: TEST_IMPORT_FOLDER_ID }
    ],
    items: []
};

const summary = {
    exactDuplicateClusters: 0,
    exactReasonClusters: 0,
    nearDuplicateClusters: 0,
    conflictClusters: 0,
    mergeCandidateClusters: 0,
    ssoSuffixClusters: 0,
    urlNameDivergenceClusters: 0,
    cardClusters: 0,
    identityClusters: 0,
    secureNoteClusters: 0,
    uniqueNoiseRecords: 0
};

function createRng(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 0x100000000;
    };
}

function nextInt(max) {
    return Math.floor(rng() * max);
}

function nextHex(length) {
    let hex = '';
    while (hex.length < length) {
        hex += Math.floor(rng() * 0xffffffff).toString(16).padStart(8, '0');
    }
    return hex.slice(0, length);
}

function makeUuid() {
    const hex = nextHex(32);
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

function isoFor(dayOffset, minuteOffset = 0) {
    return new Date(BASE_TIMESTAMP + (dayOffset * 86400000) + (minuteOffset * 60000)).toISOString();
}

function uriObjects(uris) {
    return uris.map(uri => ({ uri }));
}

function makePasswordHistory(label, count) {
    return Array.from({ length: count }, (_, index) => ({
        lastUsedDate: isoFor(30 + index, index * 7),
        password: `${label}-history-${index + 1}`
    }));
}

function makeCustomFields(label, count) {
    return Array.from({ length: count }, (_, index) => ({
        type: 0,
        name: `${label}-field-${index + 1}`,
        value: `${label}-value-${index + 1}`
    }));
}

function makeFido2Credential(label) {
    return [{
        credentialId: makeUuid(),
        keyType: 'public-key',
        keyAlgorithm: 'ECDSA',
        keyCurve: 'P-256',
        keyValue: `${label}-key-${nextHex(24)}`,
        rpId: `${label}.example.test`,
        userHandle: nextHex(32),
        userName: `${label}@example.test`,
        counter: '0',
        rpName: `${label} RP`,
        userDisplayName: `${label} Display`,
        discoverable: 'true',
        creationDate: isoFor(90, 10)
    }];
}

function baseItem({
    type,
    name,
    folderId = TEST_FOLDER_ID,
    notes = null,
    favorite = false,
    fields = [],
    passwordHistory = [],
    creationDate,
    revisionDate
}) {
    return {
        passwordHistory,
        revisionDate,
        creationDate,
        id: makeUuid(),
        folderId,
        type,
        reprompt: 0,
        name,
        notes,
        favorite,
        fields,
        collectionIds: null
    };
}

function makeLoginItem({
    name,
    username,
    password,
    uris,
    folderId,
    notes,
    favorite,
    fields,
    passwordHistory,
    totp = null,
    fido2Credentials = [],
    creationDate,
    revisionDate
}) {
    const item = baseItem({
        type: 1,
        name,
        folderId,
        notes,
        favorite,
        fields,
        passwordHistory,
        creationDate,
        revisionDate
    });

    item.login = {
        uris: uriObjects(uris),
        fido2Credentials,
        username,
        password,
        totp
    };

    return item;
}

function makeCardItem({
    name,
    number,
    brand,
    expMonth,
    expYear,
    folderId,
    notes,
    favorite,
    creationDate,
    revisionDate
}) {
    const item = baseItem({
        type: 3,
        name,
        folderId,
        notes,
        favorite,
        fields: [],
        passwordHistory: [],
        creationDate,
        revisionDate
    });

    item.card = {
        cardholderName: name,
        brand,
        number,
        expMonth,
        expYear,
        code: null
    };

    return item;
}

function makeIdentityItem({
    name,
    firstName,
    lastName,
    email,
    username,
    folderId,
    notes,
    favorite,
    creationDate,
    revisionDate
}) {
    const item = baseItem({
        type: 4,
        name,
        folderId,
        notes,
        favorite,
        fields: [],
        passwordHistory: [],
        creationDate,
        revisionDate
    });

    item.identity = {
        title: null,
        firstName,
        middleName: null,
        lastName,
        address1: null,
        address2: null,
        address3: null,
        city: null,
        state: null,
        postalCode: null,
        country: null,
        company: null,
        email,
        phone: null,
        ssn: null,
        username,
        passportNumber: null,
        licenseNumber: null
    };

    return item;
}

function makeSecureNoteItem({
    name,
    notes,
    folderId,
    favorite,
    creationDate,
    revisionDate
}) {
    const item = baseItem({
        type: 2,
        name,
        folderId,
        notes,
        favorite,
        fields: [],
        passwordHistory: [],
        creationDate,
        revisionDate
    });

    item.secureNote = { type: 0 };
    return item;
}

function pushItems(items) {
    items.forEach(item => exportData.items.push(item));
}

function exactReasonCluster(reason, index) {
    const baseLabel = `nexo-test-exact-${reason}-${String(index).padStart(4, '0')}`;
    const baseName = `Nexo Test Exact ${reason} ${String(index).padStart(4, '0')}`;
    const username = `${baseLabel}@example.test`;
    const password = `Pwd!${String(index).padStart(4, '0')}`;
    const uri = `https://${baseLabel}.example.test/login`;
    const creationA = isoFor(index, 5);
    const creationB = isoFor(index + 1, 10);
    const revisionA = isoFor(index + 30, 30);
    const revisionB = isoFor(index + 31, 45);

    const primary = {
        name: baseName,
        username,
        password,
        uris: [uri],
        folderId: TEST_FOLDER_ID,
        notes: null,
        favorite: false,
        fields: [],
        passwordHistory: [],
        creationDate: creationA,
        revisionDate: revisionA
    };

    const secondary = {
        ...primary,
        creationDate: creationB,
        revisionDate: revisionB,
        folderId: TEST_FOLDER_ID
    };

    if (reason === 'more-complete') {
        primary.notes = `TEST more complete note ${index}`;
    }

    if (reason === 'user-starred') {
        primary.favorite = true;
    }

    if (reason === 'has-history') {
        primary.passwordHistory = makePasswordHistory(baseLabel, 2);
    }

    if (reason === 'newest-edit') {
        primary.revisionDate = isoFor(index + 40, 120);
        secondary.revisionDate = isoFor(index + 20, 60);
    }

    if (reason === 'not-imported') {
        secondary.folderId = TEST_IMPORT_FOLDER_ID;
    }

    pushItems([makeLoginItem(primary), makeLoginItem(secondary)]);
    summary.exactDuplicateClusters += 1;
    summary.exactReasonClusters += 1;
}

function nearDuplicateCluster(index) {
    const label = `nexo-test-near-${String(index).padStart(4, '0')}`;
    const username = `${label}@example.test`;
    const password = `Near!${String(index).padStart(4, '0')}`;
    const uri = `https://${label}.example.test/login`;

    const first = makeLoginItem({
        name: `Nexo Test Near ${String(index).padStart(4, '0')}`,
        username,
        password,
        uris: [uri],
        folderId: TEST_FOLDER_ID,
        notes: null,
        favorite: false,
        fields: [],
        passwordHistory: [],
        creationDate: isoFor(200 + index, 0),
        revisionDate: isoFor(220 + index, 0),
        totp: `TOTP-${index}`
    });

    const second = makeLoginItem({
        name: `Nexo Test Near ${String(index).padStart(4, '0')}`,
        username,
        password,
        uris: [uri],
        folderId: TEST_FOLDER_ID,
        notes: `Near duplicate notes ${index}`,
        favorite: false,
        fields: makeCustomFields(label, 1),
        passwordHistory: [],
        creationDate: isoFor(201 + index, 0),
        revisionDate: isoFor(223 + index, 30),
        totp: null,
        fido2Credentials: makeFido2Credential(label)
    });

    pushItems([first, second]);
    summary.nearDuplicateClusters += 1;
}

function conflictCluster(index) {
    const label = `nexo-test-conflict-${String(index).padStart(4, '0')}`;
    const username = `${label}@example.test`;
    const uri = `https://${label}.example.test/login`;

    pushItems([
        makeLoginItem({
            name: `Nexo Test Conflict ${String(index).padStart(4, '0')}`,
            username,
            password: `ConflictA!${index}`,
            uris: [uri],
            folderId: TEST_FOLDER_ID,
            notes: null,
            favorite: false,
            fields: [],
            passwordHistory: [],
            creationDate: isoFor(500 + index, 5),
            revisionDate: isoFor(530 + index, 5)
        }),
        makeLoginItem({
            name: `Nexo Test Conflict ${String(index).padStart(4, '0')}`,
            username,
            password: `ConflictB!${index}`,
            uris: [uri],
            folderId: TEST_FOLDER_ID,
            notes: `Conflict note ${index}`,
            favorite: false,
            fields: [],
            passwordHistory: [],
            creationDate: isoFor(500 + index, 15),
            revisionDate: isoFor(532 + index, 35)
        })
    ]);

    summary.conflictClusters += 1;
}

function mergeCandidateCluster(index) {
    const label = `nexo-test-merge-${String(index).padStart(4, '0')}`;
    const username = `${label}@example.test`;
    const password = `Merge!${String(index).padStart(4, '0')}`;
    const baseUri = `https://${label}.example.test/login`;

    pushItems([
        makeLoginItem({
            name: `Nexo Test Merge ${String(index).padStart(4, '0')}`,
            username,
            password,
            uris: [baseUri],
            folderId: TEST_FOLDER_ID,
            notes: null,
            favorite: index % 7 === 0,
            fields: [],
            passwordHistory: [],
            creationDate: isoFor(800 + index, 5),
            revisionDate: isoFor(830 + index, 5)
        }),
        makeLoginItem({
            name: `Nexo Test Merge ${String(index).padStart(4, '0')}`,
            username,
            password,
            uris: [baseUri, `https://${label}.example.test/profile`],
            folderId: TEST_IMPORT_FOLDER_ID,
            notes: `Merge candidate note ${index}`,
            favorite: false,
            fields: makeCustomFields(label, 2),
            passwordHistory: [],
            creationDate: isoFor(801 + index, 15),
            revisionDate: isoFor(831 + index, 20)
        }),
        makeLoginItem({
            name: `Nexo Test Merge ${String(index).padStart(4, '0')}`,
            username,
            password,
            uris: [baseUri],
            folderId: TEST_FOLDER_ID,
            notes: null,
            favorite: false,
            fields: [],
            passwordHistory: makePasswordHistory(label, 1),
            creationDate: isoFor(802 + index, 10),
            revisionDate: isoFor(833 + index, 55),
            totp: `MERGE-TOTP-${index}`
        })
    ]);

    summary.mergeCandidateClusters += 1;
}

function ssoSuffixCluster(index) {
    const label = `nexo-test-sso-${String(index).padStart(4, '0')}`;
    const uri = `https://${label}.example.test/login`;

    pushItems([
        makeLoginItem({
            name: `Nexo Test SSO ${String(index).padStart(4, '0')}`,
            username: `${label}@example.test`,
            password: null,
            uris: [uri],
            folderId: TEST_FOLDER_ID,
            notes: null,
            favorite: false,
            fields: [],
            passwordHistory: [],
            creationDate: isoFor(1100 + index, 5),
            revisionDate: isoFor(1110 + index, 5)
        }),
        makeLoginItem({
            name: `Nexo Test SSO ${String(index).padStart(4, '0')}`,
            username: `${label}@example.test (SSO)`,
            password: null,
            uris: [uri],
            folderId: TEST_FOLDER_ID,
            notes: null,
            favorite: false,
            fields: [],
            passwordHistory: [],
            creationDate: isoFor(1101 + index, 15),
            revisionDate: isoFor(1111 + index, 10)
        })
    ]);

    summary.ssoSuffixClusters += 1;
}

function urlNameDivergenceCluster(index) {
    const label = `brand${String(index).padStart(4, '0')}`;
    const uri = `https://${label}.example.test/login`;
    const username = `${label}@example.test`;
    const password = `UrlName!${index}`;

    pushItems([
        makeLoginItem({
            name: `${label}.com`,
            username,
            password,
            uris: [uri],
            folderId: TEST_FOLDER_ID,
            notes: null,
            favorite: false,
            fields: [],
            passwordHistory: [],
            creationDate: isoFor(1300 + index, 5),
            revisionDate: isoFor(1310 + index, 5)
        }),
        makeLoginItem({
            name: `${label} account`,
            username,
            password,
            uris: [uri],
            folderId: TEST_FOLDER_ID,
            notes: `Display name divergence ${index}`,
            favorite: false,
            fields: [],
            passwordHistory: [],
            creationDate: isoFor(1301 + index, 15),
            revisionDate: isoFor(1311 + index, 15)
        })
    ]);

    summary.urlNameDivergenceClusters += 1;
}

function cardCluster(index) {
    const suffix = String(1000 + index);

    pushItems([
        makeCardItem({
            name: `Nexo Test Card ${String(index).padStart(4, '0')}`,
            number: `411111111111${suffix}`,
            brand: 'visa',
            expMonth: '09',
            expYear: '2030',
            folderId: TEST_FOLDER_ID,
            notes: null,
            favorite: index % 5 === 0,
            creationDate: isoFor(1500 + index, 5),
            revisionDate: isoFor(1510 + index, 5)
        }),
        makeCardItem({
            name: `Nexo Test Card ${String(index).padStart(4, '0')}`,
            number: `411111111111${suffix}`,
            brand: index % 2 === 0 ? 'visa' : 'visa signature',
            expMonth: '09',
            expYear: '2030',
            folderId: TEST_FOLDER_ID,
            notes: `Card note ${index}`,
            favorite: false,
            creationDate: isoFor(1501 + index, 15),
            revisionDate: isoFor(1511 + index, 15)
        })
    ]);

    summary.cardClusters += 1;
}

function identityCluster(index) {
    const label = `identity${String(index).padStart(4, '0')}`;

    pushItems([
        makeIdentityItem({
            name: `Nexo Test Identity ${String(index).padStart(4, '0')}`,
            firstName: 'Nexo',
            lastName: `Identity${index}`,
            email: `${label}@example.test`,
            username: `${label}.user`,
            folderId: TEST_FOLDER_ID,
            notes: null,
            favorite: false,
            creationDate: isoFor(1700 + index, 5),
            revisionDate: isoFor(1710 + index, 5)
        }),
        makeIdentityItem({
            name: `Nexo Test Identity ${String(index).padStart(4, '0')}`,
            firstName: 'Nexo',
            lastName: `Identity${index}`,
            email: `${label}@example.test`,
            username: `${label}.alt`,
            folderId: TEST_FOLDER_ID,
            notes: `Identity note ${index}`,
            favorite: false,
            creationDate: isoFor(1701 + index, 15),
            revisionDate: isoFor(1711 + index, 15)
        })
    ]);

    summary.identityClusters += 1;
}

function secureNoteCluster(index) {
    const name = `Nexo Test Secure Note ${String(index).padStart(4, '0')}`;

    pushItems([
        makeSecureNoteItem({
            name,
            notes: `Secure note baseline ${index}`,
            folderId: TEST_FOLDER_ID,
            favorite: false,
            creationDate: isoFor(1900 + index, 5),
            revisionDate: isoFor(1910 + index, 5)
        }),
        makeSecureNoteItem({
            name,
            notes: `Secure note variant ${index}`,
            folderId: TEST_FOLDER_ID,
            favorite: false,
            creationDate: isoFor(1901 + index, 15),
            revisionDate: isoFor(1911 + index, 15)
        })
    ]);

    summary.secureNoteClusters += 1;
}

function uniqueNoiseRecord(index) {
    const label = `nexo-test-unique-${String(index).padStart(5, '0')}`;

    pushItems([
        makeLoginItem({
            name: `Nexo Test Unique ${String(index).padStart(5, '0')}`,
            username: `${label}@example.test`,
            password: `Unique!${index}`,
            uris: [`https://${label}.example.test/login`],
            folderId: TEST_FOLDER_ID,
            notes: index % 11 === 0 ? `Unique note ${index}` : null,
            favorite: index % 97 === 0,
            fields: index % 41 === 0 ? makeCustomFields(label, 1) : [],
            passwordHistory: index % 59 === 0 ? makePasswordHistory(label, 1) : [],
            creationDate: isoFor(2100 + index, nextInt(59)),
            revisionDate: isoFor(2150 + index, nextInt(59))
        })
    ]);

    summary.uniqueNoiseRecords += 1;
}

for (let index = 1; index <= 120; index += 1) {
    exactReasonCluster('more-complete', index);
    exactReasonCluster('user-starred', index);
    exactReasonCluster('has-history', index);
    exactReasonCluster('newest-edit', index);
    exactReasonCluster('not-imported', index);
}

for (let index = 1; index <= 200; index += 1) {
    nearDuplicateCluster(index);
    conflictCluster(index);
}

for (let index = 1; index <= 250; index += 1) {
    mergeCandidateCluster(index);
}

for (let index = 1; index <= 100; index += 1) {
    ssoSuffixCluster(index);
    urlNameDivergenceCluster(index);
    cardCluster(index);
    identityCluster(index);
    secureNoteCluster(index);
}

for (let index = 1; index <= 1000; index += 1) {
    uniqueNoiseRecord(index);
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(exportData, null, 2));

console.log('Generated deterministic test vault fixture.');
console.log(`Output: ${OUTPUT_PATH}`);
console.log(`Seed: ${SEED}`);
console.log(`Folders: ${exportData.folders.map(folder => folder.name).join(', ')}`);
console.log(`Total items: ${exportData.items.length}`);
console.log('Scenario counts:');
Object.entries(summary).forEach(([key, value]) => {
    console.log(`- ${key}: ${value}`);
});
# Release Guide

This document explains how to manually push changes to the upstream repository and publish a release for Nexo.

## Prerequisites

- You are on the repository root.
- `origin` points to `https://github.com/voltaire-toledo/Nexo.git`.
- Your working tree is clean except for the changes you intend to ship.
- You are authenticated with GitHub and have permission to push tags and releases.

## 1. Review the Working Tree

```bash
git status --short
git remote -v
```

Confirm that only intended files are staged or ready to stage.

## 2. Stage the Release Files

Stage the product, docs, assets, release workflow, and supporting files:

```bash
git add .gitignore .github/workflows/release.yml LICENSE Nexo.html README.md PRD.md TODO.md TEST_GUIDE.md RELEASE.md assets export_vault.sh test-vault.js vault-logic.js
```

If additional project files were intentionally changed, stage them explicitly.

## 3. Commit the Changes

Create a release-oriented commit:

```bash
git commit -m "chore: prepare Nexo 0.1.1 release"
```

Use a more specific message if the release has a narrower scope.

## 4. Push the Main Branch

```bash
git push origin main
```

## 5. Create and Push the Release Tag

Create the tag locally:

```bash
git tag 0.1.1
```

Push the tag:

```bash
git push origin 0.1.1
```

Pushing the tag triggers the GitHub Actions workflow that packages `Nexo.html` plus the main documentation into a release zip and publishes it as a GitHub Release asset.

## 6. Verify the Release

After the workflow finishes:

1. Open the repository's **Actions** tab and confirm the release workflow passed.
2. Open the repository's **Releases** page.
3. Confirm a release named `0.1.1` exists.
4. Confirm the asset `Nexo-0.1.1.zip` is attached.

## 7. If You Need to Rebuild the Release

If the release asset or notes are wrong:

```bash
git tag -d 0.1.1
git push origin :refs/tags/0.1.1
git tag 0.1.1
git push origin 0.1.1
```

Only do this before other people begin depending on that release tag.

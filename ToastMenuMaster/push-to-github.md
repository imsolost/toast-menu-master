# Solution: Push Repository to GitHub

The HTTP 400 error occurs because the total commit size exceeds GitHub's limits. Here's the solution:

## Method 1: Use Minimal Package.json (Recommended)

1. **Replace package.json temporarily**:
```bash
mv package.json package-full.json
mv package-minimal.json package.json
```

2. **Remove package-lock.json from git tracking**:
```bash
git rm --cached package-lock.json
```

3. **Commit and push**:
```bash
git add .
git commit -m "Initial commit: Core restaurant menu app with Toast API"
git push -u origin main
```

4. **Restore full package.json after successful push**:
```bash
mv package-full.json package.json
git add package.json
git commit -m "Update package.json with full dependencies"
git push
```

## Method 2: Split into Multiple Commits

If Method 1 fails, push in smaller chunks:

```bash
# Push documentation first
git add README.md LICENSE CONTRIBUTING.md .env.example .gitignore
git commit -m "docs: Add project documentation"
git push -u origin main

# Push configuration files
git add package.json *.config.* tsconfig.json components.json
git commit -m "config: Add build configuration"
git push

# Push source code
git add client/ server/ shared/
git commit -m "feat: Add core application code"
git push
```

## Method 3: Manual Upload (Last Resort)

If git push continues failing:
1. Go to GitHub.com → your repository
2. Upload files manually via web interface
3. Exclude: node_modules, package-lock.json, .git folder

The minimal package.json I created contains only essential dependencies, reducing the repository size significantly.
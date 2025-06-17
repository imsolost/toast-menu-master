#!/bin/bash

# Script to create a clean repository for GitHub push
echo "Creating clean repository structure..."

# Create temporary directory
mkdir -p toast-menu-clean
cd toast-menu-clean

# Initialize git
git init
git remote add origin https://github.com/imsolost/toast-menu-master.git

# Copy essential files only
echo "Copying essential files..."

# Documentation
cp ../README.md .
cp ../LICENSE .
cp ../CONTRIBUTING.md .
cp ../.env.example .

# Configuration files
cp ../package.json .
cp ../components.json .
cp ../drizzle.config.ts .
cp ../postcss.config.js .
cp ../tailwind.config.ts .
cp ../tsconfig.json .
cp ../vite.config.ts .

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules
dist
.DS_Store
server/public
vite.config.ts.*
*.tar.gz

# Large files
package-lock.json
generated-icon.png
*.png
*.jpg
*.jpeg
*.gif
*.ico

# Cache and temporary files
.cache
.local
.upm
.replit

# Environment files
.env
EOF

# Copy source directories
cp -r ../client .
cp -r ../server .
cp -r ../shared .

# Remove any large files that might have been copied
find . -name "*.png" -delete
find . -name "*.jpg" -delete
find . -name "*.jpeg" -delete
find . -name "*.gif" -delete
find . -name "package-lock.json" -delete

echo "Clean repository created in toast-menu-clean/"
echo "Next steps:"
echo "1. cd toast-menu-clean"
echo "2. git add ."
echo "3. git commit -m 'Initial commit: Restaurant menu management app'"
echo "4. git push -u origin main"
EOF
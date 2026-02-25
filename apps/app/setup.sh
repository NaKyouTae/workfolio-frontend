#!/bin/bash
# Setup script for apps/app portal application
# Run from anywhere - the script resolves paths automatically
#   bash /Users/nakyutae/personal/git/workfolio-frontend/apps/app/setup.sh

set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEST="$ROOT/apps/app"

echo "ROOT: $ROOT"
echo "DEST: $DEST"
echo ""

# 1. Copy src/app/ excluding admin (overwrite existing)
echo "[1/6] Copying src/app/ (excluding admin)..."
mkdir -p "$DEST/src/app"
cd "$ROOT/src/app"
for item in *; do
    if [ "$item" != "admin" ]; then
        cp -Rf "$item" "$DEST/src/app/"
    fi
done
echo "  Done."

# 2. Copy portal/layouts -> components/layouts
echo "[2/6] Copying portal/layouts -> components/layouts..."
mkdir -p "$DEST/src/components/layouts"
cp -Rf "$ROOT/src/components/portal/layouts/"* "$DEST/src/components/layouts/"
echo "  Done."

# 3. Copy portal/features -> components/features
echo "[3/6] Copying portal/features -> components/features..."
mkdir -p "$DEST/src/components/features"
cp -Rf "$ROOT/src/components/portal/features/"* "$DEST/src/components/features/"
echo "  Done."

# 4. Copy hooks excluding shared ones
echo "[4/6] Copying hooks (excluding shared)..."
mkdir -p "$DEST/src/hooks"
EXCLUDE="useConfirm.tsx useNotification.tsx useModal.tsx useGuide.tsx"
cd "$ROOT/src/hooks"
for file in *; do
    skip=false
    for ex in $EXCLUDE; do
        if [ "$file" = "$ex" ]; then
            skip=true
            break
        fi
    done
    if [ "$skip" = "false" ]; then
        cp -f "$file" "$DEST/src/hooks/"
    fi
done
echo "  Done."

# 5. Copy sample data files
echo "[5/6] Copying sample data files..."
mkdir -p "$DEST/src/utils"
cp -f "$ROOT/src/utils/sampleCareerData.ts" "$DEST/src/utils/"
cp -f "$ROOT/src/utils/sampleRecordData.ts" "$DEST/src/utils/"
cp -f "$ROOT/src/utils/sampleTurnOverData.ts" "$DEST/src/utils/"
echo "  Done."

# 6. Copy public/ directory
echo "[6/6] Copying public/..."
if [ -d "$DEST/public" ]; then
    rm -rf "$DEST/public"
fi
cp -R "$ROOT/public" "$DEST/public"
echo "  Done."

# Cleanup: remove setup scripts
rm -f "$DEST/setup.sh"
rm -f "$DEST/copy-files.js"

echo ""
echo "All files copied successfully!"
echo "The portal app is ready at: $DEST"

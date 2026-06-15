#!/bin/bash
# Sync guidebook-template changes to downstream repos
# Usage: ./sync-to-repos.sh [cottage|barn|all]

set -e

TEMPLATE_DIR="$(cd "$(dirname "$0")" && pwd)"
PARENT_DIR="$(dirname "$TEMPLATE_DIR")"

sync_cottage() {
  echo "=== Syncing to cottage-guidebook-v2 ==="
  cp "$TEMPLATE_DIR/src/data/cottage.json" "$PARENT_DIR/cottage-guidebook-v2/src/data/"
  cd "$PARENT_DIR/cottage-guidebook-v2"
  git add src/data/cottage.json
  if git diff --cached --quiet; then
    echo "No changes to commit"
  else
    git commit -m "sync: template@$(cd "$TEMPLATE_DIR" && git rev-parse --short HEAD)"
    git push
    echo "Cottage guidebook synced and pushed"
  fi
}

sync_barn() {
  echo "=== Syncing to barn-guidebook-v2 ==="
  cp "$TEMPLATE_DIR/src/data/barn.json" "$PARENT_DIR/barn-guidebook-v2/src/data/"
  cd "$PARENT_DIR/barn-guidebook-v2"
  git add src/data/barn.json
  if git diff --cached --quiet; then
    echo "No changes to commit"
  else
    git commit -m "sync: template@$(cd "$TEMPLATE_DIR" && git rev-parse --short HEAD)"
    git push
    echo "Barn guidebook synced and pushed"
  fi
}

case "${1:-all}" in
  cottage)
    sync_cottage
    ;;
  barn)
    sync_barn
    ;;
  all)
    sync_cottage
    sync_barn
    ;;
  *)
    echo "Usage: $0 [cottage|barn|all]"
    exit 1
    ;;
esac

echo "Done!"

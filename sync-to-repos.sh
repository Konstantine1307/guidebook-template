#!/bin/bash
# Sync guidebook-template changes to downstream repos
# Copies: styles, components, scripts, public files, and config
# Usage: ./sync-to-repos.sh [cottage|barn|all]

set -e

TEMPLATE_DIR="$(cd "$(dirname "$0")" && pwd)"
PARENT_DIR="$(dirname "$TEMPLATE_DIR")"
TEMPLATE_COMMIT="$(cd "$TEMPLATE_DIR" && git rev-parse --short HEAD)"

# Files/directories to sync from template (relative to template root)
SYNC_ITEMS=(
  "src/styles/global.css"
  "src/components/*.ts"
  "src/scripts/*.ts"
  "src/index.html"
  "public/_redirects"
  "vite.config.ts"
)

sync_files() {
  local target_dir="$1"
  local repo_name="$2"

  echo "=== Syncing template files to $repo_name ==="

  # Copy each sync item
  for item in "${SYNC_ITEMS[@]}"; do
    local src="$TEMPLATE_DIR/$item"
    local dest="$target_dir/$item"

    # Handle glob patterns
    if [[ "$item" == *"*"* ]]; then
      # It's a glob pattern, copy matching files
      local dest_dir="$(dirname "$dest")"
      mkdir -p "$dest_dir"
      cp $src "$dest_dir/" 2>/dev/null || true
    else
      # Regular file
      mkdir -p "$(dirname "$dest")"
      if [ -f "$src" ]; then
        cp "$src" "$dest"
      fi
    fi
  done

  # Also sync data JSON (property-specific)
  local data_file="$(basename "$target_dir").json"
  if [ -f "$TEMPLATE_DIR/src/data/$data_file" ]; then
    cp "$TEMPLATE_DIR/src/data/$data_file" "$target_dir/src/data/"
  fi

  echo "Files copied to $repo_name"
}

commit_and_push() {
  local target_dir="$1"
  local repo_name="$2"

  cd "$target_dir"

  # Stage all changed files
  git add -A src/ public/ vite.config.ts 2>/dev/null || true

  # Check if there are changes to commit
  if git diff --cached --quiet; then
    echo "No changes to commit for $repo_name"
  else
    git commit -m "sync: template@$TEMPLATE_COMMIT - SPA updates"
    git push
    echo "$repo_name synced and pushed"
  fi
}

sync_cottage() {
  sync_files "$PARENT_DIR/cottage-guidebook-v2" "cottage-guidebook-v2"
  commit_and_push "$PARENT_DIR/cottage-guidebook-v2" "cottage-guidebook-v2"
}

sync_barn() {
  sync_files "$PARENT_DIR/barn-guidebook-v2" "barn-guidebook-v2"
  commit_and_push "$PARENT_DIR/barn-guidebook-v2" "barn-guidebook-v2"
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

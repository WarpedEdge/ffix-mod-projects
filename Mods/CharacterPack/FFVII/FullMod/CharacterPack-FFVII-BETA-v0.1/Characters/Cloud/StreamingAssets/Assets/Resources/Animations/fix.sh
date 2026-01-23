#!/usr/bin/env bash
# rename_geo_cloud.sh
# Renames files like ANH_MAIN_CLOUD_0_*.anim -> ANH_MAIN_CLOUD_<N>_*.anim
# based on the parent folder: GEO_MAIN_CLOUD_<N>

set -Eeuo pipefail
shopt -s nullglob

APPLY=0
ROOT="."

# args: [root] [--apply]  (order doesn't matter)
for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    *) ROOT="$arg" ;;
  esac
done

for dir in "$ROOT"/GEO_MAIN_CLOUD_*; do
  [[ -d "$dir" ]] || continue
  folder="$(basename "$dir")"
  N="${folder##*_}"
  [[ "$N" =~ ^[0-9]+$ ]] || { echo "Skip $folder (no numeric suffix)"; continue; }

  # handle .anim or .ANIM
  for f in "$dir"/*.[aA][nN][iI][mM]; do
    base="$(basename "$f")"

    # Only touch names that contain _CLOUD_<digits>_
    if [[ "$base" =~ ^(.*_CLOUD_)[0-9]+(_.*)$ ]]; then
      newbase="${BASH_REMATCH[1]}${N}${BASH_REMATCH[2]}"
      if [[ "$base" == "$newbase" ]]; then
        echo "[$folder] OK: $base"
        continue
      fi

      if [[ -e "$dir/$newbase" ]]; then
        echo "[$folder] SKIP: target exists -> $newbase"
        continue
      fi

      if (( APPLY )); then
        mv -v -- "$f" "$dir/$newbase"
      else
        echo "[$folder] DRY-RUN: $base -> $newbase"
      fi
    else
      echo "[$folder] skip (no _CLOUD_<n>_ pattern): $base"
    fi
  done
done

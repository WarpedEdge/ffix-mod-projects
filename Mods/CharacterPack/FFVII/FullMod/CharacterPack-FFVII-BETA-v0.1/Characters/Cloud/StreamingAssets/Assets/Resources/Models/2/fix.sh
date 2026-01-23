#!/usr/bin/env bash
# Rename the only .fbx in each immediate subfolder to <folder>.fbx

set -euo pipefail
shopt -s nullglob

DRYRUN=1
if [[ "${1:-}" == "--apply" ]]; then DRYRUN=0; shift; fi
ROOT="${1:-.}"

while IFS= read -r -d '' dir; do
  folder="$(basename "$dir")"
  # find .fbx (case-insensitive) directly inside the folder
  mapfile -d '' -t fbx_files < <(find "$dir" -maxdepth 1 -type f \
    \( -iname '*.fbx' \) -print0)

  case "${#fbx_files[@]}" in
    0)  echo "[$folder] no FBX found; skip"; continue ;;
    1)  src="${fbx_files[0]}"
        dst="$dir/$folder.fbx"
        if [[ "$src" == "$dst" ]]; then
          echo "[$folder] already correct"
          continue
        fi
        if [[ -e "$dst" ]]; then
          echo "[$folder] target $folder.fbx already exists; skip"
          continue
        fi
        if (( DRYRUN )); then
          echo "[$folder] would rename: $(basename "$src") -> $(basename "$dst")"
        else
          mv -v -- "$src" "$dst"
        fi
        ;;
    *)  echo "[$folder] multiple FBX files; skip"; continue ;;
  esac
done < <(find "$ROOT" -mindepth 1 -maxdepth 1 -type d -print0)

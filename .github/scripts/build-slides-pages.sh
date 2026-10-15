#!/usr/bin/env bash
set -euo pipefail

root="$(pwd)"
output="$root/pages-dist"
base="${PAGES_BASE_PATH%/}"
temporary="$(mktemp -d)"
trap 'rm -rf "$temporary"' EXIT

if [[ -e "$output" ]]; then
  echo "::error::Output directory already exists: $output"
  exit 1
fi

(
  cd slides
  npm ci
  npm run build -- --base "$base/" --out "$output"
)

while IFS= read -r tag; do
  version="${tag#published/}"
  if [[ ! "$version" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]*$ ]]; then
    echo "::error::Invalid version path for tag: $tag (use letters, digits, dots, hyphens or underscores)"
    exit 1
  fi
  if [[ -e "$output/$version" ]]; then
    echo "::error::Version path conflicts with an existing build entry: $version"
    exit 1
  fi

  echo "::group::Building $tag"
  source="$temporary/$version"
  mkdir -p "$source"
  git archive "$tag" slides | tar -x -C "$source"
  (
    cd "$source/slides"
    npm ci
    npm run build -- --base "$base/$version/" --out "$output/$version"
  )
  echo "::endgroup::"
done < <(git tag --list 'published/*' --sort=refname)

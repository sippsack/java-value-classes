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

mkdir -p "$temporary/main"
git archive origin/main slides | tar -x -C "$temporary/main"
(
  cd "$temporary/main/slides"
  npm ci
  npm run build -- --base "$base/" --out "$output"
)

while IFS= read -r tag; do
  version="${tag#published/}"
  if [[ ! "$version" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]*$ ]]; then
    echo "::error::Invalid version path for tag: $tag (use letters, digits, dots, hyphens or underscores)"
    exit 1
  fi
  if [[ "$version" == experimental ]]; then
    echo "::error::The experimental path is reserved for experimental branches"
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

while IFS= read -r ref; do
  version="${ref#refs/remotes/origin/experimental/}"
  if [[ ! "$version" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]*(/[a-zA-Z0-9][a-zA-Z0-9._-]*)*$ ]]; then
    echo "::error::Invalid experimental branch path: $version"
    exit 1
  fi
  target="$output/experimental/$version"
  if [[ -e "$target" ]]; then
    echo "::error::Experimental branch path conflicts with an existing build entry: $version"
    exit 1
  fi
  echo "::group::Building experimental/$version"
  source="$temporary/branches/$version"
  mkdir -p "$source"
  git archive "$ref" slides | tar -x -C "$source"
  (
    cd "$source/slides"
    npm ci
    npm run build -- --base "$base/experimental/$version/" --out "$target"
    if [[ -f sandbox.md ]]; then
      if [[ -e "$target/sandbox" ]]; then
        echo "::error::Sandbox path conflicts with an existing build entry: experimental/$version/sandbox"
        exit 1
      fi
      npx --no-install slidev build sandbox.md \
        --base "$base/experimental/$version/sandbox/" --out "$target/sandbox"
    fi
  )
  echo "::endgroup::"
done < <(git for-each-ref --format='%(refname)' --sort=refname refs/remotes/origin/experimental/)

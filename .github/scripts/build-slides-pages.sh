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

experimental_ref="${EXPERIMENTAL_REF:-}"
if [[ -z "$experimental_ref" ]]; then
  for candidate in experimental sippsack-experimental; do
    if git show-ref --verify --quiet "refs/remotes/origin/$candidate"; then
      experimental_ref="$candidate"
      break
    fi
  done
fi

if [[ -n "$experimental_ref" ]]; then
  if [[ "$experimental_ref" != experimental && "$experimental_ref" != sippsack-experimental ]]; then
    echo "::error::Experimental deployment requires experimental or sippsack-experimental"
    exit 1
  fi
  if [[ -e "$output/experimental" ]]; then
    echo "::error::The experimental path is reserved; rename the conflicting published tag"
    exit 1
  fi
  echo "::group::Building $experimental_ref"
  source="$temporary/experimental"
  mkdir -p "$source"
  git archive "refs/remotes/origin/$experimental_ref" slides | tar -x -C "$source"
  (
    cd "$source/slides"
    npm ci
    npm run build -- --base "$base/experimental/" --out "$output/experimental"
    npx --no-install slidev build sandbox.md \
      --base "$base/experimental/sandbox/" --out "$output/experimental/sandbox"
  )
  echo "::endgroup::"
fi

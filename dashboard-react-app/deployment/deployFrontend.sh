#!/usr/bin/env zsh

SCRIPT_DIR="${0:a:h}"
REACT_PROJECT_PATH="${SCRIPT_DIR}/.."
REACT_PORT=5173

if [ ! -d "$REACT_PROJECT_PATH" ]; then
  echo "React project path not found: $REACT_PROJECT_PATH" >&2
  exit 1
fi

echo "React path: $REACT_PROJECT_PATH"

cd "$REACT_PROJECT_PATH" || exit 1
HOST=0.0.0.0 PORT="$REACT_PORT" npm run dev
#!/usr/bin/env zsh

# Resolve script directory (deployment/)
SCRIPT_DIR="$(cd "$(dirname "${(%):-%N}")" && pwd)"

# React project: parent of deployment/
REACT_PROJECT_PATH="${SCRIPT_DIR}/.."

# API project: sibling folder testAPI under dashboard-react-app
API_PROJECT_PATH="${REACT_PROJECT_PATH}/testAPI"

REACT_PORT=5173
API_PORT=8000

# Basic path checks
if [ ! -d "$REACT_PROJECT_PATH" ]; then
  echo "React project path not found: $REACT_PROJECT_PATH" >&2
  exit 1
fi

if [ ! -d "$API_PROJECT_PATH" ]; then
  echo "API project path not found: $API_PROJECT_PATH" >&2
  exit 1
fi

echo "React path: $REACT_PROJECT_PATH"
echo "API path:   $API_PROJECT_PATH"

# Start React dev server
(
  cd "$REACT_PROJECT_PATH" || exit 1
  HOST=0.0.0.0 PORT="$REACT_PORT" npm run dev
) &

REACT_PID=$!

# Start FastAPI/uvicorn
(
  cd "$API_PROJECT_PATH" || exit 1
  uvicorn test_api:app --reload --host 0.0.0.0 --port "$API_PORT"
) &

API_PID=$!

# Cleanup on Ctrl+C
cleanup() {
  echo "Stopping servers..."
  kill "$REACT_PID" "$API_PID" 2>/dev/null
  wait
  exit 0
}

trap cleanup INT TERM

# Wait for both background processes
wait
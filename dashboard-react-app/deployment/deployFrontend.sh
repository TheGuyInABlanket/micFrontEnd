#!/usr/bin/env zsh

set -e

SCRIPT_DIR="${0:a:h}"
PROJECT_ROOT="${SCRIPT_DIR}/.."

FLASK_PROJECT_PATH="../../../../api/mymicmon/"
#FLASK_PROJECT_PATH="/Users/ronneyland/Documents/Prod/api/mymicmon"
REACT_PROJECT_PATH="$PROJECT_ROOT"

FLASK_PORT=8000
REACT_PORT=5173

if [ ! -d "$FLASK_PROJECT_PATH" ]; then
  echo "Flask project path not found: $FLASK_PROJECT_PATH" >&2
  exit 1
fi

if [ ! -d "$REACT_PROJECT_PATH" ]; then
  echo "React project path not found: $REACT_PROJECT_PATH" >&2
  exit 1
fi

get_host_ip() {
  if [[ "$OSTYPE" == darwin* ]]; then
    local iface
    iface="$(route -n get 1.1.1.1 | awk '/interface:/{print $2}')"
    ipconfig getifaddr "$iface"
  else
    ip route get 1.1.1.1 | awk '/src/ {print $7; exit}'
  fi
}

HOST_IP="$(get_host_ip)"

if [ -z "$HOST_IP" ]; then
  echo "Could not determine host IP address" >&2
  exit 1
fi

echo "Project root: $PROJECT_ROOT"
echo "Host IP: $HOST_IP"

cd "$FLASK_PROJECT_PATH" || exit 1

flask --app micmon run --host 0.0.0.0 --port "$FLASK_PORT" &
FLASK_PID=$!

cleanup() {
  if kill -0 "$FLASK_PID" 2>/dev/null; then
    kill "$FLASK_PID"
  fi
}
trap cleanup EXIT INT TERM

echo "Waiting for Flask to start..."

for i in {1..30}; do
  if curl -s -o /dev/null "http://127.0.0.1:${FLASK_PORT}/"; then
    break
  fi
  sleep 1
done

if ! curl -s -o /dev/null "http://127.0.0.1:${FLASK_PORT}/"; then
  echo "Flask did not start in time" >&2
  exit 1
fi

echo "Calling start endpoint..."
curl --fail "http://${HOST_IP}:${FLASK_PORT}/start"

echo
echo "Starting React UI..."

cd "$REACT_PROJECT_PATH" || exit 1
HOST=0.0.0.0 PORT="$REACT_PORT" npm run dev

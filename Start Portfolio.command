#!/bin/zsh

cd "$(dirname "$0")"

PORT=3000
URL="http://localhost:$PORT/"

# If the server is already running, simply open the website.
if lsof -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  open "$URL"
  exit 0
fi

# Start the portfolio server from the project root.
python3 -m http.server "$PORT" --bind 127.0.0.1 \
  > /tmp/niv-portfolio-server.log 2>&1 &

SERVER_PID=$!

sleep 1

open "$URL"

# Keep the terminal session alive while the server is running.
wait "$SERVER_PID"

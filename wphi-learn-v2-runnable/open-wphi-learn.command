#!/bin/sh
cd "$(dirname "$0")"
if command -v open >/dev/null 2>&1; then
  open index.html
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open index.html
else
  echo "Open index.html in your web browser."
fi

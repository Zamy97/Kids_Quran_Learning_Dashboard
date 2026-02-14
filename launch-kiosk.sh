#!/bin/bash

# Wait for X server
sleep 5

# Disable screen blanking
xset s off
xset -dpms
xset s noblank

# Hide mouse cursor after 3 seconds of inactivity (requires unclutter)
# unclutter -idle 3 &

# Launch Chromium in kiosk mode
chromium-browser \
  --kiosk \
  --incognito \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-suggestions-service \
  --disable-translate \
  --disable-save-password-bubble \
  --disable-component-update \
  --start-fullscreen \
  --no-first-run \
  --fast \
  --fast-start \
  --disable-features=TranslateUI \
  --disk-cache-dir=/dev/null \
  file:///home/pi/quran-app/dist/kids_quran_dashboard/browser/index.html

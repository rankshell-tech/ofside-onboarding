# Mobile deep links (Ofside player app)

## Share URL format

**Canonical (new shares):** `https://ofside.in/score/{matchId}`

**Legacy (still supported):** `https://api.ofside.in/scoring/scoringScreen?matchId=…&sport=…&format=…&viewScore=1`

## Domains

| Domain | Purpose |
|--------|---------|
| **ofside.in** | Marketing site + canonical score landing + Universal/App Link verification |
| **api.ofside.in** | REST API + legacy deep links + open-in-app fallbacks |

Both domains must serve valid verification files when env vars are set.

## Required environment variables

Set on **ofside.in** (Next.js) **and** **api.ofside.in** (Express backend):

| Variable | Purpose |
|----------|---------|
| `APPLE_TEAM_ID` | iOS Universal Links — produces `{TEAM_ID}.com.ofside.ofside` in AASA |
| `ANDROID_SHA256_CERT_FINGERPRINT` | Android App Links — Play App Signing SHA-256 (colon-separated) |
| `IOS_APP_STORE_URL` / `NEXT_PUBLIC_IOS_APP_STORE_URL` | App Store button on fallback pages |
| `ANDROID_PLAY_STORE_URL` / `NEXT_PUBLIC_ANDROID_PLAY_STORE_URL` | Play Store button on fallback pages |
| `DEEP_LINK_WEB_ORIGIN` | Canonical web origin (`https://ofside.in`) |

When misconfigured, verification endpoints return **503** with `{ error, missing }` instead of silently returning `[]` or empty `details`.

## Verify verification files

```bash
curl -sS https://ofside.in/.well-known/assetlinks.json | jq .
curl -sS https://ofside.in/.well-known/apple-app-site-association | jq .
curl -sS https://api.ofside.in/.well-known/assetlinks.json | jq .
curl -sS https://api.ofside.in/.well-known/apple-app-site-association | jq .
```

Expected assetlinks (when configured):

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.ofside.ofside",
      "sha256_cert_fingerprints": ["AA:BB:…"]
    }
  }
]
```

Expected AASA `details` (when configured):

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAMID.com.ofside.ofside",
        "appIDs": ["TEAMID.com.ofside.ofside"],
        "paths": ["/score/*", "/scoring/*", "…"]
      }
    ]
  }
}
```

## Android App Links validation

```bash
adb shell pm get-app-links com.ofside.ofside
adb shell pm verify-app-links --re-verify com.ofside.in
```

Expected: `ofside.in` (and `api.ofside.in`) show **verified**.

Force a test link:

```bash
adb shell am start -a android.intent.action.VIEW \
  -d "https://ofside.in/score/MATCH_ID" com.ofside.ofside
```

## iOS Universal Links validation

```bash
# On device: Settings → Developer → Universal Links → Diagnostics
# Or paste link in Notes app and long-press
xcrun simctl openurl booted "https://ofside.in/score/MATCH_ID"
```

## Testing checklist

### Android — app installed

- [ ] Tap `https://ofside.in/score/{id}` from Chrome → opens app on score screen
- [ ] Tap same link from WhatsApp → Open in app button or direct open
- [ ] App in background → link brings app to foreground on score screen
- [ ] App killed → cold start opens score screen (via `/score/[scoreId]` resolver)
- [ ] Legacy `api.ofside.in/scoring/scoringScreen?…` still works

### Android — app not installed

- [ ] Link opens score landing page with teams + score
- [ ] Shows **Get it on Google Play**
- [ ] Shows **Open in Ofside app**
- [ ] Never blank page

### iOS — app installed

- [ ] Tap link in Safari → opens app (not browser)
- [ ] Tap in iMessage → opens app
- [ ] Background / killed states same as Android

### iOS — app not installed

- [ ] Landing page with score + **Download on the App Store**
- [ ] Smart App Banner meta present

## Mobile app rebuild

After changing `app.config.js` or `AndroidManifest.xml`:

```bash
cd ofside-app-frontend
eas build --platform android --profile production
eas build --platform ios --profile production
```

Or regenerate native project locally:

```bash
npx expo prebuild --platform android --clean
```

## Resolve API (public)

`GET https://api.ofside.in/api/matches/resolve/{matchId}`

Returns sport/format/teams/score for landing pages and the app's `/score/[scoreId]` route.

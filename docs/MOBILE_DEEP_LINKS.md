# Mobile deep links (`api.ofside.in`)

Shared links from the player app use **`https://api.ofside.in`** (same backend as the REST API). The marketing site stays on **`ofside.in`**.

| Domain | Purpose |
|--------|---------|
| **ofside.in** | Marketing (terms, privacy, contact) |
| **api.ofside.in** | REST API + app deep links + open-in-app fallbacks |

## Flow

1. User taps `https://api.ofside.in/scoring/scoringScreen?matchId=…&sport=…&viewScore=1`
2. **If Universal / App Links are configured** → iOS/Android opens `com.ofside.ofside` directly.
3. **If the app is not installed** → backend serves “Open in Ofside” HTML, then store redirect.

No separate subdomain is required — deep link routes live on the existing API service.

## Backend environment variables

| Variable | Purpose |
|----------|---------|
| `APPLE_TEAM_ID` | iOS Universal Links verification |
| `ANDROID_SHA256_CERT_FINGERPRINT` | Android App Links verification |
| `IOS_APP_STORE_URL` | App Store link on fallback page |
| `ANDROID_PLAY_STORE_URL` | Optional Play Store override |
| `APP_SCHEME` | Default `ofside` |

## Mobile app

Rebuild after updating `app.config.js` (`host: api.ofside.in`, `associatedDomains: applinks:api.ofside.in`).

## Verify

- `https://api.ofside.in/scoring/scoringScreen?matchId=test&sport=football&format=Team&viewScore=1` — HTML open-in-app page
- `https://api.ofside.in/.well-known/apple-app-site-association` — JSON with your `appID`
- `https://api.ofside.in/.well-known/assetlinks.json` — non-empty when fingerprint is set

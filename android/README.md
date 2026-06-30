# PixHunt Android Wrapper

Native Android WebView wrapper for pixhunt.lovable.app with Google Mobile Ads.

## Architecture
- **SplashActivity** — branded splash (2.5s) + preloads & shows App Open Ad.
- **MainActivity** — loads `https://pixhunt.lovable.app` in WebView, appends
  `MyAndroidApp/1.0` to the User-Agent (the web app detects this token and
  hides Adsterra + enables the AdMob bridge), and hosts the anchored banner.
- **AdMobConfig** — fetches `/admob-config.json` from the website at startup
  and caches it in SharedPreferences. Fallback = Google test IDs.
- **AdsBridge** — `window.AndroidAds` exposed to JS: `showInterstitial`,
  `showRewarded(key)`, `showRewardedInterstitial(key)`, `showBanner`,
  `hideBanner`, `loadNative(slotId)`, `triggerDownload(url, filename)`.
- Reward callbacks dispatch `window.dispatchEvent(new CustomEvent('admob:reward',{detail:{key}}))`.

## Updating AdMob IDs
1. Open the website admin panel → **Manage AdMob IDs**, edit, **Save**.
2. Click **Export admob-config.json** and replace `public/admob-config.json`.
3. Redeploy the website. The Android app picks up new IDs on next launch.

## Building locally
```
cd android
gradle wrapper --gradle-version 8.9
./gradlew :app:assembleRelease
./gradlew :app:bundleRelease
```

## Signing (GitHub Actions)
Add these secrets to the repo:
- `KEYSTORE_BASE64` — `base64 -w0 release.keystore`
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`

Workflow `.github/workflows/android.yml` produces signed APK + AAB artifacts.

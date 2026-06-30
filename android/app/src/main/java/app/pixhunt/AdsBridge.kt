package app.pixhunt

import android.app.Activity
import android.webkit.JavascriptInterface

/** JS ↔ Android bridge exposed as `window.AndroidAds`. */
class AdsBridge(
    private val activity: Activity,
    private val onInterstitial: () -> Unit,
    private val onRewarded: (String) -> Unit,
    private val onRewardedInterstitial: (String) -> Unit,
    private val onShowBanner: () -> Unit,
    private val onHideBanner: () -> Unit,
    private val onDownload: (String, String) -> Unit,
) {
    @JavascriptInterface fun showInterstitial() = onInterstitial()
    @JavascriptInterface fun showRewarded(rewardKey: String) = onRewarded(rewardKey ?: "")
    @JavascriptInterface fun showRewardedInterstitial(rewardKey: String) =
        onRewardedInterstitial(rewardKey ?: "")
    @JavascriptInterface fun showBanner() = onShowBanner()
    @JavascriptInterface fun hideBanner() = onHideBanner()
    @JavascriptInterface fun loadNative(slotId: String) {
        // Native ad placement is out of scope of this minimal bridge; the
        // slot will simply render the "Sponsored" placeholder. Wire a custom
        // NativeAd renderer here when needed.
    }
    @JavascriptInterface fun triggerDownload(url: String, filename: String) =
        onDownload(url, filename)
}

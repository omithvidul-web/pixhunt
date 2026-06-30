package app.pixhunt

import android.content.Context
import android.util.Log
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.appopen.AppOpenAd

/** Single-shot App Open ad shown right after the splash screen. */
class AppOpenAdManager(private val context: Context) {
    private var ad: AppOpenAd? = null
    private var loading = false

    fun load(onDone: () -> Unit) {
        if (loading || ad != null) { onDone(); return }
        loading = true
        val unit = AdMobConfig.current(context).appOpen
        AppOpenAd.load(
            context, unit, AdRequest.Builder().build(),
            object : AppOpenAd.AppOpenAdLoadCallback() {
                override fun onAdLoaded(loaded: AppOpenAd) {
                    ad = loaded; loading = false; onDone()
                }
                override fun onAdFailedToLoad(error: LoadAdError) {
                    Log.w("AppOpenAd", "Failed: ${error.message}")
                    loading = false; onDone()
                }
            }
        )
    }

    fun show(activity: android.app.Activity, onDismiss: () -> Unit) {
        val current = ad ?: run { onDismiss(); return }
        current.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() { ad = null; onDismiss() }
            override fun onAdFailedToShowFullScreenContent(e: AdError) { ad = null; onDismiss() }
        }
        current.show(activity)
    }
}

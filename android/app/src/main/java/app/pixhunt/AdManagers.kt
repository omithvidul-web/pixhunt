package app.pixhunt

import android.app.Activity
import android.content.Context
import android.util.Log
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import com.google.android.gms.ads.rewardedinterstitial.RewardedInterstitialAd
import com.google.android.gms.ads.rewardedinterstitial.RewardedInterstitialAdLoadCallback

class InterstitialAdManager(private val context: Context) {
    private var ad: InterstitialAd? = null
    fun preload() {
        val unit = AdMobConfig.current(context).interstitial
        InterstitialAd.load(context, unit, AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(loaded: InterstitialAd) { ad = loaded }
                override fun onAdFailedToLoad(e: LoadAdError) {
                    Log.w("Interstitial", "load failed: ${e.message}"); ad = null
                }
            })
    }
    fun show() {
        val a = ad ?: return preload()
        a.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() { ad = null; preload() }
            override fun onAdFailedToShowFullScreenContent(e: AdError) { ad = null; preload() }
        }
        (context as? Activity)?.let { a.show(it) }
    }
}

class RewardedAdManager(private val context: Context) {
    private var ad: RewardedAd? = null
    fun preload() {
        val unit = AdMobConfig.current(context).rewarded
        RewardedAd.load(context, unit, AdRequest.Builder().build(),
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(loaded: RewardedAd) { ad = loaded }
                override fun onAdFailedToLoad(e: LoadAdError) {
                    Log.w("Rewarded", "load failed: ${e.message}"); ad = null
                }
            })
    }
    fun show(@Suppress("UNUSED_PARAMETER") key: String, onReward: () -> Unit) {
        val a = ad ?: run { preload(); return }
        a.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() { ad = null; preload() }
            override fun onAdFailedToShowFullScreenContent(e: AdError) { ad = null; preload() }
        }
        (context as? Activity)?.let { a.show(it) { onReward() } }
    }
}

class RewardedInterstitialAdManager(private val context: Context) {
    private var ad: RewardedInterstitialAd? = null
    fun preload() {
        val unit = AdMobConfig.current(context).rewardedInterstitial
        RewardedInterstitialAd.load(context, unit, AdRequest.Builder().build(),
            object : RewardedInterstitialAdLoadCallback() {
                override fun onAdLoaded(loaded: RewardedInterstitialAd) { ad = loaded }
                override fun onAdFailedToLoad(e: LoadAdError) {
                    Log.w("RewardedInt", "load failed: ${e.message}"); ad = null
                }
            })
    }
    fun show(@Suppress("UNUSED_PARAMETER") key: String, onReward: () -> Unit) {
        val a = ad ?: run { preload(); return }
        a.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() { ad = null; preload() }
            override fun onAdFailedToShowFullScreenContent(e: AdError) { ad = null; preload() }
        }
        (context as? Activity)?.let { a.show(it) { onReward() } }
    }
}

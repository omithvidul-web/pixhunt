package app.pixhunt

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var bannerContainer: FrameLayout
    private var bannerAd: AdView? = null
    private lateinit var interstitial: InterstitialAdManager
    private lateinit var rewarded: RewardedAdManager
    private lateinit var rewardedInterstitial: RewardedInterstitialAdManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        bannerContainer = findViewById(R.id.banner_container)

        interstitial = InterstitialAdManager(this)
        rewarded = RewardedAdManager(this)
        rewardedInterstitial = RewardedInterstitialAdManager(this)
        interstitial.preload()
        rewarded.preload()
        rewardedInterstitial.preload()

        configureWebView()
        webView.loadUrl(BuildConfig.WEB_URL)
    }

    private fun configureWebView() {
        val s: WebSettings = webView.settings
        s.javaScriptEnabled = true
        s.domStorageEnabled = true
        s.databaseEnabled = true
        s.loadWithOverviewMode = true
        s.useWideViewPort = true
        s.allowFileAccess = false
        s.allowContentAccess = false
        s.mediaPlaybackRequiresUserGesture = false
        s.userAgentString = "${s.userAgentString} MyAndroidApp/1.0"

        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()
        webView.addJavascriptInterface(
            AdsBridge(
                activity = this,
                onInterstitial = { runOnUiThread { interstitial.show() } },
                onRewarded = { key -> runOnUiThread { rewarded.show(key) { dispatchReward(key) } } },
                onRewardedInterstitial = { key ->
                    runOnUiThread { rewardedInterstitial.show(key) { dispatchReward(key) } }
                },
                onShowBanner = { runOnUiThread { showBanner() } },
                onHideBanner = { runOnUiThread { hideBanner() } },
                onDownload = { url, name -> startSystemDownload(url, name) },
            ),
            "AndroidAds"
        )
    }

    private fun showBanner() {
        if (bannerAd != null) return
        val ad = AdView(this).apply {
            setAdSize(AdSize.BANNER)
            adUnitId = AdMobConfig.current(applicationContext).banner
            loadAd(AdRequest.Builder().build())
        }
        bannerContainer.removeAllViews()
        bannerContainer.addView(ad)
        bannerContainer.visibility = View.VISIBLE
        bannerAd = ad
    }

    private fun hideBanner() {
        bannerContainer.visibility = View.GONE
        bannerAd?.destroy()
        bannerAd = null
        bannerContainer.removeAllViews()
    }

    private fun dispatchReward(key: String) {
        val safe = key.replace("'", "\\'")
        webView.post {
            webView.evaluateJavascript(
                "window.dispatchEvent(new CustomEvent('admob:reward',{detail:{key:'$safe'}}))",
                null
            )
        }
    }

    private fun startSystemDownload(url: String, filename: String) {
        try {
            val req = DownloadManager.Request(Uri.parse(url))
                .setTitle(filename)
                .setDescription("Saving from PixHunt")
                .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename)
                .setAllowedOverMetered(true)
                .setAllowedOverRoaming(true)
            (getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager).enqueue(req)
            runOnUiThread { Toast.makeText(this, "Downloading…", Toast.LENGTH_SHORT).show() }
        } catch (t: Throwable) {
            runOnUiThread { Toast.makeText(this, "Download failed: ${t.message}", Toast.LENGTH_LONG).show() }
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    override fun onDestroy() {
        bannerAd?.destroy()
        super.onDestroy()
    }
}

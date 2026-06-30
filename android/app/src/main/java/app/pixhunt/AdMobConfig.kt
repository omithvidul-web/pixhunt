package app.pixhunt

import android.content.Context
import android.util.Log
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.util.concurrent.TimeUnit

/**
 * Remote AdMob configuration. Fetched from the published PixHunt website at
 * startup and cached in SharedPreferences so subsequent launches use the last
 * known IDs even when offline.
 */
data class AdMobIds(
    val publisherId: String,
    val appId: String,
    val appOpen: String,
    val banner: String,
    val interstitial: String,
    val rewarded: String,
    val rewardedInterstitial: String,
    val nativeAdvanced: String,
)

object AdMobConfig {
    private const val TAG = "AdMobConfig"
    private const val PREFS = "admob_prefs"
    private const val KEY_JSON = "admob_json"
    private const val REMOTE_URL = "https://pixhunt.lovable.app/admob-config.json"

    // Google official test IDs — used until the remote config arrives.
    private val FALLBACK = AdMobIds(
        publisherId = "pub-0000000000000000",
        appId = "ca-app-pub-3940256099942544~3347511713",
        appOpen = "ca-app-pub-3940256099942544/9257395921",
        banner = "ca-app-pub-3940256099942544/6300978111",
        interstitial = "ca-app-pub-3940256099942544/1033173712",
        rewarded = "ca-app-pub-3940256099942544/5224354917",
        rewardedInterstitial = "ca-app-pub-3940256099942544/5354046379",
        nativeAdvanced = "ca-app-pub-3940256099942544/2247696110",
    )

    @Volatile
    private var cached: AdMobIds? = null

    private val http: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .connectTimeout(5, TimeUnit.SECONDS)
            .readTimeout(8, TimeUnit.SECONDS)
            .build()
    }

    fun current(context: Context): AdMobIds {
        cached?.let { return it }
        val raw = prefs(context).getString(KEY_JSON, null)
        val parsed = raw?.let { runCatching { parse(JSONObject(it)) }.getOrNull() } ?: FALLBACK
        cached = parsed
        return parsed
    }

    /** Async best-effort refresh; safe to call from app start. */
    fun refresh(context: Context) {
        Thread {
            try {
                val resp = http.newCall(Request.Builder().url(REMOTE_URL).build()).execute()
                resp.use { r ->
                    if (!r.isSuccessful) return@Thread
                    val body = r.body?.string() ?: return@Thread
                    val ids = parse(JSONObject(body))
                    prefs(context).edit().putString(KEY_JSON, body).apply()
                    cached = ids
                    Log.i(TAG, "AdMob config refreshed: appId=${ids.appId}")
                }
            } catch (t: Throwable) {
                Log.w(TAG, "Failed to refresh AdMob config: ${t.message}")
            }
        }.start()
    }

    private fun parse(o: JSONObject): AdMobIds = AdMobIds(
        publisherId = o.optString("publisherId", FALLBACK.publisherId),
        appId = o.optString("appId", FALLBACK.appId),
        appOpen = o.optString("appOpen", FALLBACK.appOpen),
        banner = o.optString("banner", FALLBACK.banner),
        interstitial = o.optString("interstitial", FALLBACK.interstitial),
        rewarded = o.optString("rewarded", FALLBACK.rewarded),
        rewardedInterstitial = o.optString("rewardedInterstitial", FALLBACK.rewardedInterstitial),
        nativeAdvanced = o.optString("nativeAdvanced", FALLBACK.nativeAdvanced),
    )

    private fun prefs(context: Context) =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
}

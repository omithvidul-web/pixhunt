package app.pixhunt

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen

class SplashActivity : AppCompatActivity() {

    private lateinit var appOpen: AppOpenAdManager

    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        appOpen = AppOpenAdManager(applicationContext)

        // Hold the splash screen for ~2.5 s while we preload the App Open ad.
        val splashHoldMs = 2500L
        val start = System.currentTimeMillis()

        appOpen.load {
            val elapsed = System.currentTimeMillis() - start
            val wait = (splashHoldMs - elapsed).coerceAtLeast(0)
            Handler(Looper.getMainLooper()).postDelayed({
                appOpen.show(this) { goToMain() }
            }, wait)
        }

        // Hard fallback in case the ad never resolves.
        Handler(Looper.getMainLooper()).postDelayed({
            if (!isFinishing) goToMain()
        }, splashHoldMs + 6000)
    }

    private fun goToMain() {
        if (isFinishing) return
        startActivity(Intent(this, MainActivity::class.java))
        finish()
        overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
    }
}

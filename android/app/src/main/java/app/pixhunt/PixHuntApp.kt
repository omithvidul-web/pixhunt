package app.pixhunt

import android.app.Application
import com.google.android.gms.ads.MobileAds

class PixHuntApp : Application() {
    override fun onCreate() {
        super.onCreate()
        MobileAds.initialize(this) {}
        // Eagerly fetch the dynamic config so the App Open ad is ready by splash end.
        AdMobConfig.refresh(this)
    }
}

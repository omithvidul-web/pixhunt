# Keep AdMob mediation classes
-keep class com.google.android.gms.ads.** { *; }
-keep public class * extends com.google.android.gms.ads.mediation.MediationAdapter
-keepclassmembers class * { @android.webkit.JavascriptInterface <methods>; }

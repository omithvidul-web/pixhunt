import { useEffect, useRef } from "react";
import { bridge, isAndroidApp } from "@/lib/admob";

// Renders a placeholder slot that the Android side will fill with a
// NativeAd view positioned over it. Web users see nothing.
export function NativeAdSlot({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const slotId = `native-${index}`;

  useEffect(() => {
    if (!isAndroidApp()) return;
    bridge().loadNative(slotId);
  }, [slotId]);

  if (!isAndroidApp()) return null;

  return (
    <div
      ref={ref}
      id={slotId}
      data-admob-native={slotId}
      className="glass mb-3 grid h-48 place-items-center rounded-2xl text-xs uppercase tracking-wider text-muted-foreground"
    >
      Sponsored
    </div>
  );
}

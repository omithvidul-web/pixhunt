import logo from "@/assets/pixhunt-logo.jpg";

export function Logo({ size = 40, glow = false }: { size?: number; glow?: boolean }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-2xl"
      style={{
        width: size,
        height: size,
        boxShadow: glow ? "0 0 60px rgba(139, 92, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.5)" : undefined,
      }}
    >
      <img src={logo} alt="PixHunt" className="h-full w-full object-cover" />
    </div>
  );
}

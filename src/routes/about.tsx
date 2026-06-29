import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About PixHunt — Free HD & 4K Image Search" },
      { name: "description", content: "PixHunt is a free image search and download app powered by Pixabay. Millions of HD, Full HD, 2K and 4K images." },
      { property: "og:title", content: "About PixHunt" },
      { property: "og:description", content: "Free image search and download app powered by Pixabay." },
    ],
  }),
  component: AboutPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-3xl p-6">
      <h2 className="mb-3 font-display text-xl font-bold">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <header className="text-center">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          About <span className="text-gradient-brand">PixHunt</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          PixHunt is a free image search and download app that helps you find millions of high-quality photos for your projects, wallpapers, and inspiration.
        </p>
      </header>

      <Section title="What We Do">
        <p>Search and download HD, Full HD, 2K, and 4K images in seconds. All images are sourced from Pixabay, one of the world's largest free stock photo platforms.</p>
      </Section>

      <Section title="Our Mission">
        <p>To make high-quality images accessible to everyone. Whether you're a designer, student, or just need a new wallpaper, PixHunt gives you fast, watermark-free downloads without signup.</p>
      </Section>

      <Section title="Key Features">
        <ul className="space-y-1.5">
          <li>✓ Millions of free photos powered by Pixabay</li>
          <li>✓ HD to 4K resolution available</li>
          <li>✓ One-tap download to your device</li>
          <li>✓ No account or login required</li>
          <li>✓ 100% free to use</li>
        </ul>
      </Section>

      <Section title="Technology">
        <p>PixHunt uses the official Pixabay API to deliver safe, licensed images. We do not host or claim ownership of any images. All downloads are saved directly to your device.</p>
      </Section>

      <Section title="Credits">
        <p>Images provided by Pixabay under the Pixabay License. Special thanks to all Pixabay contributors.</p>
      </Section>

      <Section title="Contact">
        <p>Questions or feedback? Email us at: <a className="text-primary underline" href="mailto:omithvidul@gmail.com">omithvidul@gmail.com</a></p>
      </Section>

      <p className="text-center text-xs text-muted-foreground">Last updated: June 28, 2026</p>
    </main>
  );
}

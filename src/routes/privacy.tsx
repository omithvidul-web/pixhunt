import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — PixHunt" },
      { name: "description", content: "PixHunt Privacy Policy — how we handle data, third-party services like Pixabay and AdMob, and your rights as a user." },
      { property: "og:title", content: "PixHunt Privacy Policy" },
      { property: "og:description", content: "How PixHunt handles data and third-party services." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://pixhunt.lovable.app/privacy" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/8756f5cc-5b40-487d-b1fa-10e1b6f1fb4c" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PixHunt Privacy Policy" },
      { name: "twitter:description", content: "How PixHunt handles data and third-party services." },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/8756f5cc-5b40-487d-b1fa-10e1b6f1fb4c" },
    ],
    links: [{ rel: "canonical", href: "https://pixhunt.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-6 font-display text-xl font-bold">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-3 text-base font-semibold">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>;
}

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          <span className="text-gradient-brand">Privacy</span> Policy
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: June 28, 2026</p>
      </header>

      <article className="glass mt-6 rounded-3xl p-6">
        <P>PixHunt ("we", "our", or "us") operates the PixHunt - Image Downloader mobile application.</P>

        <H2>1. Information We Collect</H2>
        <P>We do not collect personal information such as your name, address, or phone number.</P>
        <P>To provide our service, the app accesses:</P>
        <ul className="ml-5 mt-2 list-disc space-y-1 text-sm text-muted-foreground">
          <li><strong>Device Storage:</strong> Only to save images that you choose to download. Images are saved locally on your device only.</li>
          <li><strong>Internet Access:</strong> To fetch image results from Pixabay API based on your search queries.</li>
          <li><strong>Advertising ID:</strong> Google AdMob may collect your device's advertising ID to show personalized or non-personalized ads.</li>
        </ul>

        <H2>2. How We Use Data</H2>
        <ul className="ml-5 mt-2 list-disc space-y-1 text-sm text-muted-foreground">
          <li>To search and display images from Pixabay based on your request.</li>
          <li>To save downloaded images directly to your device storage. We do not upload or store your images on our servers.</li>
          <li>To display ads through Google AdMob and support app development.</li>
        </ul>

        <H2>3. Third-Party Services</H2>
        <H3>Google AdMob</H3>
        <P>AdMob is used to serve ads in the app. AdMob may collect and use data as per their privacy policy.</P>
        <P>Google Privacy Policy: <a className="text-primary underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">policies.google.com/privacy</a></P>
        <H3>Pixabay API</H3>
        <P>We use the Pixabay API to provide free images. When you search, your query is sent to Pixabay to fetch results. All images are downloaded directly from Pixabay to your device. We do not host or modify images.</P>
        <P>Pixabay Privacy Policy: <a className="text-primary underline" href="https://pixabay.com/service/privacy/" target="_blank" rel="noreferrer">pixabay.com/service/privacy</a></P>
        <P>Pixabay License: <a className="text-primary underline" href="https://pixabay.com/service/license/" target="_blank" rel="noreferrer">pixabay.com/service/license</a></P>

        <H2>4. Data Sharing</H2>
        <P>We do not sell, trade, or transfer your personal information to outside parties. Images you download are stored only on your local device and are never accessed by us.</P>

        <H2>5. Children's Privacy</H2>
        <P>Our app does not knowingly target or collect information from children under the age of 13.</P>

        <H2>6. Data Security</H2>
        <P><strong>Images saved locally:</strong> All downloaded images remain on your device storage under your control.</P>
        <P><strong>Data transmission:</strong> All connections to Pixabay and AdMob are encrypted via HTTPS.</P>

        <H2>7. Your Rights</H2>
        <P>You can stop all data collection by uninstalling the app. To manage ad personalization, visit Google Ad Settings: <a className="text-primary underline" href="https://adssettings.google.com" target="_blank" rel="noreferrer">adssettings.google.com</a></P>

        <H2>8. Changes to This Policy</H2>
        <P>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date.</P>

        <H2>9. Contact Us</H2>
        <P>If you have any questions about this Privacy Policy, please contact us at: <a className="text-primary underline" href="mailto:omithvidul@gmail.com">omithvidul@gmail.com</a></P>
      </article>
    </main>
  );
}

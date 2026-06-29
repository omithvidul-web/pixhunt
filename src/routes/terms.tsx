import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — PixHunt" },
      { name: "description", content: "PixHunt Terms of Service — usage rules, Pixabay image licensing, acceptable use, and disclaimers." },
      { property: "og:title", content: "PixHunt Terms of Service" },
      { property: "og:description", content: "Usage rules, licensing, and disclaimers for PixHunt." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://pixhunt.lovable.app/terms" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/8756f5cc-5b40-487d-b1fa-10e1b6f1fb4c" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PixHunt Terms of Service" },
      { name: "twitter:description", content: "Usage rules, licensing, and disclaimers for PixHunt." },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/8756f5cc-5b40-487d-b1fa-10e1b6f1fb4c" },
    ],
    links: [{ rel: "canonical", href: "https://pixhunt.lovable.app/terms" }],
  }),
  component: TermsPage,
});

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-6 font-display text-xl font-bold">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>;
}

function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          <span className="text-gradient-brand">Terms</span> of Service
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: June 28, 2026</p>
      </header>

      <article className="glass mt-6 rounded-3xl p-6">
        <P>Welcome to PixHunt. By accessing or using our website and services, you agree to be bound by these Terms of Service.</P>

        <H2>1. Use of Service</H2>
        <P>PixHunt provides a free image search and download experience powered by the Pixabay API. You may use the service for personal and commercial projects in accordance with the Pixabay License.</P>

        <H2>2. Image Licensing</H2>
        <P>All images are provided by Pixabay under the Pixabay License. You are responsible for ensuring your use complies with that license. See <a className="text-primary underline" href="https://pixabay.com/service/license/" target="_blank" rel="noreferrer">pixabay.com/service/license</a>.</P>

        <H2>3. Acceptable Use</H2>
        <P>You agree not to misuse the service, attempt to disrupt it, scrape it at scale, or use it for any unlawful purpose. We may rate-limit or block abusive traffic.</P>

        <H2>4. Intellectual Property</H2>
        <P>PixHunt does not host or claim ownership of any images. The PixHunt name, logo, and website design are property of PixHunt.</P>

        <H2>5. Third-Party Services</H2>
        <P>The service relies on third parties including Pixabay and ad networks. We are not responsible for their content or availability.</P>

        <H2>6. Disclaimer</H2>
        <P>The service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access or that the service will be error-free.</P>

        <H2>7. Limitation of Liability</H2>
        <P>To the maximum extent permitted by law, PixHunt shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</P>

        <H2>8. Changes to Terms</H2>
        <P>We may update these Terms at any time. Continued use after changes constitutes acceptance of the revised Terms.</P>

        <H2>9. Contact</H2>
        <P>Questions about these Terms? Email <a className="text-primary underline" href="mailto:omithvidul@gmail.com">omithvidul@gmail.com</a>.</P>
      </article>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Mail, Bug, Briefcase, Shield } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact PixHunt — Support & Feedback" },
      { name: "description", content: "Get in touch with the PixHunt team. Support, business inquiries, bug reports and DMCA." },
      { property: "og:title", content: "Contact PixHunt" },
      { property: "og:description", content: "Support, business inquiries, bug reports and DMCA." },
    ],
  }),
  component: ContactPage,
});

function Card({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-3xl p-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-background/60">
          <Icon className="h-5 w-5 text-primary" />
        </span>
        <h2 className="font-display text-lg font-bold">{title}</h2>
      </div>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <header className="text-center">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          <span className="text-gradient-brand">Contact</span> Us
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          We'd love to hear from you! Whether you have questions, feedback, or need support, reach out anytime.
        </p>
      </header>

      <Card icon={Mail} title="Email">
        <p>For all inquiries: <a className="text-primary underline" href="mailto:omithvidul@gmail.com">omithvidul@gmail.com</a></p>
        <p>We typically respond within 24-48 hours.</p>
      </Card>

      <Card icon={Briefcase} title="Business Inquiries">
        <p>For partnerships or API questions, use the same email with subject line "Business".</p>
      </Card>

      <Card icon={Bug} title="Bug Reports">
        <p>Found an issue? Email us with:</p>
        <ol className="list-inside list-decimal space-y-1">
          <li>Your device model</li>
          <li>Android version</li>
          <li>Steps to reproduce the bug</li>
          <li>Screenshot if possible</li>
        </ol>
      </Card>

      <Card icon={Shield} title="DMCA / Copyright">
        <p>PixHunt does not host images. All content is provided by Pixabay.</p>
        <p>
          If you believe your copyrighted work is on Pixabay, please contact Pixabay directly:{" "}
          <a className="text-primary underline" href="https://pixabay.com/service/contact/" target="_blank" rel="noreferrer">
            pixabay.com/service/contact
          </a>
        </p>
        <p>For PixHunt app issues only, email us.</p>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Website: <a className="text-primary underline" href="https://pixhunt.app">https://pixhunt.app</a>
      </p>
    </main>
  );
}

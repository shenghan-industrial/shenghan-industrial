import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Shenghan Industrial",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-white dark:bg-brand-900">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <span className="text-xs tracking-[0.2em] uppercase font-semibold text-accent-dark">
          Legal
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-800 dark:text-white mt-3 mb-8 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-text-muted dark:text-white/40 text-sm mb-12">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-text-secondary dark:text-white/50 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using this website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              2. Website Use
            </h2>
            <p>
              You may use this website for lawful purposes only. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
              <li>Use the website in any way that violates applicable laws or regulations</li>
              <li>Attempt to interfere with the proper functioning of the website</li>
              <li>Submit false or misleading information through our contact forms</li>
              <li>Reproduce, distribute, or modify website content without prior written permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              3. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, graphics, logos, images, product descriptions, and technical specifications, is the intellectual property of Shenghan Industrial or its licensors and is protected by applicable copyright and trademark laws. The Shenghan Industrial name and logo are trademarks of our company.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              4. Product Information
            </h2>
            <p>
              Product descriptions, technical specifications, and performance data provided on this website are for informational purposes only. Actual product performance may vary depending on application conditions, substrate compatibility, and installation quality. We recommend consulting our technical team for project-specific recommendations. We reserve the right to modify product specifications without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              5. Limitation of Liability
            </h2>
            <p>
              Shenghan Industrial shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of, or inability to use, this website or its content. We make no warranties or representations about the accuracy or completeness of the website content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              6. Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party websites or services (e.g., social media platforms). We are not responsible for the content, privacy practices, or terms of any third-party sites. Accessing such links is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              7. Governing Law
            </h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of the People&apos;s Republic of China. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Guangzhou, Guangdong Province.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              8. Changes to Terms
            </h2>
            <p>
              We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Continued use of the website after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              9. Contact Us
            </h2>
            <p>
              For questions regarding these Terms of Service, please contact us at:
            </p>
            <p className="mt-2">
              Email: info@shenghanindustrial.com<br />
              Phone: 15163916007<br />
              Address: 山东省临沂市河东区, Shandong, China
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

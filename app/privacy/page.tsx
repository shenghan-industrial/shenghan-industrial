import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Shenghan Industrial",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-white dark:bg-brand-900">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <span className="text-xs tracking-[0.2em] uppercase font-semibold text-accent-dark">
          Legal
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-800 dark:text-white mt-3 mb-8 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-text-muted dark:text-white/40 text-sm mb-12">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-text-secondary dark:text-white/50 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you contact us through our website, we may collect the following personal information:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Company name (if provided)</li>
              <li>Any other information you choose to include in your inquiry</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              2. How We Use Your Information
            </h2>
            <p>We use the information we collect solely for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
              <li>To respond to your inquiries and provide customer support</li>
              <li>To send you product information and quotes as requested</li>
              <li>To improve our products and services based on your feedback</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> sell, rent, or share your personal information with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              3. Cookies
            </h2>
            <p>
              Our website uses essential cookies to ensure proper functionality, including a theme preference cookie to remember your dark/light mode selection. We do not use tracking cookies or third-party analytics cookies without your consent. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              4. Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Contact form submissions are transmitted over encrypted connections (HTTPS).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              5. Data Retention
            </h2>
            <p>
              We retain your contact information only for as long as necessary to fulfill the purposes outlined in this policy, or as required by applicable law. You may request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              6. Your Rights
            </h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability (where applicable)</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us using the information below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-3">
              7. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              Email: info@shenghan-trading.com<br />
              Phone: +1 (800) 888-9999<br />
              Address: 88 Huaxia Road, Zhujiang New Town, Guangzhou, Guangdong, China
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

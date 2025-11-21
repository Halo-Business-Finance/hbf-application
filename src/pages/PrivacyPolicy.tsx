import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us when using our Service:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, business name</li>
                <li><strong>Financial Information:</strong> Bank account details, credit scores, loan application data</li>
                <li><strong>Business Information:</strong> Business address, years in business, revenue information</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, usage data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and evaluate loan applications</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send important notices about your account and applications</li>
                <li>Improve our services and develop new features</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Information Sharing and Disclosure</h2>
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Lending Partners:</strong> To process your loan applications</li>
                <li><strong>Service Providers:</strong> Third parties who assist in operating our platform</li>
                <li><strong>Credit Bureaus:</strong> For credit checks and verification purposes</li>
                <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
              </ul>
              <p className="mt-3">
                We never sell your personal information to third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Restricted access to personal information on a need-to-know basis</li>
                <li>Secure authentication and access controls</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Your Rights and Choices</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and review your personal information</li>
                <li>Request corrections to inaccurate data</li>
                <li>Request deletion of your personal information (subject to legal requirements)</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to certain data processing activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy,
                unless a longer retention period is required by law. Loan application data is typically retained for 7 years to
                comply with regulatory requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns,
                and improve our Service. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Third-Party Services</h2>
              <p>
                Our Service may contain links to third-party websites or services. We are not responsible for the privacy
                practices of these third parties. We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
              <p>
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal
                information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. California Privacy Rights</h2>
              <p>
                California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right
                to know what personal information is collected, the right to delete personal information, and the right to opt-out
                of the sale of personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new
                Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <p className="mt-2">
                Email: privacy@halobusinessfinance.com<br />
                Address: [Your Business Address]<br />
                Phone: [Your Business Phone]
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

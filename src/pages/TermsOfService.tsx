import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Halo Business Finance platform ("Service"), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
              <p>
                Halo Business Finance provides a platform for business loan applications, financial management tools, and related services.
                We facilitate connections between borrowers and lenders but are not a direct lender.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate, complete, and current information</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must notify us immediately of any unauthorized access to your account</li>
                <li>You agree to use the Service only for lawful purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Application Process</h2>
              <p>
                Submitting a loan application does not guarantee approval. All applications are subject to review and verification.
                We reserve the right to request additional documentation or information at any time during the application process.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal and financial information.
                However, no method of transmission over the internet is 100% secure. You acknowledge and accept this inherent risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Privacy and Data Collection</h2>
              <p>
                Your use of the Service is also governed by our Privacy Policy. By using our Service, you consent to our collection,
                use, and disclosure of your information as described in the Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Intellectual Property</h2>
              <p>
                All content, features, and functionality of the Service are owned by Halo Business Finance and are protected by
                copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Halo Business Finance shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to the Service at any time, with or without notice,
                for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or
                through the Service. Continued use after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States,
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contact Information</h2>
              <p>
                If you have questions about these Terms, please contact us at:
              </p>
              <p className="mt-2">
                Email: legal@halobusinessfinance.com<br />
                Address: [Your Business Address]
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;

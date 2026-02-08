import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'HomeChef Privacy Policy - Learn how we collect, use, and protect your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-12">
          <h1 className="text-5xl font-display font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated: January 15, 2024
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-md prose prose-lg max-w-none">
              <h2>Introduction</h2>
              <p>
                Welcome to HomeChef ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>

              <h2>Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul>
                <li>Subscribe to our newsletter</li>
                <li>Submit a contact form</li>
                <li>Leave comments on recipes</li>
                <li>Create an account on our website</li>
              </ul>
              <p>
                This information may include your name, email address, and any other information you choose to provide.
              </p>

              <h3>Automatically Collected Information</h3>
              <p>
                When you visit our website, we may automatically collect certain information about your device, including:
              </p>
              <ul>
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Referring website</li>
                <li>Pages viewed and time spent on pages</li>
                <li>Date and time of visit</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Send you newsletters and promotional materials (with your consent)</li>
                <li>Respond to your comments and questions</li>
                <li>Prevent fraudulent activity and improve security</li>
              </ul>

              <h2>Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>

              <h2>Third-Party Services</h2>
              <h3>Google AdSense</h3>
              <p>
                We use Google AdSense to display advertisements on our website. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
              </p>

              <h3>Analytics</h3>
              <p>
                We may use third-party analytics services to monitor and analyze the use of our website. These services may use cookies and similar technologies to collect information about your use of our website.
              </p>

              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.
              </p>

              <h2>Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul>
                <li>The right to access your personal information</li>
                <li>The right to rectify inaccurate information</li>
                <li>The right to erase your personal information</li>
                <li>The right to restrict processing</li>
                <li>The right to data portability</li>
                <li>The right to object to processing</li>
              </ul>

              <h2>Children's Privacy</h2>
              <p>
                Our website is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>

              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul>
                <li>Email: privacy@homechef.com</li>
                <li>Website: <a href="/contact">Contact Form</a></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="ad-space-sidebar">
                AdSense: Sidebar 300x600 / 300x250
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'HomeChef Terms of Service - Rules and guidelines for using our website.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-12">
          <h1 className="text-5xl font-display font-bold mb-4">
            Terms of Service
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
              <h2>Agreement to Terms</h2>
              <p>
                By accessing and using HomeChef ("the Website"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>

              <h2>Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (recipes, images, information) on HomeChef for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul>
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software on the Website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>

              <h2>Disclaimer</h2>
              <h3>Recipe Information</h3>
              <p>
                The recipes and cooking information on HomeChef are provided for informational purposes only. While we strive for accuracy, we make no warranties or representations about the accuracy, reliability, or suitability of the recipes and information provided.
              </p>
              
              <h3>Dietary Information</h3>
              <p>
                Nutritional information and dietary tags are provided as estimates only. If you have food allergies, dietary restrictions, or health concerns, please verify all ingredients and consult with a healthcare professional before consuming any recipes from this website.
              </p>

              <h3>Cooking Safety</h3>
              <p>
                Users are responsible for following proper food safety guidelines and cooking instructions. HomeChef is not liable for any injuries, illnesses, or damages resulting from the preparation or consumption of recipes found on this website.
              </p>

              <h2>User Content</h2>
              <p>
                If you submit content to our website (such as comments, reviews, or photos), you grant HomeChef a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display that content on our website and in our marketing materials.
              </p>
              <p>
                You represent and warrant that:
              </p>
              <ul>
                <li>You own or have the necessary rights to the content you submit</li>
                <li>Your content does not violate any third-party rights</li>
                <li>Your content does not contain any unlawful, harmful, or offensive material</li>
              </ul>

              <h2>Intellectual Property</h2>
              <p>
                The content on HomeChef, including text, graphics, logos, images, recipes, and software, is the property of HomeChef and is protected by copyright and other intellectual property laws. You may not use, reproduce, or distribute any content from this website without our express written permission.
              </p>

              <h2>Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites that are not owned or controlled by HomeChef. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.
              </p>

              <h2>Advertising</h2>
              <p>
                HomeChef displays advertisements through Google AdSense and other advertising partners. These third-party advertisers may use cookies and other tracking technologies to collect information about your browsing activities. Please refer to our Privacy Policy for more information.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                In no event shall HomeChef or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on HomeChef, even if HomeChef or a HomeChef authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>

              <h2>Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless HomeChef and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the Website.
              </p>

              <h2>Modifications to Terms</h2>
              <p>
                HomeChef reserves the right to revise these Terms of Service at any time without notice. By using this website, you agree to be bound by the current version of these Terms of Service.
              </p>

              <h2>Governing Law</h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction in which HomeChef operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>

              <h2>Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <ul>
                <li>Email: legal@homechef.com</li>
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

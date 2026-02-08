'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-12">
          <h1 className="text-5xl font-display font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">
            We'd love to hear from you! Send us a message.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-md">
              {submitted && (
                <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="recipe">Recipe Question</option>
                    <option value="suggestion">Recipe Suggestion</option>
                    <option value="feedback">Feedback</option>
                    <option value="technical">Technical Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <button type="submit" className="btn-primary w-full md:w-auto">
                  Send Message
                </button>
              </form>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="text-4xl mb-3">📧</div>
                <h3 className="font-display font-semibold mb-2">Email</h3>
                <p className="text-gray-600 text-sm">contact@homechef.com</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="text-4xl mb-3">🌐</div>
                <h3 className="font-display font-semibold mb-2">Website</h3>
                <p className="text-gray-600 text-sm">www.homechef.com</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="text-4xl mb-3">💬</div>
                <h3 className="font-display font-semibold mb-2">Social</h3>
                <p className="text-gray-600 text-sm">@homechef</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="ad-space-sidebar mb-6">
                AdSense: Sidebar 300x600 / 300x250
              </div>

              <div className="bg-primary-50 rounded-xl p-6 border-2 border-primary-200">
                <h3 className="font-display font-semibold text-xl mb-3">Quick Response</h3>
                <p className="text-gray-700 text-sm">
                  We typically respond to inquiries within 24-48 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

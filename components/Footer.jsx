"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        {/* Logo / About */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">AADHI Academy</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Empowering students with skills in modern technologies like React,
            Next.js, Node.js, and more. Learn and grow with us.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/courses" className="hover:text-white">Courses</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: support@aadhiacademy.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Location: Chennai, India</li>
          </ul>
        </div>

        {/* Newsletter / CTA */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-gray-400 text-sm mb-3">
            Subscribe to our newsletter to receive updates on new courses.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 rounded-l bg-gray-800 text-white text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700 text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AADHI Academy. All rights reserved.
      </div>
    </footer>
  );
}

"use client";
import Link from "next/link";
import Footer from "@/components/Footer";   // ✅ 1. Import Footer

export default function HomePage() {
  return (
    <main>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to AADHI Academy
        </h1>
        <p className="text-lg md:text-2xl mb-6 max-w-2xl">
          Learn cutting-edge technologies and boost your career with our expert-led online courses.
        </p>
        <Link
          href="/courses"
          className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Explore Courses →
        </Link>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-indigo-600">About Us</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            AADHI Academy is committed to providing top-quality online education.  
            Our mission is to empower students with practical skills in modern  
            technologies like React, Next.js, and more.
          </p>
          <p className="text-gray-600 leading-relaxed">
            With experienced instructors and hands-on learning, we prepare you  
            for real-world success in the IT industry.
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src="https://placehold.co/500x300"
            alt="About AADHI Academy"
            className="rounded-lg shadow-md"
          />
        </div>
      </section>

      {/* Courses Preview Section */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-indigo-600 mb-4">Our Courses</h2>
          <p className="text-gray-600">
            Explore our most popular courses designed to boost your skills.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* React Basics */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
            <img src="https://placehold.co/400x200" alt="React Basics" className="w-full h-40 object-cover" />
            <div className="p-4 text-left">
              <h3 className="text-xl font-semibold mb-2">React Basics</h3>
              <p className="text-gray-600 mb-4">Learn the fundamentals of React and start building dynamic UIs.</p>
              <Link href="/courses" className="text-indigo-600 font-medium hover:underline">
                View Course →
              </Link>
            </div>
          </div>

          {/* Next.js Deep Dive */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
            <img src="https://placehold.co/400x200" alt="Next.js Deep Dive" className="w-full h-40 object-cover" />
            <div className="p-4 text-left">
              <h3 className="text-xl font-semibold mb-2">Next.js Deep Dive</h3>
              <p className="text-gray-600 mb-4">Master advanced Next.js features including SSR and API routes.</p>
              <Link href="/courses" className="text-indigo-600 font-medium hover:underline">
                View Course →
              </Link>
            </div>
          </div>

          {/* Node.js with Express */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
            <img src="https://placehold.co/400x200" alt="Node.js with Express" className="w-full h-40 object-cover" />
            <div className="p-4 text-left">
              <h3 className="text-xl font-semibold mb-2">Node.js with Express</h3>
              <p className="text-gray-600 mb-4">Build scalable backend applications with Node.js and Express.</p>
              <Link href="/courses" className="text-indigo-600 font-medium hover:underline">
                View Course →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

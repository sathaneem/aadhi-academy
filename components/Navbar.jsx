"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        // ✅ check if user is admin
        const { data: adminRow } = await supabase
          .from("admins")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        setIsAdmin(!!adminRow);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <nav className="sticky top-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          AADHI Academy
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          {!isAdmin && (
            <>
              <Link href="/" className="hover:text-indigo-600 transition">Home</Link>
              <Link href="/about" className="hover:text-indigo-600 transition">About</Link>
              <Link href="/courses" className="hover:text-indigo-600 transition">Courses</Link>
              <Link href="/contact" className="hover:text-indigo-600 transition">Contact</Link>
            </>
          )}
          {isAdmin && (
            <Link href="/admin" className="hover:text-yellow-600 font-semibold">
              Admin Dashboard
            </Link>
          )}
        </div>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Welcome <strong>{user.email}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 rounded hover:bg-gray-100 transition">Login</Link>
              <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Signup</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1 focus:outline-none"
        >
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 flex flex-col gap-4 text-gray-700 font-medium">
          {!isAdmin && (
            <>
              <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
              <Link href="/courses" onClick={() => setMenuOpen(false)}>Courses</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            </>
          )}
          {isAdmin && (
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-yellow-600 font-semibold">
              Admin Dashboard
            </Link>
          )}
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Welcome <strong>{user.email}</strong>
              </span>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

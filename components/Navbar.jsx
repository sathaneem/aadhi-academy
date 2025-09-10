"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Check current user on mount
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    });

    // ✅ Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="flex gap-4 p-4 bg-gray-800 text-white items-center">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/courses">Courses</Link>
      <Link href="/contact">Contact</Link>

      <div className="ml-auto flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-300">
              Welcome <strong>{user.email}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup" className="ml-4">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

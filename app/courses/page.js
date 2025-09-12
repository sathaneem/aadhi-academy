"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function CoursesPage() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // ✅ check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // ✅ fetch courses where user is enrolled
        const { data, error } = await supabase
          .from("enrollments")
          .select("courses(id, title, description, thumbnail)")
          .eq("student_id", user.id);

        if (error) {
          console.error(error);
        } else {
          setCourses(data.map((e) => e.courses));
        }
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Restricted Area</h1>
        <p className="mb-4">You must be logged in to view this page.</p>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10 text-indigo-600">
        My Courses
      </h1>

      {courses.length === 0 ? (
        <p className="text-center text-gray-600">
          You are not enrolled in any courses yet. Please contact your administrator.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={course.thumbnail || "https://placehold.co/400x200"}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-left">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>
                <Link
                  href={`/courses/${course.id}`}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  View Course →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

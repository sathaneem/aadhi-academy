"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function CoursesPage() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      // ✅ get logged-in user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push("/login"); // redirect if not logged in
        return;
      }
      setUser(user);

      // ✅ fetch enrolled courses
      const { data, error } = await supabase
        .from("enrollments")
        .select("courses(id, title, description, thumbnail)")
        .eq("student_id", user.id);

      if (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } else {
        setCourses(data.map((row) => row.courses));
      }

      setLoading(false);
    };

    fetchCourses();
  }, [router]);

  if (loading) return <p className="p-6">Loading courses...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {courses.length === 0 ? (
        <p className="text-gray-600">
          You are not enrolled in any courses yet. Please contact your administrator.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((c) => (
            <div
              key={c.id}
              className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              {c.thumbnail && (
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}
              <h2 className="text-xl font-semibold">{c.title}</h2>
              <p className="text-gray-600 mb-3">{c.description}</p>

              {/* ✅ Link to dynamic course page */}
              <Link
                href={`/courses/${c.id}`}
                className="text-indigo-600 underline"
              >
                View Course →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

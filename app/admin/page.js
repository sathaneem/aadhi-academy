"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // 🚨 TODO: Add "is_admin" check later
      const { data: coursesData } = await supabase.from("courses").select("*").order("id");
      setCourses(coursesData || []);

      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) return <p className="p-6">Loading admin dashboard...</p>;

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-600 mb-8">
        Admin Dashboard
      </h1>

      {/* Courses Management */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Manage Courses</h2>
        <button
          onClick={() => router.push("/admin/courses/new")}
          className="bg-indigo-600 text-white px-4 py-2 rounded mb-4 hover:bg-indigo-700 transition"
        >
          ➕ Add New Course
        </button>

        {courses.length === 0 ? (
          <p className="text-gray-600">No courses available yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="border rounded-lg p-6 bg-white shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
               
                <div className="flex gap-3">
  <button
    onClick={() => router.push(`/admin/courses/${course.id}/edit`)}
    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
  >
    ✏️ Edit
  </button>
  <button
    onClick={() => router.push(`/admin/courses/${course.id}/content`)}
    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
  >
    📚 Content
  </button>
  <button
    onClick={() => router.push(`/admin/courses/${course.id}/students`)}
    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
  >
    👥 Students
  </button>
  <button
    onClick={async () => {
      if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
        const { error } = await supabase
          .from("courses")
          .delete()
          .eq("id", course.id);
        if (error) {
          alert("Error deleting course: " + error.message);
        } else {
          // refresh page after delete
          window.location.reload();
        }
      }
    }}
    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
  >
    🗑️ Delete
  </button>
</div>

              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

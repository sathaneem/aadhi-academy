"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
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

      // ✅ fetch enrolled courses
      const { data: enrollments, error: enrollError } = await supabase
        .from("enrollments")
        .select("courses(id, title, description, thumbnail)")
        .eq("student_id", user.id);

      if (enrollError) {
        console.error(enrollError);
        setLoading(false);
        return;
      }

      const enrolledCourses = enrollments.map((e) => e.courses);

      // ✅ fetch lessons + progress for each course
      const progressResults = await Promise.all(
        enrolledCourses.map(async (course) => {
          // lessons count
          const { data: lessons } = await supabase
            .from("course_content")
            .select("id")
            .eq("course_id", course.id);

          const totalLessons = lessons?.length || 0;

          // completed count
          const { data: completed } = await supabase
            .from("lesson_progress")
            .select("id")
            .eq("student_id", user.id)
            .in(
              "content_id",
              lessons?.map((l) => l.id) || []
            )
            .eq("completed", true);

          const completedLessons = completed?.length || 0;
          const percentage =
            totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0;

          return {
            ...course,
            totalLessons,
            completedLessons,
            percentage,
          };
        })
      );

      setCourses(progressResults);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) return <p className="p-6">Loading dashboard...</p>;
  if (!user) return null;

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-600 mb-8">
        Welcome, {user.email}
      </h1>
      <h2 className="text-2xl font-semibold mb-6">My Courses</h2>

      {courses.length === 0 ? (
        <p className="text-gray-600">
          You are not enrolled in any courses yet.
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
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* ✅ Progress Bar */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">
                    {course.completedLessons} / {course.totalLessons} lessons (
                    {course.percentage}%)
                  </p>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-2 transition-all"
                      style={{ width: `${course.percentage}%` }}
                    ></div>
                  </div>
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="inline-block text-indigo-600 font-medium hover:underline mt-3"
                >
                  Continue →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

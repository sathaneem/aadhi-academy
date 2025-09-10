"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CourseDetailPage() {
  const { id } = useParams(); // dynamic course id
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // ✅ check login
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // ✅ check enrollment
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("*")
        .eq("student_id", user.id)
        .eq("course_id", id)
        .maybeSingle();

      if (!enrollment) {
        setAllowed(false);
        setLoading(false);
        return;
      }
      setAllowed(true);

      // ✅ get course
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
      setCourse(courseData);

      // ✅ get course content
      const { data: contentData } = await supabase
        .from("course_content")
        .select("*")
        .eq("course_id", id);
      setContent(contentData || []);

      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!allowed) return <p className="p-6 text-red-600">🚫 You are not enrolled in this course.</p>;
  if (!course) return <p className="p-6">Course not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="mb-6 text-gray-600">{course.description}</p>

      <h2 className="text-xl font-semibold mb-3">Course Content</h2>
      {content.length === 0 ? (
        <p>No content added for this course yet.</p>
      ) : (
        <ul className="space-y-4">
          {content.map((item) => (
            <li key={item.id} className="border p-4 rounded bg-white shadow">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              {item.content_type === "video" && (
                <video controls className="w-full rounded">
                  <source src={item.file_url} type="video/mp4" />
                </video>
              )}
              {item.content_type === "pdf" && (
                <a
                  href={item.file_url}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  📄 Open PDF
                </a>
              )}
              {item.content_type === "text" && (
                <p className="text-gray-700">{item.file_url}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

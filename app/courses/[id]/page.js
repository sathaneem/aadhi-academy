"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [openLesson, setOpenLesson] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // check enrollment
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

      // get course
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
      setCourse(courseData);

      // get course content
      const { data: contentData } = await supabase
        .from("course_content")
        .select("*")
        .eq("course_id", id)
        .order("id", { ascending: true });

      setContent(contentData || []);

      // get progress
      const { data: progressData } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("student_id", user.id);

      const progressMap = {};
      progressData?.forEach((p) => {
        progressMap[p.content_id] = p.completed;
      });
      setProgress(progressMap);

      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  const markCompleted = async (contentId) => {
    if (!user) return;

    // upsert progress
    const { error } = await supabase.from("lesson_progress").upsert({
      student_id: user.id,
      content_id: contentId,
      completed: true,
      completed_at: new Date(),
    });

    if (!error) {
      setProgress({ ...progress, [contentId]: true });
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!allowed) return <p className="p-6 text-red-600">🚫 You are not enrolled in this course.</p>;
  if (!course) return <p className="p-6">Course not found.</p>;

  // ✅ Progress calculation
  const totalLessons = content.length;
  const completedLessons = Object.values(progress).filter((p) => p).length;
  const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="py-16 px-6 max-w-5xl mx-auto">
      {/* Course Title + Description */}
      <h1 className="text-4xl font-bold mb-2 text-indigo-600">{course.title}</h1>
      <p className="mb-8 text-gray-600 text-lg">{course.description}</p>

      {/* ✅ Progress Bar */}
      <div className="mb-10">
        <p className="mb-2 font-medium text-gray-700">
          Progress: {completedLessons} / {totalLessons} lessons ({percentage}%)
        </p>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="bg-green-500 h-3 transition-all"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Course Content Accordion */}
      <h2 className="text-2xl font-semibold mb-6">Course Content</h2>
      {content.length === 0 ? (
        <p className="text-gray-500">No content added for this course yet.</p>
      ) : (
        <div className="space-y-4">
          {content.map((item, idx) => (
            <div key={item.id} className="border rounded-lg bg-white shadow">
              {/* Accordion Header */}
              <button
                onClick={() => setOpenLesson(openLesson === item.id ? null : item.id)}
                className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium hover:bg-gray-50 transition"
              >
                <span>
                  {idx + 1}. {item.title}
                </span>
                <span className="text-gray-500">
                  {openLesson === item.id ? "−" : "+"}
                </span>
              </button>

              {/* Accordion Body */}
              {openLesson === item.id && (
                <div className="px-6 pb-6 space-y-4">
                  {item.content_type === "video" && (
                    <video controls className="w-full rounded-md shadow mt-3">
                      <source src={item.file_url} type="video/mp4" />
                      Your browser does not support video.
                    </video>
                  )}

                  {item.content_type === "pdf" && (
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline flex items-center gap-2 mt-3"
                    >
                      📄 Open PDF
                    </a>
                  )}

                  {item.content_type === "text" && (
                    <p className="text-gray-700 mt-3">{item.file_url}</p>
                  )}

                  {/* Mark Completed */}
                  <div>
                    {progress[item.id] ? (
                      <span className="text-green-600 font-semibold">
                        ✅ Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => markCompleted(item.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

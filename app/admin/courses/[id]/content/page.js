"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CourseContentPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("video");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // ✅ Get logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        setIsAdmin(profile?.is_admin || false);
      }

      // ✅ Get course
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
      setCourse(courseData);

      // ✅ Get lessons
      const { data: lessonsData } = await supabase
        .from("course_content")
        .select("*")
        .eq("course_id", id)
        .order("id");
      setLessons(lessonsData || []);

      setLoading(false);
    };

    fetchData();
  }, [id]);


  const handleAddLesson = async (e) => {
  e.preventDefault();
  setError("");

  if (!title.trim()) {
    setError("Title is required.");
    return;
  }

  let fileUrl = null;
  let textContent = null;

  if (contentType === "text") {
    // ✅ Directly save text notes
    textContent = title.trim();
  } else {
    // ✅ Require file for video/pdf
    if (!file) {
      setError("File is required for videos and PDFs.");
      return;
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("course-files")
      .upload(filePath, file);

    if (uploadError) {
      setError("File upload failed: " + uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("course-files")
      .getPublicUrl(filePath);

    fileUrl = publicUrl;
  }

  // ✅ Insert lesson
  const { error: dbError } = await supabase.from("course_content").insert([
    {
      course_id: id,
      title: title.trim(),
      content_type: contentType,
      file_url: fileUrl,
      text_content: textContent,
    },
  ]);

  if (dbError) {
    setError("Database insert failed: " + dbError.message);
    return;
  }

  setTitle("");
  setFile(null);

  const { data: lessonsData } = await supabase
    .from("course_content")
    .select("*")
    .eq("course_id", id)
    .order("id");

  setLessons(lessonsData || []);
};



  const handleDeleteLesson = async (lessonId) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      await supabase.from("course_content").delete().eq("id", lessonId);
      setLessons(lessons.filter((l) => l.id !== lessonId));
    }
  };

  if (loading) return <p className="p-6">Loading course content...</p>;
  if (!course) return <p className="p-6">Course not found.</p>;

  return (
    <div className="py-16 px-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">
        Manage Content for {course.title}
      </h1>

      {/* Only Admins See Upload Form */}
      {isAdmin && (
        <form
          onSubmit={handleAddLesson}
          className="bg-white p-6 rounded shadow space-y-4 mb-8"
        >
          {error && <div className="text-red-600">{error}</div>}

          <label className="block">
            <span className="text-sm font-medium">Lesson Title *</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border px-3 py-2 rounded"
              placeholder="E.g. Introduction to React"
            />
          </label>

          <label className="block">
  <span className="text-sm font-medium">Content Type *</span>
  <select
    value={contentType}
    onChange={(e) => setContentType(e.target.value)}
    className="mt-1 block w-full border px-3 py-2 rounded"
  >
    <option value="video">Video (mp4)</option>
    <option value="pdf">PDF</option>
    <option value="text">Text (notes)</option>
  </select>
</label>

{/* ✅ If text → textarea */}
{contentType === "text" && (
  <label className="block">
    <span className="text-sm font-medium">Lesson Notes *</span>
    <textarea
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="mt-1 block w-full border px-3 py-2 rounded"
      rows="5"
      placeholder="Write lesson notes here..."
    />
  </label>
)}

{/* ✅ If video/pdf → file upload */}
{contentType !== "text" && (
  <label className="block">
    <span className="text-sm font-medium">Upload File *</span>
    <input
      type="file"
      onChange={(e) => setFile(e.target.files[0])}
      className="mt-1 block w-full border px-3 py-2 rounded"
    />
  </label>
)}


          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            ➕ Add Lesson
          </button>
        </form>
      )}

      {/* Lessons List */}
      <h2 className="text-xl font-semibold mb-4">Lessons</h2>
      {lessons.length === 0 ? (
        <p>No lessons yet. {isAdmin ? "Add one above." : "Ask admin to add content."}</p>
      ) : (
        <ul className="space-y-4">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="border p-4 rounded bg-white shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{lesson.title}</h3>
                <p className="text-sm text-gray-600">
                  {lesson.content_type.toUpperCase()} →{" "}
                  <a href={lesson.file_url} target="_blank" className="text-blue-600 underline">
                    Open File
                  </a>
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

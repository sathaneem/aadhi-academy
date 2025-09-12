"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CourseStudentsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Get course
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
      setCourse(courseData);

      // Get enrolled students (join enrollments → profiles)
      const { data: enrollmentData } = await supabase
        .from("enrollments")
        .select("id, student_id, profiles:student_id(email)")
        .eq("course_id", id);

      setStudents(enrollmentData || []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleEnroll = async (e) => {
    e.preventDefault();
    setError("");

    console.log("🔍 Checking profiles for email:", email);

    // 🔍 Find student by email in profiles
    const { data: users, error: userError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", email)
      .limit(1);

      console.log("Profiles result:", users, userError);

    if (userError || !users || users.length === 0) {
      setError("User not found with this email.");
      return;
    }
    
    const student = users[0];
    console.log("✅ Found student:", student);

    // Enroll student
    const { error: enrollError } = await supabase.from("enrollments").insert([
      {
        course_id: id,
        student_id: student.id,
      },
    ]);

    console.log("Enrollment insert result:", enrollError);

        if (enrollError) {
  
        if (enrollError.code === "23505") {
    // 23505 = unique violation in Postgres
    setError("Student is already enrolled in this course.");
  } else {
    setError(enrollError.message);
  }
  return;
}

console.log("✅ Student enrolled successfully!");

    setEmail("");

    // refresh list
    const { data: enrollmentData } = await supabase
      .from("enrollments")
      .select("id, student_id, profiles:student_id(email)")
      .eq("course_id", id);

    setStudents(enrollmentData || []);
  };

  const handleRemove = async (enrollmentId) => {
    if (confirm("Remove this student from the course?")) {
      await supabase.from("enrollments").delete().eq("id", enrollmentId);
      setStudents(students.filter((s) => s.id !== enrollmentId));
    }
  };

  if (loading) return <p className="p-6">Loading students...</p>;
  if (!course) return <p className="p-6">Course not found.</p>;

  return (
    <div className="py-16 px-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">
        Manage Students for {course.title}
      </h1>

      {/* Enroll Student Form */}
      <form
        onSubmit={handleEnroll}
        className="bg-white p-6 rounded shadow space-y-4 mb-8"
      >
        {error && <div className="text-red-600">{error}</div>}

        <label className="block">
          <span className="text-sm font-medium">Student Email *</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border px-3 py-2 rounded"
            placeholder="student@example.com"
          />
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ➕ Enroll Student
        </button>
      </form>

      {/* Student List */}
      <h2 className="text-xl font-semibold mb-4">Enrolled Students</h2>
      {students.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <ul className="space-y-4">
          {students.map((s) => (
            <li
              key={s.id}
              className="border p-4 rounded bg-white shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{s.profiles?.email}</p>
              </div>
              <button
                onClick={() => handleRemove(s.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

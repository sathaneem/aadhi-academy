"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from("courses").select("*");
      if (error) {
        console.error("Error fetching courses:", error);
        setErrorMsg(error.message);
      } else {
        setCourses(data);
      }
    };

    fetchCourses();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Supabase Test</h1>

      {errorMsg && <p className="text-red-600">Error: {errorMsg}</p>}

      {courses.length === 0 ? (
        <p>No courses found in database</p>
      ) : (
        <ul className="list-disc list-inside">
          {courses.map((course) => (
            <li key={course.id}>
              <strong>{course.title}</strong> — {course.description}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

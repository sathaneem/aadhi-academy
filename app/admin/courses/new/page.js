"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function NewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // redirect to login if not authenticated
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);

    // DEV: inserting directly from client using anon key.
    // If you have RLS policies preventing insert, use a server API with service role key.
    const { data, error } = await supabase
      .from("courses")
      .insert([{ title: title.trim(), description: description.trim(), thumbnail: thumbnail.trim() || null }])
      .select()
      .single();

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // go to manage content for the new course
    router.push(`/admin/courses/${data.id}/content`);
  };

  return (
    <div className="py-16 px-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">Add New Course</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        {error && <div className="text-red-600">{error}</div>}

        <label className="block">
          <span className="text-sm font-medium">Course Title *</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border px-3 py-2 rounded"
            placeholder="E.g. React Basics"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Short Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full border px-3 py-2 rounded"
            placeholder="A short course description"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Thumbnail URL (optional)</span>
          <input
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="mt-1 block w-full border px-3 py-2 rounded"
            placeholder="https://..."
          />
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create Course"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Note: This form inserts a course directly using the Supabase anon key. For production secure this action behind a server API and admin checks.
        </p>
      </form>
    </div>
  );
}

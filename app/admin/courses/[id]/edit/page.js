"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("Course not found");
      } else {
        setTitle(data.title);
        setDescription(data.description || "");
        setThumbnail(data.thumbnail || "");
      }
      setLoading(false);
    };

    fetchCourse();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase
      .from("courses")
      .update({
        title,
        description,
        thumbnail,
      })
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin"); // go back to dashboard
  };

  if (loading) return <p className="p-6">Loading course...</p>;

  return (
    <div className="py-16 px-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">Edit Course</h1>

      <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow space-y-4">
        {error && <div className="text-red-600">{error}</div>}

        <label className="block">
          <span className="text-sm font-medium">Course Title *</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border px-3 py-2 rounded"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full border px-3 py-2 rounded"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Thumbnail URL</span>
          <input
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="mt-1 block w-full border px-3 py-2 rounded"
          />
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

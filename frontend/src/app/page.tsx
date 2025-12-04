"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-slate-500 text-center">Loading editor...</div>
  ),
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            BlockNote Editor
          </h1>
          <p className="text-slate-600">
            A beautiful, modern block-based editor for Next.js
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200">
          <Editor />
        </div>
      </div>
    </div>
  );
}

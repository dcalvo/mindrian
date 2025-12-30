"use client";

import dynamic from "next/dynamic";
import BlocknoteWithSlash from "@/components/BlockNoteWithSlash";


export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            BlockNote Slash Menu Test
          </h1>
          <p className="text-slate-600">
            Test your custom Slash Agent menu item
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200 p-8">
          <BlocknoteWithSlash />
        </div>
      </div>
    </div>
  );
}


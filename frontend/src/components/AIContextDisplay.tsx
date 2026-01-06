"use client";

import { useAIContext } from "../contexts/AIContext";

export default function AIContextDisplay() {
  const { context } = useAIContext();

  if (context.length === 0) {
    return (
      <div className="p-6 text-slate-500 text-center border-t border-slate-200">
        <p className="text-sm">No AI context added yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 border-t border-slate-200 bg-slate-50">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">
        AI Context ({context.length})
      </h3>
      <ul className="space-y-2">
        {context.map((item, index) => (
          <li
            key={index}
            className="text-sm text-slate-600 bg-white p-3 rounded-md border border-slate-200"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
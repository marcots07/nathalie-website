"use client";

import { useDecorEdit } from "./DecorEditContext";

/**
 * Floating switch for decor edit mode. Rendered only when the app is
 * running via `npm run dev` — never in a production build, so it can't
 * end up on the deployed site. The API route it depends on
 * (`/api/decor-positions`) has its own independent NODE_ENV guard too.
 */
export default function DecorEditToggle() {
  if (process.env.NODE_ENV !== "development") return null;
  return <DecorEditToggleButton />;
}

function DecorEditToggleButton() {
  const { editMode, toggleEditMode } = useDecorEdit();

  return (
    <button
      onClick={toggleEditMode}
      className={`fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-label shadow-lg transition-colors duration-300 ${
        editMode
          ? "bg-terracotta-600 text-cream-50 hover:bg-terracotta-700"
          : "bg-sage-700 text-cream-50 hover:bg-sage-800"
      }`}
    >
      <span aria-hidden>{editMode ? "✕" : "✿"}</span>
      {editMode ? "Terminar de mover flores" : "Mover flores"}
    </button>
  );
}

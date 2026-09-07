"use client";

import { createContext, useContext, useEffect, useState } from "react";

type DecorEditContextValue = {
  editMode: boolean;
  toggleEditMode: () => void;
};

const DecorEditContext = createContext<DecorEditContextValue>({
  editMode: false,
  toggleEditMode: () => {},
});

const STORAGE_KEY = "decor-edit-mode";

/**
 * Dev-only toggle shared by every DecorFlower on the page, so turning edit
 * mode on once (via DecorEditToggle) unlocks dragging for all of them at
 * once, and stays on across page navigation (localStorage) while you place
 * flowers on several sections in one sitting.
 */
export function DecorEditProvider({ children }: { children: React.ReactNode }) {
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    try {
      setEditMode(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // ignore
    }
  }, []);

  const toggleEditMode = () => {
    setEditMode((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <DecorEditContext.Provider value={{ editMode, toggleEditMode }}>
      {children}
    </DecorEditContext.Provider>
  );
}

export function useDecorEdit() {
  return useContext(DecorEditContext);
}

"use client";

import { useState } from "react";

export function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return;
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item);
}

/** Drag-to-reorder for the admin's lists; the arrow buttons use `move` directly. */
export function useDragList(onMove: (from: number, to: number) => void) {
  const [dragging, setDragging] = useState<number | null>(null);

  const dragProps = (index: number) => ({
    draggable: true,
    onDragStart: (event: React.DragEvent) => {
      setDragging(index);
      event.dataTransfer.effectAllowed = "move";
    },
    onDragOver: (event: React.DragEvent) => event.preventDefault(),
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      if (dragging !== null && dragging !== index) onMove(dragging, index);
      setDragging(null);
    },
    onDragEnd: () => setDragging(null),
  });

  return { dragging, dragProps };
}

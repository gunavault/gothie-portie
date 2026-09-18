"use client";

import { browserClient } from "@/lib/supabase-browser";

const MAX_AUDIO = 5 * 1024 * 1024;

/** Downscales in the browser so a phone photo doesn't land in Storage at 12 MP. */
async function shrink(file: File, maxPx: number): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = reject;
      element.src = url;
    });
    const scale = Math.min(1, maxPx / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("encode failed"))),
        "image/jpeg",
        0.82,
      ),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

type Result = { url: string } | { error: string };

export async function uploadImage(file: File, maxPx: number): Promise<Result> {
  if (!file.type.startsWith("image/")) return { error: "That is not an image" };
  const body = await shrink(file, maxPx);
  return put(`${crypto.randomUUID()}.jpg`, body, "image/jpeg");
}

export async function uploadAudio(file: File): Promise<Result> {
  if (!file.type.startsWith("audio/")) return { error: "That is not an audio file" };
  if (file.size > MAX_AUDIO) return { error: "Keep voice lines under 5 MB" };
  const extension = file.name.split(".").pop() || "mp3";
  return put(`${crypto.randomUUID()}.${extension}`, file, file.type);
}

async function put(path: string, body: Blob, contentType: string): Promise<Result> {
  const db = browserClient();
  const { error } = await db.storage.from("media").upload(path, body, { contentType });
  if (error) return { error: error.message };
  const { data } = db.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl };
}

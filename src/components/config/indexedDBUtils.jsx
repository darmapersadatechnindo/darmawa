import { openDB } from "idb";

// Inisialisasi database
const dbPromise = openDB("WhatsAppMediaDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("media")) {
      db.createObjectStore("media", { keyPath: "id" }); // Gunakan keyPath untuk indexing lebih rapi
    }
  },
});

export const saveMedia = async (mediaId, mediaBlob, mimetype) => {
  const db = await dbPromise;
  await db.put("media", { blob: mediaBlob, mimetype }, mediaId);
};

export const getMedia = async (mediaId) => {
  const db = await dbPromise;
  const data = await db.get("media", mediaId);
  if (!data || !data.blob) return null; // Pastikan ada data

  return new Blob([data.blob], { type: data.mimetype }); // Konversi ke Blob
};

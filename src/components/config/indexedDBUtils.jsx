import { openDB } from "idb";

// Inisialisasi database
const dbPromise = openDB("WhatsAppMediaDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("media")) {
      db.createObjectStore("media", { keyPath: "id" }); 
    }
  },
});

export const saveMedia = async (mediaId, mediaBlob, mimetype) => {
  const db = await dbPromise;
  await db.put("media", { id: mediaId, blob: mediaBlob, mimetype });
};

export const getMedia = async (mediaId) => {
  const db = await dbPromise;
  const data = await db.get("media", mediaId);
  if (!data || !data.blob) return null; 

  return new Blob([data.blob], { type: data.mimetype }); 
};

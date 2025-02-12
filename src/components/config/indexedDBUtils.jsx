import { openDB } from "idb";

// Inisialisasi database
const dbPromise = openDB("WhatsAppMediaDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("media")) {
      db.createObjectStore("media");
    }
  },
});

// Fungsi menyimpan media ke IndexedDB
export const saveMedia = async (mediaId, mediaBlob) => {
  const db = await dbPromise;
  await db.put("media", mediaBlob, mediaId);
};

// Fungsi mengambil media dari IndexedDB
export const getMedia = async (mediaId) => {
  const db = await dbPromise;
  return db.get("media", mediaId);
};

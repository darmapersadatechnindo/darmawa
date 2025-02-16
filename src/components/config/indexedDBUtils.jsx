import { openDB, deleteDB } from "idb";

// 🔥 100% FIX: Hapus IndexedDB otomatis saat aplikasi pertama kali dijalankan!
const resetDatabase = async () => {
  console.log("Menghapus database lama...");
  await deleteDB("WhatsAppMediaDB");
  console.log("Database lama dihapus, membuat ulang...");
};

// **Panggil resetDatabase sebelum inisialisasi IndexedDB**
resetDatabase().then(() => {
  console.log("Database reset, inisialisasi ulang...");
});

// ✅ Buat ulang IndexedDB dengan object store yang BENAR!
const dbPromise = openDB("WhatsAppMediaDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("media")) {
      db.createObjectStore("media", { keyPath: "id" });
      console.log("Object store 'media' dibuat dengan keyPath 'id' ✅");
    }
  },
});

// ✅ Fungsi untuk menyimpan media
export const saveMedia = async (mediaId, mediaBlob, mimetype) => {
  if (!mediaId || !mediaBlob || !mimetype) {
    console.error("❌ Data tidak valid:", { mediaId, mediaBlob, mimetype });
    return;
  }

  const db = await dbPromise;
  console.log("✅ Menyimpan media ke IndexedDB:", { mediaId, mediaBlob, mimetype });

  await db.put("media", { id: String(mediaId), blob: mediaBlob, mimetype });
};

// ✅ Fungsi untuk mengambil media
export const getMedia = async (mediaId) => {
  const db = await dbPromise;
  const data = await db.get("media", String(mediaId));

  if (!data || !data.blob) return null;

  return new Blob([data.blob], { type: data.mimetype });
};

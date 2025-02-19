import { openDB } from "idb";

const dbPromise = openDB("WhatsAppDBDelta", 1, {
  upgrade(db) {
    console.log("Membuka IndexedDB dan Membuat Object Store");

    if (!db.objectStoreNames.contains("media")) {
      db.createObjectStore("media", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("profil")) {
      db.createObjectStore("profil", { keyPath: "id" });
    }
  },
});


export const saveMedia = async (mediaId, mediaBlob, mimetype) => {
  try {
      const db = await dbPromise;
      const arrayBuffer = await mediaBlob.arrayBuffer();
      await db.put("media", { id: String(mediaId), data: arrayBuffer, mimetype })
  } catch (error) {
      console.error("❌ [saveMedia] Gagal menyimpan ke IndexedDB!", error);
  }
};
export const getMedia = async (mediaId) => {
  const db = await dbPromise;
  const data = await db.get("media", String(mediaId));

  if (!data || !data.data) {
      return null;
  }
  return new Blob([data.data], { type: data.mimetype });
};

export const saveProfilUrl = async (userId, prifilUrl) => {
  try {
      const db = await dbPromise;
      await db.put("profil", { id: String(userId), data: prifilUrl })
  } catch (error) {
      console.error("❌ [saveMedia] Gagal menyimpan ke IndexedDB!", error);
  }
};
export const getProfilUrl = async (userId) => {
  try {
    const db = await dbPromise;

    if (!db.objectStoreNames.contains("profil")) {
      console.error("❌ Object store 'profil' tidak ditemukan!");
      return null;
    }

    const data = await db.get("profil", String(userId));

    if (!data || !data.data) {
      return null;
    }
    return data.data;
  } catch (error) {
    console.error("❌ [getProfilUrl] Gagal mengambil dari IndexedDB!", error);
    return null;
  }
};


import { SiteData } from "../types";

const DB_NAME = "DMG_Ecosystem_DB";
const DB_VERSION = 2;
const STORE_NAME = "site_config";
const CONFIG_KEY = "current_config";

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = (event: any) => reject(event.target.error);
  });
};

import { apiService } from "./apiService";

/**
 * Global Data Fetching Strategy:
 * 1. Try to load from API (backend database) - PRIMARY SOURCE
 * 2. If API unavailable, try IndexedDB (local cache)
 * 3. If nothing local, try to fetch 'site_data.json' from the root of the website
 * 4. Fallback to hardcoded INITIAL_DATA
 */
export const loadSiteData = async (initialFallback: SiteData): Promise<SiteData> => {
  // 1. Try API first (backend database)
  try {
    const apiData = await apiService.loadSiteData();
    if (apiData) {
      // Cache in IndexedDB for offline access
      try {
        await saveSiteData(apiData);
      } catch (e) {
        // Ignore cache errors
      }
      console.log("✓ Configuration loaded from API database.");
      return apiData;
    }
  } catch (e) {
    console.warn("API unavailable, trying local cache...");
  }

  // 2. Check Local Browser DB (cache/offline fallback)
  try {
    const db = await initDB();
    const localData = await new Promise<SiteData | null>((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(CONFIG_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });

    if (localData) {
      console.log("✓ Configuration loaded from local cache.");
      return localData;
    }
  } catch (e) {
    console.warn("IndexedDB not available, checking for server-side config.");
  }

  // 3. Check for the "Published" file on the Coolify server
  try {
    const response = await fetch('/site_data.json');
    if (response.ok) {
      const publishedData = await response.json();
      console.log("✓ Configuration loaded from site_data.json.");
      return publishedData;
    }
  } catch (e) {
    console.log("No published site_data.json found on server. Using default template.");
  }

  return initialFallback;
};

export const saveSiteData = async (data: SiteData): Promise<void> => {
  // 1. Try to save to API (backend database) - PRIMARY STORAGE
  try {
    const saved = await apiService.saveSiteData(data);
    if (saved) {
      console.log("✓ Data saved to API database.");
    } else {
      console.warn("API save failed, saving to local cache only.");
    }
  } catch (e) {
    console.warn("API unavailable, saving to local cache only:", e);
  }

  // 2. Always save to IndexedDB as cache/backup
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, CONFIG_KEY);
    request.onsuccess = () => {
      console.log("✓ Data cached locally.");
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
};

export const clearDatabase = async (): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

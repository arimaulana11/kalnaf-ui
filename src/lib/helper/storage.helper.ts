// storage.helper.ts

type StorageValue<T> = {
  value: T;
  expiry?: number; // timestamp dalam ms
};

const isBrowser = (): boolean => {
  return typeof window !== "undefined";
};

export const storage = {
  set<T>(key: string, value: T, ttlInMinutes?: number): void {
    if (!isBrowser()) return;

    try {
      const item: StorageValue<T> = {
        value,
      };

      if (ttlInMinutes) {
        item.expiry = Date.now() + ttlInMinutes * 60 * 1000;
      }

      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  get<T>(key: string): T | null {
    if (!isBrowser()) return null;

    const data = localStorage.getItem(key);
    if (!data) return null;

    try {
      const parsed: StorageValue<T> = JSON.parse(data);

      // cek expiry
      if (parsed.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return null;
    }
  },

  remove(key: string): void {
    if (!isBrowser()) return;
    localStorage.removeItem(key);
  },

  clear(): void {
    if (!isBrowser()) return;
    localStorage.clear();
  },
};
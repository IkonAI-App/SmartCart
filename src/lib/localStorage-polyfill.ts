// Polyfill for localStorage in Node.js environment
if (typeof window === 'undefined' && typeof global !== 'undefined') {
  const storage = new Map<string, string>();
  
  global.localStorage = {
    getItem: (key: string) => storage.get(key) || null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
    key: (index: number) => Array.from(storage.keys())[index] || null,
    get length() {
      return storage.size;
    },
  } as Storage;
}

export {};


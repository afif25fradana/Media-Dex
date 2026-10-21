export const DataStore = (() => {
  let cachedData = null;
  let inFlightPromise = null;

  return {
    async fetch(signal) {
      signal?.throwIfAborted();
      if (cachedData) {
        return cachedData;
      }

      if (!inFlightPromise) {
        inFlightPromise = (async () => {
          const dataUrl = new URL('../data.json', import.meta.url).href;
          const resp = await fetch(dataUrl, { signal });
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const data = await resp.json();
          if (!data || typeof data !== 'object' || !data.profile || !Array.isArray(data.categories)) {
            throw new Error('Invalid data schema: missing profile or categories');
          }
          cachedData = data;
          return cachedData;
        })().finally(() => {
          inFlightPromise = null;
        });
      }

      return inFlightPromise;
    }
  };
})();

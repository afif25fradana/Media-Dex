export const DataStore = (() => {
  let cachedData = null;

  return {
    async fetch(signal) {
      if (!cachedData) {
        const resp = await fetch('data.json', { signal });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        cachedData = await resp.json();
      }
      return cachedData;
    }
  };
})();

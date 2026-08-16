export const DataStore = (() => {
  let cachedData = null;
  let cachedRecent = null;

  return {
    async fetch() {
      if (!cachedData) {
        const resp = await fetch('data.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        cachedData = await resp.json();
      }
      return cachedData;
    },
    getRecentItems(count = 4) {
      if (!cachedData) return [];
      
      if (!cachedRecent) {
        const allItems = [];
        cachedData.categories.forEach(cat => {
          cat.items.forEach(item => {
            allItems.push({ ...item, categoryTitle: cat.title, categoryId: cat.id });
          });
        });
        allItems.sort((a, b) => {
          const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
          const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
          return dateB - dateA;
        });
        cachedRecent = allItems;
      }
      
      return cachedRecent.slice(0, count);
    }
  };
})();

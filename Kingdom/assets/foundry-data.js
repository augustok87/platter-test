// This module provides a function to set data in a global FOUNDRY_DATA object.
// It's synchronous since it's simply updating an in-memory object without any I/O operations.

/**
 * Sets or updates data in the global FOUNDRY_DATA object.
 * @param {string} dataKey - The key under which the data will be stored.
 * @param {any} data - The data to store.
 */
export const setfoundryData = (dataKey, data) => {
  if (data === '{}') data = null;
  const existingData = window.FOUNDRY_DATA[dataKey];
  if (!existingData) {
    window.FOUNDRY_DATA[dataKey] = data;
    return;
  }

  const dataInArray = Array.isArray(existingData) ? existingData : [existingData];
  window.FOUNDRY_DATA[dataKey] = [...dataInArray, data];
};

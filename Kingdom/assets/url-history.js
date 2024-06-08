// This module handles the URL history functionality. 
// It interacts with the browser's session storage,
// which is a synchronous API, hence the functions here are synchronous.

/**
 * The key used for storing URL history in the session storage.
 */
export const URL_HISTORY_SESSION_KEY = "FOUNDRY_URL_HISTORY";

/**
 * The maximum number of URLs to store in the history.
 * It defines the limit to the number of URL entries that can be stored in the history array.
 */
export const URL_HISTORY_COUNT = 10;

/**
 * Retrieves the history of URLs from session storage.
 * @returns {Array} An array of URL strings.
 */
export const getHistory = () => {
  const historyJSON =
    window.sessionStorage.getItem(URL_HISTORY_SESSION_KEY) || "[]";
  return JSON.parse(historyJSON);
};

/**
 * Adds the current page's URL to the session storage history.
 */
export const pushURL = () => {
  const history = getHistory();
  history.unshift(window.location.pathname);
  window.sessionStorage.setItem(
    URL_HISTORY_SESSION_KEY,
    JSON.stringify(history.slice(0, URL_HISTORY_COUNT))
  );
};

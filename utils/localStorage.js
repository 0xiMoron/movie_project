export function setLocalStorageVariable(key, value) {
  localStorage.setItem(key, value);
}

export function setAndReturnLocalStorageVariable(key, value) {
  localStorage.setItem(key, value);
  return localStorage.getItem(key);
}

export function getLocalStorageVariable(key) {
  return localStorage.getItem(key);
}

export function deleteLocalStorageVariable(key) {
  localStorage.removeItem(key);
}

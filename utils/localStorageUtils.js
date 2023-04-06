export function setLocalStorageVariable(key, value) {
  localStorage.setItem(key, value);
}

export function setAndReturnLocalStorageVariable(key, value) {
  localStorage.setItem(key, value);
  return localStorage.getItem(key);
}

export function setLocalStorageArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function setAndReturnLocalStorageArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return JSON.parse(localStorage.getItem(key));
}

export function getLocalStorageVariable(key) {
  return localStorage.getItem(key);
}

export function getLocalStorageArray(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function deleteLocalStorageVariable(key) {
  localStorage.removeItem(key);
}

// utils/storage.js
export const getStorageItem = (key) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
    }
    return null;
};

export const setStorageItem = (key, value) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
    }
};

export const removeStorageItem = (key) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
    }
};